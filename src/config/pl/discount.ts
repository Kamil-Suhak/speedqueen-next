export const discountPl = {
  title: "Odbierz kod rabatowy",
  subtitle: "Wpisz swój e-mail, aby otrzymać unikalny kod QR ze zniżką na pranie w Speed Queen Kraków.",
  form: {
    email: "Adres e-mail",
    emailPlaceholder: "twoj@email.pl",
    consent: "Wyrażam zgodę na przetwarzanie mojego adresu e-mail przez Speed Queen Kraków w celu jednorazowego przesłania kodu rabatowego zgodnie z ((polityką prywatności)).",
    button: "Odbierz kod QR",
    buttonLoading: "Wysyłanie...",
    successMessage: "Kod został wysłany na Twój e-mail!",
    errorInvalidEmail: "Nieprawidłowy adres e-mail.",
    errorNoConsent: "Wymagana zgoda na przetwarzanie danych.",
    errorAlreadyClaimed: "Już odebrałeś swój kod rabatowy!",
    errorNoCodes: "Wszystkie kody zostały już rozdane.",
    errorEmailFailed: "Błąd podczas wysyłania e-maila.",
    errorServer: "Wystąpił błąd serwera.",
    errorPromoNotStarted: "Promocja startuje 30 marca.",
    errorEmailTypo: "Czy na pewno wpisałeś poprawny e-mail? Wykryto literówkę w domenie.",
    errorDomainInvalid: "Podana domena e-mail nie istnieje lub nie może odbierać wiadomości.",
    errorPromoEnded: "Ta promocja dobiegła już końca.",
  },
  email: {
    subject: "Twój kod rabatowy Speed Queen Kraków",
    greeting: "Cześć!",
    body: "Dziękujemy za zainteresowanie Speed Queen Kraków. Oto Twój unikalny kod rabatowy w formie kodu QR, który możesz wykorzystać przy następnej wizycie w jednej z naszych pralni.",
    instruction: "Zeskanuj ten kod przy panelu płatniczym, aby otrzymać zniżkę.",
    brightnessTip: "💡 Wskazówka: zwiększ jasność ekranu podczas skanowania.",
    printTip: "Jeśli nadal masz problemy, wydrukuj kod lub zadzwoń na naszą infolinię: ",
    expirationNotice: "⚠️ Pamiętaj: Twój kod QR wygasa 30 czerwca 2026 r.",
    footer: "Do zobaczenia w Speed Queen!",
  }
};

export default discountPl;
