"use server";

import { Resend } from "resend";
import { render } from "react-email";
import { ContactFormEmail } from "@/components/emails/ContactFormEmail";

function getResend() {
  if (!process.env.RESEND_API_KEY) {
    throw new Error("Missing RESEND_API_KEY environment variable.");
  }
  return new Resend(process.env.RESEND_API_KEY);
}

export async function sendEmail(formData: FormData) {
  if (process.env.NODE_ENV === "test") {
    return { success: false, error: "Test mode - email not sent." };
  }

  const name = formData.get("senderName") as string;
  const email = formData.get("senderEmail") as string;
  const message = formData.get("message") as string;
  const honeypot = formData.get("do_not_fill") as string;

  if (honeypot) {
    // If honeypot is filled, silently ignore and pretend success to deter bots
    return { success: true };
  }

  // Server-side spam checks (matching client-side)
  const messageStr = message || "";
  if (
    messageStr.split(/\s+/).some((word) => word.length > 25) ||
    messageStr.trim().split(/\s+/).length < 3 ||
    /(http:\/\/|https:\/\/|www\.)/i.test(messageStr)
  ) {
    // Silently ignore spam messages so bots think they succeeded
    return { success: true };
  }

  try {
    if (!process.env.RESEND_TO_EMAIL) {
      throw new Error("Missing RESEND_TO_EMAIL environment variable.");
    }

    const htmlContent = await render(
      ContactFormEmail({ name, email, message }),
    );

    const resend = getResend();
    const { error: sendError } = await resend.emails.send({
      from: "Strona Internetowa SQ <noreply@mail.speedqueenkrk.pl>",
      to: [process.env.RESEND_TO_EMAIL],
      subject: `Nowe pytanie od: ${name}`,
      replyTo: email,
      html: htmlContent,
    });

    if (sendError) {
      console.error("Resend error:", sendError);
      return { success: false, error: "Failed to send email." };
    }

    return { success: true };
  } catch (error) {
    console.error("sendEmail exception:", error);
    return { success: false, error: "Failed to send email." };
  }
}
