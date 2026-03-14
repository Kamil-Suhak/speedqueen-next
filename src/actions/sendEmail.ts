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
      from: "Strona Internetowa SQ <noreply@mail.speedqueenkrk.pl>",
      to: [process.env.RESEND_TO_EMAIL!],
      subject: `Nowe pytanie od: ${name}`,
      replyTo: email,
      html: `
        <h3>Zostało wysłane nowe pytanie poprzez formularz kontaktowy</h3>
        <p><strong>Imię i nazwisko:</strong> ${name}</p>
        <p><strong>E-mail:</strong> ${email}</p>
        <p><strong>Wiadomość:</strong></p>
        <p>${message}</p>
        <hr />
        <p>Aby odpowiedzieć na pytanie, napisz maila na adres: ${email} lub kliknij 'Odpowiedz'</p>
      `,
    });

    return { success: true };
  } catch (error) {
    return { success: false, error: "Failed to send email." };
  }
}
