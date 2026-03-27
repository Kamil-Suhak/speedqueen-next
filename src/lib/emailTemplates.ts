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
    brightnessTip: string;
    printTip: string;
    footer: string;
  };
}

export function getClaimDiscountEmailTemplate(
  emailContent: ClaimDiscountContent['email'],
  baseUrl: string,
  logoUrl: string,
  blobUrl: string,
  phone: string
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
        <div style="background-color: #ffffff; padding: 24px; border-radius: 12px; margin-bottom: 24px; display: inline-block; border: 2px solid #eeeeee;">
          <!-- Enforcing background-color on the img tag prevents dark-mode from ruining transparent PNGs -->
          <img src="${blobUrl}" alt="QR Code" width="250" height="250" style="width: 250px; height: 250px; display: block; margin: 0 auto; background-color: #ffffff;" />
        </div>
        <p style="color: #e7272d; font-weight: bold; font-size: 16px; margin-bottom: 8px;">${emailContent.instruction}</p>
        <p style="color: #666666; font-size: 13px; margin-top: 0; margin-bottom: 4px;">${emailContent.brightnessTip}</p>
        <p style="color: #666666; font-size: 13px; margin-top: 0;">${emailContent.printTip} <a href="tel:${phone.replace(/\s+/g, '')}" style="color: #e7272d; text-decoration: none; font-weight: bold;">${phone}</a></p>
      </div>
      <div style="background-color: #f3f4f6; padding: 20px; text-align: center; border-top: 1px solid #eeeeee;">
        <p style="color: #666666; font-size: 14px; margin: 0;">${emailContent.footer}</p>
        <p style="color: #999999; font-size: 12px; margin-top: 10px;">Speed Queen Kraków<br />Pawia 34 | Słowackiego 56 | Orlińskiego 1</p>
      </div>
    </div>
  `;
}


