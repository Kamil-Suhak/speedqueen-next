"use server";

import { Resend } from "resend";
// import { GlobalConfig } from "../config/site-config";

// testing
const isTest = false;

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendEmail(formData: FormData) {
  if (isTest) {
    return { success: false, error: "Test mode - email not sent." };
  }

  const name = formData.get("senderName") as string;
  const email = formData.get("senderEmail") as string;
  const message = formData.get("message") as string;

  try {
    const data = await resend.emails.send({
      from: "Leads <onboarding@resend.dev>",
      //   to: [GlobalConfig.brand.email],
      to: [process.env.RESEND_TO_EMAIL!],
      subject: `New Lead from ${name}`,
      replyTo: email,
      html: `
        <h3>New Contact Form Submission</h3>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `,
    });

    return { success: true };
  } catch (error) {
    return { success: false, error: "Failed to send email." };
  }
}
