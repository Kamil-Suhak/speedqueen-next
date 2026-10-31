"use client";

import { useSyncExternalStore } from "react";
import { GlobalConfig } from "@/config/site-config";

const emptySubscribe = () => () => {};

interface ObfuscatedLinkProps {
  type: "email" | "phone";
  value?: string;
  useGlobalConfig?: boolean;
  className?: string;
  children?: React.ReactNode;
}

export default function ObfuscatedLink({
  type,
  value,
  useGlobalConfig = false,
  className = "",
  children,
}: ObfuscatedLinkProps) {
  const isMounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );

  if (!isMounted) return <span>...</span>;

  const resolvedValue = useGlobalConfig
    ? (type === "email" ? GlobalConfig.brand.email : GlobalConfig.brand.phone)
    : value;

  if (!resolvedValue) return null;

  const href = type === "email"
    ? `mailto:${resolvedValue}`
    : `tel:${resolvedValue.replace(/\s+/g, "")}`;

  return (
    <a href={href} className={className}>
      {children || resolvedValue}
    </a>
  );
}
