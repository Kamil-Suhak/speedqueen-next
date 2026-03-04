"use client";

import { Facebook, Instagram } from "lucide-react";
import { GlobalConfig } from "@/config/site-config";

export default function SocialSidebar() {
  const facebookUrl = GlobalConfig.socials.find(s => s.platform === "Facebook")?.url;
  const instagramUrl = GlobalConfig.socials.find(s => s.platform === "Instagram")?.url;

  return (
    <div className="fixed left-6 top-1/2 -translate-y-1/2 z-40 hidden lg:flex flex-col gap-4">
      {facebookUrl && (
        <a
          href={facebookUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-center justify-center w-12 h-12 rounded-2xl bg-white shadow-lg border border-slate-100 text-slate-600 hover:bg-brand-red hover:text-white transition-all transform hover:scale-110"
          aria-label="Facebook"
        >
          <Facebook size={24} />
        </a>
      )}
      {instagramUrl && (
        <a
          href={instagramUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-center justify-center w-12 h-12 rounded-2xl bg-white shadow-lg border border-slate-100 text-slate-600 hover:bg-brand-red hover:text-white transition-all transform hover:scale-110"
          aria-label="Instagram"
        >
          <Instagram size={24} />
        </a>
      )}
    </div>
  );
}
