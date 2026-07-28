import React from "react";
import { BadgeTier } from "@/types/startup";

interface VerificationBadgeProps {
  tier: BadgeTier;
  className?: string;
}

const IconDot = ({ className = "w-2 h-2" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 8 8">
    <circle cx="4" cy="4" r="3" />
  </svg>
);

const IconCheck = ({ className = "w-3 h-3" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 12 12" fill="none" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="2.5 6 4.5 8 9.5 3.5" />
  </svg>
);

const IconShield = ({ className = "w-2.5 h-2.5" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 10 10" fill="none">
    <circle cx="5" cy="5" r="4.25" strokeWidth="1.25" />
    <path d="M 5,0.75 A 4.25,4.25 0 0,0 5,9.25 Z" fill="currentColor" stroke="none" />
  </svg>
);

export default function VerificationBadge({ tier, className = "" }: VerificationBadgeProps) {
  let label = "";
  let styles = "";
  let icon: React.ReactNode = null;

  switch (tier) {
    case "self-reported":
      label = "Self-reported";
      styles = "bg-[rgba(255,255,255,0.02)] border-[rgba(255,255,255,0.05)] text-[rgba(255,255,255,0.3)]";
      icon = <IconDot className="w-1.5 h-1.5 fill-[rgba(255,255,255,0.2)]" />;
      break;
    case "ai-extracted":
      label = "AI-extracted";
      styles = "bg-[rgba(0,229,255,0.05)] border-[rgba(0,229,255,0.15)] text-[#00E5FF]";
      icon = <IconDot className="w-1.5 h-1.5 fill-[#00E5FF]" />;
      break;
    case "document-backed":
      label = "Document-backed";
      styles = "bg-[rgba(255,255,255,0.02)] border-[rgba(255,255,255,0.08)] text-white";
      icon = <IconShield className="w-2.5 h-2.5 stroke-[rgba(255,255,255,0.2)]" />;
      break;
    case "stakeholder-endorsed":
      label = "Stakeholder-endorsed";
      styles = "bg-[rgba(200,164,81,0.05)] border-[rgba(200,164,81,0.15)] text-[#C8A451]";
      icon = <IconCheck className="w-3 h-3 stroke-[#C8A451]" />;
      break;
    case "investor-backed":
      label = "Investor-backed";
      styles = "bg-[rgba(0,255,163,0.05)] border-[rgba(0,255,163,0.15)] text-[#00FFA3]";
      icon = <IconCheck className="w-3 h-3 stroke-[#00FFA3]" />;
      break;
  }

  return (
    <div
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border text-[10px] font-medium leading-none select-none tracking-wide ${styles} ${className}`}
    >
      {icon}
      <span>{label}</span>
    </div>
  );
}