export interface ClaimDiscountContent {
  form: {
    successMessage: string;
    errorInvalidEmail: string;
    errorNoConsent: string;
    errorPromoNotStarted: string;
    errorAlreadyClaimed: string;
    errorNoCodes: string;
    errorEmailFailed: string;
    errorServer: string;
  };
  email: {
    subject: string;
    greeting: string;
    body: string;
    instruction: string;
    footer: string;
  };
}

export function getClaimDiscountEmailTemplate(
  emailContent: ClaimDiscountContent['email'],
  baseUrl: string,
  logoUrl: string,
  blobUrl: string
) {
  return `
    <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff; border: 1px solid #eeeeee; border-radius: 12px; overflow: hidden;">
      <div style="background-color: #e7272d; padding: 20px; text-align: center;">
        <a href="${baseUrl}" target="_blank" style="text-decoration: none;">
          <img src="${logoUrl}" alt="Speed Queen Kraków" style="width: 80px; height: 80px; display: block; margin: 0 auto; border-radius: 8px;" />
        </a>
      </div>
      <div style="padding: 40px 30px; text-align: center;">
        <h1 style="color: #1d1d1b; font-size: 24px; margin-bottom: 20px; font-weight: bold;">${emailContent.greeting}</h1>
        <p style="color: #4a4a4a; font-size: 16px; line-height: 1.6; margin-bottom: 30px;">${emailContent.body}</p>
        <div style="background-color: #f9f9f9; padding: 20px; border-radius: 8px; margin-bottom: 30px; display: inline-block;">
          <img src="${blobUrl}" alt="QR Code" style="max-width: 200px; height: auto; display: block; margin: 0 auto;" />
        </div>
        <p style="color: #e7272d; font-weight: bold; font-size: 16px; margin-bottom: 0;">${emailContent.instruction}</p>
      </div>
      <div style="background-color: #f3f4f6; padding: 20px; text-align: center; border-top: 1px solid #eeeeee;">
        <p style="color: #666666; font-size: 14px; margin: 0;">${emailContent.footer}</p>
        <p style="color: #999999; font-size: 12px; margin-top: 10px;">Speed Queen Kraków<br />Pawia 34 | Słowackiego 56 | Orlińskiego 1</p>
      </div>
    </div>
  `;
}

export function getContactFormEmailTemplate(
  name: string,
  email: string,
  message: string
) {
  return `
    <h3>Zostało wysłane nowe pytanie poprzez formularz kontaktowy</h3>
    <p><strong>Imię i nazwisko:</strong> ${name}</p>
    <p><strong>E-mail:</strong> ${email}</p>
    <p><strong>Wiadomość:</strong></p>
    <p>${message}</p>
    <hr />
    <p>Aby odpowiedzieć na pytanie, napisz maila na adres: ${email} lub kliknij 'Odpowiedz'</p>
  `;
}
