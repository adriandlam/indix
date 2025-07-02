"use server";

import { resend } from "@/lib/resend";
import { prisma } from "@indix/db";
import { z } from "zod";

const waitlistSchema = z.object({
  email: z.string().email().min(1),
});

export async function joinWaitlist(data: z.infer<typeof waitlistSchema>) {
  const parsedData = waitlistSchema.safeParse(data);

  if (!parsedData.success) {
    throw new Error("Please enter a valid email address");
  }

  const { email } = parsedData.data;

  try {
    // Check for user in waitlist
    const existingEntry = await prisma.waitlist.findUnique({
      where: { email },
    });

    if (existingEntry) {
      return {
        message:
          "Thanks! You're already on our waitlist. We'll be in touch soon!",
      };
    }

    // Create new waitlist entry
    await prisma.waitlist.create({
      data: {
        email,
      },
    });

    // Add to Resend audience
    try {
      await resend.contacts.create({
        email: email,
        audienceId: "c30f8266-b200-4c19-97d5-a7bd1e1d256d",
      });
    } catch (resendError) {
      console.error(
        "Failed to add to Resend:",
        resendError instanceof Error ? resendError.message : resendError
      );
    }

    return {
      message: "Thanks for joining! We'll notify you when indix is ready.",
    };
  } catch (error) {
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
  //   subject: "Welcome to indix",
  //   html: "<p>Thank you for joining the waitlist!</p>",
  // });

  // if (response.error) {
  //   console.error(response.error);
  // }
}
