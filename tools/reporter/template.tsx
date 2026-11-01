import React from "react";
import {
  Body,
  Container,
  Head,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from "react-email";
import {
  KpiCard,
  VisualSplitBar,
  BranchRow,
} from "./components/EmailComponents";
import { GooglePlacesReportData } from "./adapters/googlePlaces";
import { CloudflareVisitorMetrics } from "./adapters/cloudflare";

export interface MonthlyReportProps {
  period: string; // e.g. "Październik 2026"
  traffic: CloudflareVisitorMetrics;
  reputation: GooglePlacesReportData;
  recipientEmail: string;
}

export const MonthlyReportEmail = ({
  period,
  traffic,
  reputation,
  recipientEmail,
}: MonthlyReportProps) => {
  return (
    <Html>
      <Head />
      <Preview>
        Raport Widoczności Speed Queen Kraków ({period}) — {traffic.visits.toLocaleString("pl-PL")} odwiedzających, ocena {reputation.averageRating.toFixed(1)} ★
      </Preview>
      <Body
        style={{
          backgroundColor: "#f8fafc",
          fontFamily:
            '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
          margin: "0",
          padding: "24px 0",
        }}
      >
        <Container
          style={{
            maxWidth: "600px",
            margin: "0 auto",
            backgroundColor: "#ffffff",
            borderRadius: "18px",
            border: "1px solid #e2e8f0",
            overflow: "hidden",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
          }}
        >
          {/* Header Banner */}
          <Section
            style={{
              backgroundColor: "#e7272d",
              padding: "28px 24px 24px 24px",
              textAlign: "left",
            }}
          >
            <Text
              style={{
                margin: "0 0 6px 0",
                fontSize: "12px",
                fontWeight: "800",
                color: "#ffffff",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
              }}
            >
              SPEED QUEEN KRAKÓW
            </Text>
            <Text
              style={{
                margin: "0 0 4px 0",
                fontSize: "24px",
                fontWeight: "800",
                color: "#ffffff",
                lineHeight: "1.2",
              }}
            >
              Miesięczny Raport Widoczności
            </Text>
            <Text
              style={{
                margin: "0",
                fontSize: "13px",
                color: "rgba(255, 255, 255, 0.9)",
                fontWeight: "500",
              }}
            >
              Podsumowanie aktywności za okres: <strong>{period}</strong>
            </Text>
          </Section>

          {/* Body Container */}
          <Section style={{ padding: "24px 24px 8px 24px" }}>
            {/* Intro paragraph */}
            <Text
              style={{
                margin: "0 0 20px 0",
                fontSize: "14px",
                color: "#334155",
                lineHeight: "1.6",
              }}
            >
              Dzień dobry! Poniżej znajduje się comiesięczne podsumowanie widoczności strony internetowej oraz opinii klientów dla Twoich 3 samoobsługowych pralni w Krakowie.
            </Text>

            {/* Section 1: KPI Cards */}
            <table
              width="100%"
              cellPadding="0"
              cellSpacing="0"
              border={0}
              style={{ margin: "0 0 24px 0" }}
            >
              <tbody>
                <tr>
                  <KpiCard
                    label="Odwiedzający"
                    value={traffic.visits.toLocaleString("pl-PL")}
                    subtitle="Prawdziwe osoby na stronie"
                  />
                  <td width="10" />
                  <KpiCard
                    label="Odsłony podstron"
                    value={traffic.pageViews.toLocaleString("pl-PL")}
                    subtitle={`Śr. ${traffic.pagesPerVisit} str./osobę`}
                  />
                  <td width="10" />
                  <KpiCard
                    label="Ocena w Google"
                    value={`${reputation.averageRating.toFixed(1)} ★`}
                    subtitle={`${reputation.totalReviews} opinii łącznie`}
                  />
                </tr>
              </tbody>
            </table>

            {/* Section 2: Visual Device & Language Bars */}
            <Text
              style={{
                margin: "0 0 12px 0",
                fontSize: "16px",
                fontWeight: "800",
                color: "#0f172a",
                borderBottom: "2px solid #f1f5f9",
                paddingBottom: "8px",
              }}
            >
              Skąd i jak klienci sprawdzają pralnie?
            </Text>

            <VisualSplitBar
              leftLabel="Telefony komórkowe"
              leftPct={traffic.mobilePct}
              leftColor="#e7272d"
              rightLabel="Komputery"
              rightPct={traffic.desktopPct}
              rightColor="#0f172a"
              description="Aż 3 na 4 klientów przegląda ofertę na smartfonie — najczęściej w drodze do pralni lub sprawdzając cennik i wolne programy będąc już na miejscu."
            />

            <VisualSplitBar
              leftLabel="Język polski"
              leftPct={traffic.polishPct}
              leftColor="#e7272d"
              rightLabel="Język angielski"
              rightPct={traffic.englishPct}
              rightColor="#0284c7"
              description="Prawie co trzeci użytkownik korzysta z wersji angielskiej. Potwierdza to stały napływ studentów zagranicznych (Erasmus) oraz turystów w Krakowie."
            />

            {/* Section 3: Google Places Reputation */}
            <Text
              style={{
                margin: "24px 0 12px 0",
                fontSize: "16px",
                fontWeight: "800",
                color: "#0f172a",
                borderBottom: "2px solid #f1f5f9",
                paddingBottom: "8px",
              }}
            >
              Reputacja w Google Maps — Wszystkie 3 Pralnie
            </Text>

            {reputation.branches.map((branch) => (
              <BranchRow
                key={branch.name}
                name={branch.name}
                address={branch.address}
                rating={branch.rating}
                reviews={branch.totalReviews}
              />
            ))}

            {/* Section 4: Customer Review Spotlight */}
            {reputation.featuredReview && (
              <Section
                style={{
                  margin: "20px 0 16px 0",
                  padding: "18px 20px",
                  backgroundColor: "#fff1f2",
                  borderRadius: "14px",
                  borderLeft: "4px solid #e7272d",
                }}
              >
                <Text
                  style={{
                    margin: "0 0 6px 0",
                    fontSize: "11px",
                    fontWeight: "800",
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                    color: "#e7272d",
                  }}
                >
                  WYRÓŻNIONA OPINIA Z GOOGLE MAPS
                </Text>
                <Text
                  style={{
                    margin: "0 0 10px 0",
                    fontSize: "14px",
                    fontStyle: "italic",
                    color: "#1e293b",
                    lineHeight: "1.5",
                  }}
                >
                  „{reputation.featuredReview.text}”
                </Text>
                <Text
                  style={{
                    margin: "0",
                    fontSize: "12px",
                    fontWeight: "700",
                    color: "#475569",
                  }}
                >
                  — {reputation.featuredReview.author} • ★★★★★ ({reputation.featuredReview.branchName})
                </Text>
              </Section>
            )}

            <Hr style={{ borderColor: "#e2e8f0", margin: "24px 0 16px 0" }} />

            {/* Footer */}
            <Text
              style={{
                margin: "0 0 8px 0",
                fontSize: "11px",
                color: "#94a3b8",
                lineHeight: "1.5",
              }}
            >
              Raport generowany automatycznie na 1. dzień każdego miesiąca. Liczba odwiedzających przedstawia realne, unikalne sesje użytkowników z odfiltrowaniem robotów sieciowych.
            </Text>
            <Text
              style={{
                margin: "0",
                fontSize: "11px",
                color: "#94a3b8",
              }}
            >
              Wysłano na adres: <strong>{recipientEmail}</strong> • Speed Queen Kraków
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

export default MonthlyReportEmail;
