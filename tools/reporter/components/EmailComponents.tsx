import React from "react";
import { Text, Section } from "react-email";

// Clean KPI metric card without glued helper text
export const KpiCard = ({
  label,
  value,
  sublabel,
}: {
  label: string;
  value: string;
  sublabel?: string;
}) => (
  <td
    style={{
      padding: "16px 12px",
      backgroundColor: "#ffffff",
      borderRadius: "8px",
      border: "1px solid #e2e8f0",
      textAlign: "center",
      width: "25%",
    }}
  >
    <Text
      style={{
        margin: "0 0 6px 0",
        fontSize: "11px",
        lineHeight: "14px",
        fontWeight: "700",
        textTransform: "uppercase",
        letterSpacing: "0.08em",
        color: "#64748b",
      }}
    >
      {label}
    </Text>
    <Text
      style={{
        margin: "0",
        fontSize: "22px",
        lineHeight: "26px",
        fontWeight: "800",
        color: "#0f172a",
      }}
    >
      {value}
    </Text>
    {sublabel && (
      <Text
        style={{
          margin: "4px 0 0 0",
          fontSize: "11px",
          lineHeight: "14px",
          color: "#94a3b8",
        }}
      >
        {sublabel}
      </Text>
    )}
  </td>
);

// Visual Horizontal Split Bar with disciplined slate/red tokens
export const VisualSplitBar = ({
  leftLabel,
  leftPct,
  leftColor = "#e7272d",
  rightLabel,
  rightPct,
  rightColor = "#0f172a",
}: {
  leftLabel: string;
  leftPct: number;
  leftColor?: string;
  rightLabel: string;
  rightPct: number;
  rightColor?: string;
}) => (
  <Section style={{ margin: "16px 0 20px 0" }}>
    <table
      width="100%"
      cellPadding="0"
      cellSpacing="0"
      border={0}
      style={{ margin: "0 0 8px 0" }}
    >
      <tbody>
        <tr>
          <td style={{ fontSize: "12px", lineHeight: "16px", fontWeight: "600", color: "#334155" }}>
            <span
              style={{
                display: "inline-block",
                width: "8px",
                height: "8px",
                borderRadius: "2px",
                backgroundColor: leftColor,
                marginRight: "6px",
                verticalAlign: "middle",
              }}
            />
            {leftLabel}: <strong style={{ color: "#0f172a" }}>{leftPct}%</strong>
          </td>
          <td
            style={{
              textAlign: "right",
              fontSize: "12px",
              lineHeight: "16px",
              fontWeight: "600",
              color: "#334155",
            }}
          >
            <span
              style={{
                display: "inline-block",
                width: "8px",
                height: "8px",
                borderRadius: "2px",
                backgroundColor: rightColor,
                marginRight: "6px",
                verticalAlign: "middle",
              }}
            />
            {rightLabel}: <strong style={{ color: "#0f172a" }}>{rightPct}%</strong>
          </td>
        </tr>
      </tbody>
    </table>

    {/* Crisp Segmented Progress Bar */}
    <table
      width="100%"
      cellPadding="0"
      cellSpacing="0"
      border={0}
      style={{
        height: "8px",
        borderRadius: "4px",
        overflow: "hidden",
        backgroundColor: "#e2e8f0",
      }}
    >
      <tbody>
        <tr>
          <td
            width={`${leftPct}%`}
            style={{ backgroundColor: leftColor, height: "8px" }}
          />
          <td
            width={`${rightPct}%`}
            style={{ backgroundColor: rightColor, height: "8px" }}
          />
        </tr>
      </tbody>
    </table>
  </Section>
);
