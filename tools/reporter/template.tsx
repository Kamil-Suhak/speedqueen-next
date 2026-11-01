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
import { KpiCard, VisualSplitBar } from "./components/EmailComponents";
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
        Raport Witryny Speed Queen ({period}) — {traffic.visits.toLocaleString("pl-PL")} wizyt, śr. {traffic.dailyAverage.toLocaleString("pl-PL")}/dzień
      </Preview>
      <Body
        style={{
          backgroundColor: "#f8fafc",
          fontFamily:
            '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
          margin: "0",
          padding: "32px 0",
        }}
      >
        <Container
          style={{
            maxWidth: "600px",
            margin: "0 auto",
            backgroundColor: "#ffffff",
            borderRadius: "12px",
            border: "1px solid #e2e8f0",
            borderTop: "4px solid #e7272d",
            overflow: "hidden",
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)",
          }}
        >
          {/* Executive Header */}
          <Section
            style={{
              padding: "24px 24px 20px 24px",
              borderBottom: "1px solid #f1f5f9",
              textAlign: "left",
            }}
          >
            <Text
              style={{
                margin: "0 0 4px 0",
                fontSize: "11px",
                lineHeight: "14px",
                fontWeight: "800",
                color: "#e7272d",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
              }}
            >
              SPEED QUEEN KRAKÓW
            </Text>
            <Text
              style={{
                margin: "0 0 6px 0",
                fontSize: "22px",
                lineHeight: "26px",
                fontWeight: "800",
                color: "#0f172a",
              }}
            >
              Miesięczny Raport Ruchu Witryny
            </Text>
            <Text
              style={{
                margin: "0",
                fontSize: "13px",
                lineHeight: "16px",
                color: "#64748b",
                fontWeight: "500",
              }}
            >
              Okres: <strong style={{ color: "#0f172a" }}>{period}</strong> • speedqueenkrk.pl
            </Text>
          </Section>

          {/* Main Body */}
          <Section style={{ padding: "24px" }}>
            {/* Section 1: Core Website Performance */}
            <Text
              style={{
                margin: "0 0 12px 0",
                fontSize: "12px",
                lineHeight: "16px",
                fontWeight: "700",
                color: "#0f172a",
                textTransform: "uppercase",
                letterSpacing: "0.06em",
              }}
            >
              Ruch i Zaangażowanie
            </Text>

            <table
              width="100%"
              cellPadding="0"
              cellSpacing="0"
              border={0}
              style={{ margin: "0 0 12px 0" }}
            >
              <tbody>
                <tr>
                  <KpiCard
                    label="Wizyty"
                    value={traffic.visits.toLocaleString("pl-PL")}
                  />
                  <td width="8" />
                  <KpiCard
                    label="Średnio / Dzień"
                    value={traffic.dailyAverage.toLocaleString("pl-PL")}
                  />
                  <td width="8" />
                  <KpiCard
                    label="Odsłony"
                    value={traffic.pageViews.toLocaleString("pl-PL")}
                  />
                  <td width="8" />
                  <KpiCard
                    label="Strony / Wizyta"
                    value={traffic.pagesPerVisit.toFixed(2)}
                  />
                </tr>
              </tbody>
            </table>

            {/* Peak Day Highlight Row */}
            {traffic.peakDay && traffic.peakDay.visitors > 0 && (
              <table
                width="100%"
                cellPadding="0"
                cellSpacing="0"
                border={0}
                style={{
                  backgroundColor: "#f8fafc",
                  border: "1px solid #e2e8f0",
                  borderRadius: "8px",
                  margin: "0 0 24px 0",
                }}
              >
                <tbody>
                  <tr>
                    <td style={{ padding: "12px 16px" }}>
                      <Text
                        style={{
                          margin: "0",
                          fontSize: "13px",
                          lineHeight: "16px",
                          color: "#334155",
                        }}
                      >
                        <span
                          style={{
                            display: "inline-block",
                            width: "8px",
                            height: "8px",
                            borderRadius: "50%",
                            backgroundColor: "#e7272d",
                            marginRight: "8px",
                            verticalAlign: "middle",
                          }}
                        />
                        <strong>Dzień szczytowy:</strong> {traffic.peakDay.formattedDate} —{" "}
                        <strong style={{ color: "#0f172a" }}>
                          {traffic.peakDay.visitors.toLocaleString("pl-PL")}
                        </strong>{" "}
                        wizyt
                      </Text>
                    </td>
                  </tr>
                </tbody>
              </table>
            )}

            {/* Section 2: Visitor Demographics & Devices */}
            <Text
              style={{
                margin: "0 0 6px 0",
                fontSize: "12px",
                lineHeight: "16px",
                fontWeight: "700",
                color: "#0f172a",
                textTransform: "uppercase",
                letterSpacing: "0.06em",
              }}
            >
              Struktura Ruchu
            </Text>

            {traffic.deviceBreakdown && (
              <VisualSplitBar
                leftLabel="Smartfony"
                leftPct={traffic.deviceBreakdown.mobilePct}
                leftColor="#e7272d"
                rightLabel="Komputery"
                rightPct={traffic.deviceBreakdown.desktopPct}
                rightColor="#0f172a"
              />
            )}

            {traffic.languageBreakdown && (
              <VisualSplitBar
                leftLabel="Wersja polska"
                leftPct={traffic.languageBreakdown.polishPct}
                leftColor="#e7272d"
                rightLabel="Wersja angielska"
                rightPct={traffic.languageBreakdown.englishPct}
                rightColor="#475569"
              />
            )}

            {/* Section 3: Google Maps scoped to last month */}
            <Hr
              style={{
                border: "none",
                borderTop: "1px solid #e2e8f0",
                margin: "24px 0 20px 0",
              }}
            />

            <table
              width="100%"
              cellPadding="0"
              cellSpacing="0"
              border={0}
              style={{ margin: "0 0 8px 0" }}
            >
              <tbody>
                <tr>
                  <td>
                    <Text
                      style={{
                        margin: "0",
                        fontSize: "12px",
                        lineHeight: "16px",
                        fontWeight: "700",
                        color: "#0f172a",
                        textTransform: "uppercase",
                        letterSpacing: "0.06em",
                      }}
                    >
                      Google Maps • Ostatni Miesiąc
                    </Text>
                  </td>
                  <td style={{ textAlign: "right" }}>
                    <Text
                      style={{
                        margin: "0",
                        fontSize: "12px",
                        lineHeight: "16px",
                        fontWeight: "600",
                        color: "#64748b",
                      }}
                    >
                      {reputation.recentReviewsCount > 0
                        ? `Nowe opinie: ${reputation.recentReviewsCount}`
                        : "Nowe opinie w ubiegłym miesiącu: 0"}
                    </Text>
                  </td>
                </tr>
              </tbody>
            </table>

            {/* Authentic 5-Star Customer Spotlight from the last 30 days */}
            {reputation.featuredReview && (
              <table
                width="100%"
                cellPadding="0"
                cellSpacing="0"
                border={0}
                style={{
                  backgroundColor: "#ffffff",
                  borderRadius: "8px",
                  border: "1px solid #e2e8f0",
                  borderLeft: "3px solid #e7272d",
                  margin: "8px 0 8px 0",
                }}
              >
                <tbody>
                  <tr>
                    <td style={{ padding: "16px 18px" }}>
                      <Text
                        style={{
                          margin: "0 0 4px 0",
                          fontSize: "12px",
                          lineHeight: "16px",
                          fontWeight: "700",
                          color: "#e7272d",
                        }}
                      >
                        ★★★★★{" "}
                        <span
                          style={{
                            fontSize: "11px",
                            fontWeight: "600",
                            color: "#64748b",
                            textTransform: "uppercase",
                            letterSpacing: "0.05em",
                            marginLeft: "6px",
                          }}
                        >
                          Opinia Klienta
                        </span>
                      </Text>
                      <Text
                        style={{
                          margin: "0 0 8px 0",
                          fontSize: "13px",
                          lineHeight: "1.5",
                          fontStyle: "italic",
                          color: "#1e293b",
                        }}
                      >
                        „{reputation.featuredReview.text}”
                      </Text>
                      <Text
                        style={{
                          margin: "0",
                          fontSize: "12px",
                          lineHeight: "14px",
                          fontWeight: "600",
                          color: "#64748b",
                        }}
                      >
                        — {reputation.featuredReview.author} • {reputation.featuredReview.branchName}
                      </Text>
                    </td>
                  </tr>
                </tbody>
              </table>
            )}

            {/* Footer Transparency */}
            <Hr
              style={{
                border: "none",
                borderTop: "1px solid #e2e8f0",
                margin: "24px 0 16px 0",
              }}
            />
            <Text
              style={{
                margin: "0 0 4px 0",
                fontSize: "11px",
                lineHeight: "15px",
                color: "#64748b",
              }}
            >
              Raport wygenerowany automatycznie na podstawie telemetrii Cloudflare Web Analytics
              oraz Google Places API dla domeny speedqueenkrk.pl.
            </Text>
            <Text
              style={{
                margin: "0",
                fontSize: "11px",
                lineHeight: "15px",
                color: "#64748b",
              }}
            >
              Odbiorca: <strong style={{ color: "#334155" }}>{recipientEmail}</strong>
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};
