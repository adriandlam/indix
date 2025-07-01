"use server";

import { resend } from "@/lib/resend";
import { prisma } from "@index/db";
import { z } from "zod";

const waitlistSchema = z.object({
  email: z.string().email().min(1),
});

export async function joinWaitlist(data: z.infer<typeof waitlistSchema>) {
  const parsedData = waitlistSchema.safeParse(data);

  if (!parsedData.success) {
    return {
      error: "Please enter a valid email address",
    };
  }

  const { email } = parsedData.data;

  try {
    // Check for user in waitlist
    const existingEntry = await prisma.waitlist.findUnique({
      where: { email },
    });

    if (existingEntry) {
      return {
        success: true,
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
      success: true,
      message: "Thanks for joining! We'll notify you when Index is ready.",
    };
  } catch (error) {
    console.error(
      "Waitlist signup error:",
      error instanceof Error ? error.message : error
    );
    return {
      error: "Something went wrong. Please try again.",
    };
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
