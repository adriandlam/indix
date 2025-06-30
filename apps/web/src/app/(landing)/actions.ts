"use server";

import { resend } from "@/lib/resend";

export async function joinWaitlist(email: string) {
  resend.contacts.create({
    email: email,
    audienceId: "c30f8266-b200-4c19-97d5-a7bd1e1d256d",
  });

  // TODO: add email template, verify email in resend
  const response = await resend.emails.send({
    from: "Adrian <me@adriandlam.com>",
    to: [email],
    subject: "Welcome to Index",
    html: "<p>Thank you for joining the waitlist!</p>",
  });

  if (response.error) {
    console.error(response.error);
  }
}
