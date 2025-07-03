import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "@indix/db";
import { emailOTP } from "better-auth/plugins";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const auth = betterAuth({
  appName: "indix",
  plugins: [
    emailOTP({
      sendVerificationOnSignUp: true,
      async sendVerificationOTP({ email, otp, type }) {
        try {
          await resend.emails.send({
            from: process.env.FROM_EMAIL || "noreply@indix.app",
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
            This code will expire in 10 minutes. If you didn't request this code, you can safely ignore this email.
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
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
    },
  },
});

export type Auth = typeof auth;
export type Session = Auth["$Infer"]["Session"];
