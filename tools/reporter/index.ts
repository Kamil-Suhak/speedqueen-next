import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
dotenv.config(); // fallback to process.env

import React from "react";
import { render } from "react-email";
import { Resend } from "resend";
import { MonthlyReportEmail } from "./template";
import { fetchGooglePlacesReputation } from "./adapters/googlePlaces";
import { fetchCloudflareVisitorMetrics } from "./adapters/cloudflare";

function getPolishMonthName(): string {
  const date = new Date();
  // If run early in the month (e.g. 1st-5th), report is for the previous month
  if (date.getDate() <= 5) {
    date.setMonth(date.getMonth() - 1);
  }
  const monthName = date.toLocaleDateString("pl-PL", { month: "long" });
  const year = date.getFullYear();
  // Capitalize first letter of Polish month
  const capitalizedMonth = monthName.charAt(0).toUpperCase() + monthName.slice(1);
  return `${capitalizedMonth} ${year}`;
}

async function main() {
  const isSend = process.argv.includes("--send");
  const period = getPolishMonthName();
  const recipientEmail =
    process.env.RESEND_TO_EMAIL || "kontakt@speedqueenkrk.pl";

  console.log("==========================================");
  console.log(`📊 Speed Queen Monthly Reporter — ${period}`);
  console.log("==========================================");

  // 1. Fetch metrics from adapters
  console.log("📡 Pobieranie danych z Google Places i Cloudflare...");
  const [reputation, traffic] = await Promise.all([
    fetchGooglePlacesReputation(),
    fetchCloudflareVisitorMetrics(),
  ]);

  console.log(`✅ Odwiedzający: ${traffic.visits.toLocaleString("pl-PL")}`);
  console.log(`✅ Odsłony: ${traffic.pageViews.toLocaleString("pl-PL")}`);
  console.log(`✅ Średnia ocena Google: ${reputation.averageRating.toFixed(1)} ★ (${reputation.totalReviews} opinii)`);
  console.log(`✅ Odbiorca: ${recipientEmail}`);

  // 2. Render React Email template to HTML
  console.log("🎨 Generowanie szablonu HTML wiadomości...");
  const emailElement = React.createElement(MonthlyReportEmail, {
    period,
    traffic,
    reputation,
    recipientEmail,
  });

  const html = await render(emailElement);

  // 3. Dispatch or Dry Run
  if (isSend) {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      console.error("❌ Błąd: Brak zmiennej RESEND_API_KEY w środowisku!");
      process.exit(1);
    }

    console.log(`🚀 Wysyłanie raportu na adres: ${recipientEmail}...`);
    const resend = new Resend(apiKey);
    const { data, error } = await resend.emails.send({
      from: "Raporty Speed Queen <noreply@mail.speedqueenkrk.pl>",
      to: [recipientEmail],
      subject: `📊 Raport Widoczności Speed Queen Kraków (${period})`,
      html,
    });

    if (error) {
      console.error("❌ Błąd podczas wysyłania przez Resend:", error);
      process.exit(1);
    }

    console.log("🎉 Raport został pomyślnie wysłany! ID wiadomości:", data?.id);
  } else {
    console.log("ℹ️ Tryb podglądu (--dry-run). Wiadomość NIE została wysłana.");
    console.log("💡 Aby wysłać raport, uruchom polecenie z flagą --send.");
  }
}

main().catch((err) => {
  console.error("❌ Nieoczekiwany błąd w generatorze raportu:", err);
  process.exit(1);
});
