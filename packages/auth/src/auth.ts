import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "@indix/db";
import { emailOTP } from "better-auth/plugins";
import { Resend } from "resend";
import { randomBytes } from "crypto";

const resend = new Resend(process.env.RESEND_API_KEY);

export const auth = betterAuth({
  appName: "indix",
  user: {
    additionalFields: {
      encryptionSalt: {
        type: "string",
        required: false,
        defaultValue: "",
        returned: true,
      },
    },
  },
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  databaseHooks: {
    user: {
      create: {
        after: async (user, ctx) => {
          const salt = randomBytes(32).toString("hex");
          await prisma.user.update({
            where: { id: user.id },
            data: { encryptionSalt: salt },
          });
        },
      },
    },
  },
  emailAndPassword: {
    enabled: true,
    sendResetPassword: async ({ user, url, token }, request) => {
      await resend.emails.send({
        from: "noreply@indix.app",
        to: user.email,
        subject: "Reset your password",
        html: `
        <div>
        <h1>Reset your password</h1>
        <p>Click the link to reset your password:</p>
        <a href="${url}">Reset password</a>
        </div>
        `,
      });
    },
  },
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
    },
  },
  plugins: [
    emailOTP({
      sendVerificationOnSignUp: true,
      async sendVerificationOTP({ email, otp, type }) {
        try {
          await resend.emails.send({
            from: "noreply@indix.app",
            to: email,
            subject: "Your indix verification code",
            html: `
            <div>
            <h1>
            Your verification code
            </h1>
            <p>
            Use this code to complete your sign-in to indix:
            </p>
            <div>
              ${otp}
            </div>
            <p>
            This code will expire in 5 minutes. If you didn't request this code, you can safely ignore this email.
            </p>
            </div>
              `,
          });
        } catch (error) {
          console.error("Failed to send OTP email:", error);
          throw new Error("Failed to send verification code");
        }
      },
    }),
  ],
});

export type Auth = typeof auth;
export type Session = Auth["$Infer"]["Session"];
