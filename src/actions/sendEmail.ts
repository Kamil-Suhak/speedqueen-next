"use server";

import { Resend } from "resend";
import { render } from "@react-email/render";
import { ContactFormEmail } from "@/components/emails/ContactFormEmail";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendEmail(formData: FormData) {
  if (process.env.NODE_ENV === "test") {
    return { success: false, error: "Test mode - email not sent." };
  }

  const name = formData.get("senderName") as string;
  const email = formData.get("senderEmail") as string;
  const message = formData.get("message") as string;

  try {
    if (!process.env.RESEND_TO_EMAIL) {
      throw new Error("Missing RESEND_TO_EMAIL environment variable.");
    }

    const htmlContent = await render(
      ContactFormEmail({ name, email, message })
    );

    const data = await resend.emails.send({
      from: "Strona Internetowa SQ <noreply@mail.speedqueenkrk.pl>",
      to: [process.env.RESEND_TO_EMAIL],
      subject: `Nowe pytanie od: ${name}`,
      replyTo: email,
      html: htmlContent,
    });

    return { success: true };
  } catch (error) {
    return { success: false, error: "Failed to send email." };
  }
}

