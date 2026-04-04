export const discountEn = {
  title: "Get your discount code",
  subtitle: "Enter your email to receive a unique QR code for a discount on laundry at Speed Queen Krakow.",
  form: {
    email: "Email address",
    emailPlaceholder: "your@email.com",
    consent: "I agree to the processing of my email address by Speed Queen Krakow for the purpose of a one-time sending of a discount code in accordance with the ((privacy policy)).",
    button: "Get QR Code",
    buttonLoading: "Sending...",
    successMessage: "The code has been sent to your email!",
    errorInvalidEmail: "Invalid email address.",
    errorNoConsent: "Consent for data processing is required.",
    errorAlreadyClaimed: "You have already claimed your discount code!",
    errorNoCodes: "All codes have already been distributed.",
    errorEmailFailed: "Error sending email.",
    errorServer: "A server error occurred.",
    errorPromoNotStarted: "The promotion starts March 30th.",
    errorEmailTypo: "Are you sure you typed your email correctly? A typo was detected in the domain.",
    errorDomainInvalid: "The email domain provided does not exist or cannot receive mail.",
    errorPromoEnded: "This promotion has already ended.",
  },
  email: {
    subject: "Your Speed Queen Krakow Discount Code",
    greeting: "Hello!",
    body: "Thank you for your interest in Speed Queen Krakow. Here is your unique discount code in the form of a QR code, which you can use on your next visit to one of our laundromats.",
    instruction: "Scan this code at the payment terminal to receive your discount.",
    brightnessTip: "💡 Pro tip: maximize your screen brightness when scanning.",
    printTip: "If you're still having trouble, you can print this code or call our helpline: ",
    expirationNotice: "This discount expires June 30th 2026.",
    footer: "See you at Speed Queen!",
  }
};

export default discountEn;

