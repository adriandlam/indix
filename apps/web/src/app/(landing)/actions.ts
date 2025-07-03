"use server";

import { resend } from "@/lib/resend";
import { prisma } from "@index/db";
import { z } from "zod";

const waitlistSchema = z.object({
  email: z.string().email().min(1),
});

function getWelcomeEmailTemplate() {
  return `
<h1>Welcome to Indix</h1>
<p>Thanks for joining the waitlist!</p>
<p>Indix is a native Markdown note-taking app that's private, secure, and local-first.</p>
<p>I'll notify you as soon as it's ready to use.</p>
<p>P.S. If you'd like to help out, it's open source and you can find the code on <a href="https://github.com/adriandlam/indix">GitHub</a>.</p>
<p>- Adrian</p>`;
}

export async function joinWaitlist(data: z.infer<typeof waitlistSchema>) {
  const parsedData = waitlistSchema.safeParse(data);

  if (!parsedData.success) {
    throw new Error("Please enter a valid email address");
  }

  const { email } = parsedData.data;

  try {
    await prisma.waitlist.create({
      data: {
        email,
      },
    });

    try {
      resend.contacts.create({
        email: email,
        audienceId: "c30f8266-b200-4c19-97d5-a7bd1e1d256d",
      });
      resend.emails.send({
        from: "Adrian <adrian@indix.app>",
        to: [email],
        subject: "Welcome to Indix",
        html: getWelcomeEmailTemplate(),
      });
    } catch (resendError) {
      console.error(
        "Failed to add to Resend:",
        resendError instanceof Error ? resendError.message : resendError
      );
    }

    return {
      message: "Thanks for joining! We'll notify you when Indix is ready.",
    };
  } catch (error) {
    // Handle unique constraint violation (email already exists)
    if (error.code === "P2002") {
      return {
        message:
          "Thanks! You're already on our waitlist. We'll be in touch soon!",
      };
    }

    console.error(
      "Waitlist signup error:",
      error instanceof Error ? error.message : error
    );
    throw new Error("Something went wrong. Please try again.");
  }

  // TODO: add email template, verify email in resend
  // const response = await resend.emails.send({
  //   from: "Adrian <me@adriandlam.com>",
  //   to: [email],
  //   subject: "Welcome to Index",
  //   html: "<p>Thank you for joining the waitlist!</p>",
  // });

  // if (response.error) {
  //   console.error(response.error);
  // }
}
