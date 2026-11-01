import React from "react";
import { Text, Section } from "react-email";

// KPI Card
export const KpiCard = ({
  label,
  value,
  subtitle,
}: {
  label: string;
  value: string;
  subtitle: string;
}) => (
  <td
    style={{
      padding: "16px 14px",
      backgroundColor: "#ffffff",
      borderRadius: "14px",
      border: "1px solid #e2e8f0",
      textAlign: "center",
      width: "33.33%",
    }}
  >
    <Text
      style={{
        margin: "0 0 6px 0",
        fontSize: "11px",
        fontWeight: "700",
        textTransform: "uppercase",
        letterSpacing: "0.06em",
        color: "#64748b",
      }}
    >
      {label}
    </Text>
    <Text
      style={{
        margin: "0 0 4px 0",
        fontSize: "26px",
        fontWeight: "800",
        color: "#0f172a",
        lineHeight: "1.1",
      }}
    >
      {value}
    </Text>
    <Text
      style={{
        margin: "0",
        fontSize: "11px",
        color: "#64748b",
        lineHeight: "1.3",
      }}
    >
      {subtitle}
    </Text>
  </td>
);

// Visual Horizontal Split Bar (Email-safe pure HTML/table)
export const VisualSplitBar = ({
  leftLabel,
  leftPct,
  leftColor = "#e7272d",
  rightLabel,
  rightPct,
  rightColor = "#0f172a",
  description,
}: {
  leftLabel: string;
  leftPct: number;
  leftColor?: string;
  rightLabel: string;
  rightPct: number;
  rightColor?: string;
  description: string;
}) => (
  <Section style={{ margin: "16px 0" }}>
    <table
      width="100%"
      cellPadding="0"
      cellSpacing="0"
      border={0}
      style={{ margin: "0 0 8px 0" }}
    >
      <tbody>
        <tr>
          <td style={{ fontSize: "13px", fontWeight: "700", color: "#0f172a" }}>
            <span
              style={{
                display: "inline-block",
                width: "10px",
                height: "10px",
                borderRadius: "3px",
                backgroundColor: leftColor,
                marginRight: "6px",
              }}
            />
            {leftLabel}: <strong>{leftPct}%</strong>
          </td>
          <td
            style={{
              textAlign: "right",
              fontSize: "13px",
              fontWeight: "700",
              color: "#0f172a",
            }}
          >
            <span
              style={{
                display: "inline-block",
                width: "10px",
                height: "10px",
                borderRadius: "3px",
                backgroundColor: rightColor,
                marginRight: "6px",
              }}
            />
            {rightLabel}: <strong>{rightPct}%</strong>
          </td>
        </tr>
      </tbody>
    </table>

    {/* Meter Bar */}
    <table
      width="100%"
      cellPadding="0"
      cellSpacing="0"
      border={0}
      style={{
        height: "14px",
        borderRadius: "999px",
        overflow: "hidden",
        backgroundColor: "#e2e8f0",
      }}
    >
      <tbody>
        <tr>
          <td
            width={`${leftPct}%`}
            style={{ backgroundColor: leftColor, height: "14px" }}
          />
          <td
            width={`${rightPct}%`}
            style={{ backgroundColor: rightColor, height: "14px" }}
          />
        </tr>
      </tbody>
    </table>

    <Text
      style={{
        margin: "6px 0 0 0",
        fontSize: "12px",
        color: "#64748b",
        lineHeight: "1.4",
      }}
    >
      {description}
    </Text>
  </Section>
);

// Branch Reputation Card Row
export const BranchRow = ({
  name,
  address,
  rating,
  reviews,
}: {
  name: string;
  address: string;
  rating: number;
  reviews: number;
}) => (
  <table
    width="100%"
    cellPadding="0"
    cellSpacing="0"
    border={0}
    style={{
      backgroundColor: "#ffffff",
      borderRadius: "12px",
      border: "1px solid #e2e8f0",
      margin: "0 0 10px 0",
    }}
  >
    <tbody>
      <tr>
        <td style={{ padding: "14px 16px" }}>
          <Text
            style={{
              margin: "0 0 2px 0",
              fontSize: "14px",
              fontWeight: "700",
              color: "#0f172a",
            }}
          >
            {name}
          </Text>
          <Text
            style={{
              margin: "0",
              fontSize: "12px",
              color: "#64748b",
            }}
          >
            {address}
          </Text>
        </td>
        <td style={{ padding: "14px 16px", textAlign: "right" }}>
          <span
            style={{
              display: "inline-block",
              backgroundColor: "#fef2f2",
              border: "1px solid #fecaca",
              color: "#dc2626",
              fontWeight: "800",
              fontSize: "13px",
              padding: "4px 10px",
              borderRadius: "8px",
            }}
          >
            ★ {rating.toFixed(1)}
          </span>
          <Text
            style={{
              margin: "4px 0 0 0",
              fontSize: "11px",
              color: "#64748b",
              fontWeight: "600",
            }}
          >
            {reviews} opinii
          </Text>
        </td>
      </tr>
    </tbody>
  </table>
);
