import React from "react";
import Link from "next/link";
import { StartupCardData } from "@/types/startup";
import VerificationBadge from "./VerificationBadge";
import { motion } from "framer-motion";

export interface StartupCardProps {
  startup: StartupCardData;
}

const IconLock = ({ className = "w-3.5 h-3.5" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2.5" y="6" width="9" height="6" rx="1.5" />
    <path d="M 4.5,6 V 3.5 A 2.5,2.5 0 0,1 9.5,3.5 V 6" />
  </svg>
);

const IconArrow = ({ className = "w-3.5 h-3.5" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M 4.5,2.5 L 9,7 L 4.5,11.5" />
  </svg>
);

export default function StartupCard({ startup }: StartupCardProps) {
  const {
    id,
    name,
    logoUrl,
    description,
    sector,
    stage,
    location,
    foundedYear,
    investorCount,
    fundingRound,
    trustScore,
    badgeTier,
    showScore,
  } = startup;

  return (
    <motion.div
      whileHover={{ 
        y: -6,
        boxShadow: "0 12px 60px rgba(0, 229, 255, 0.06), 0 0 80px rgba(0, 229, 255, 0.03)"
      }}
      transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
      className="group relative bg-[rgba(10,10,18,0.4)] backdrop-blur-xl border border-[rgba(255,255,255,0.03)] rounded-card p-5 flex flex-col justify-between min-h-[260px] transition-all duration-500 hover:border-[rgba(0,229,255,0.15)]"
    >
      <div className="absolute inset-0 rounded-card bg-gradient-to-br from-[#00E5FF]/0 via-[#7000FF]/0 to-[#00FFA3]/0 opacity-0 group-hover:opacity-[0.02] transition-opacity duration-500 pointer-events-none" />
      
      <div className="flex flex-col gap-4 relative z-10">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <div className="relative w-10 h-10 rounded-lg overflow-hidden border border-[rgba(255,255,255,0.05)] bg-[rgba(255,255,255,0.02)] flex items-center justify-center flex-shrink-0 group-hover:border-[rgba(0,229,255,0.1)] transition-all duration-500">
              {logoUrl ? (
                <img
                  src={logoUrl}
                  alt={`${name} logo`}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = "none";
                    const parent = target.parentElement;
                    if (parent) {
                      const span = document.createElement("span");
                      span.className = "text-[#00E5FF] font-medium text-sm";
                      span.innerText = name.slice(0, 2).toUpperCase();
                      parent.appendChild(span);
                    }
                  }}
                />
              ) : (
                <span className="text-[#00E5FF] font-medium text-sm">
                  {name.slice(0, 2).toUpperCase()}
                </span>
              )}
              <div className="absolute inset-0 bg-gradient-to-br from-[#00E5FF]/5 to-[#7000FF]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </div>
            <div className="min-w-0">
              <h3 className="text-base font-medium text-white leading-tight truncate group-hover:text-[#00E5FF] transition-colors duration-300">
                {name}
              </h3>
              <p className="text-xs text-[rgba(255,255,255,0.3)] mt-1 truncate">
                {sector}
              </p>
            </div>
          </div>

          <div className="flex flex-col items-end flex-shrink-0">
            {showScore ? (
              <div className="flex flex-col items-end gap-1.5">
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] text-[rgba(255,255,255,0.2)] tracking-wider font-medium leading-none uppercase font-mono">
                    Trustscore
                  </span>
                  <span className="text-base font-medium text-white tracking-tight leading-none">
                    {Math.round(trustScore * 100)}
                  </span>
                </div>
                <VerificationBadge tier={badgeTier} />
              </div>
            ) : (
              <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.03)] rounded-[6px] text-[rgba(255,255,255,0.3)]">
                <IconLock className="w-3.5 h-3.5" />
                <span className="text-[11px] font-medium leading-none">
                  Score not shared
                </span>
              </div>
            )}
          </div>
        </div>

        <p className="text-sm text-[rgba(255,255,255,0.4)] leading-relaxed line-clamp-1">
          {description}
        </p>
      </div>

      <div className="flex flex-col gap-4 mt-5 relative z-10">
        <div className="grid grid-cols-2 gap-y-3 gap-x-4 text-xs pt-4 border-t border-[rgba(255,255,255,0.03)]">
          <div className="flex flex-col gap-0.5">
            <span className="text-[10px] text-[rgba(255,255,255,0.15)] tracking-wider font-medium uppercase font-mono">
              Sector & stage
            </span>
            <div className="flex items-center gap-1.5 text-white">
              <span className="font-medium">{sector}</span>
              <span className="text-[rgba(255,255,255,0.05)]">•</span>
              <span className="text-[rgba(255,255,255,0.3)]">{stage}</span>
            </div>
          </div>

          <div className="flex flex-col gap-0.5">
            <span className="text-[10px] text-[rgba(255,255,255,0.15)] tracking-wider font-medium uppercase font-mono">
              Location & founded
            </span>
            <div className="flex items-center gap-1.5 text-white">
              <span className="font-medium">{location}</span>
              <span className="text-[rgba(255,255,255,0.05)]">•</span>
              <span className="text-[rgba(255,255,255,0.3)]">{foundedYear}</span>
            </div>
          </div>

          <div className="flex flex-col gap-0.5 col-span-2">
            <span className="text-[10px] text-[rgba(255,255,255,0.15)] tracking-wider font-medium uppercase font-mono">
              Funding & investors
            </span>
            <div className="flex items-center gap-1.5 text-white">
              <span className="font-medium">{fundingRound}</span>
              <span className="text-[rgba(255,255,255,0.05)]">•</span>
              <span className="text-[rgba(255,255,255,0.3)]">
                {investorCount} {investorCount === 1 ? "Investor" : "Investors"}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end pt-3 border-t border-[rgba(255,255,255,0.02)]">
          <Link
            href={`/startup/${id || "apex-biosensors"}`}
            className="text-sm font-medium text-[rgba(255,255,255,0.3)] hover:text-[#00E5FF] inline-flex items-center gap-1 group/link transition-all duration-300"
          >
            <span>Open Profile</span>
            <IconArrow className="w-3.5 h-3.5 transition-transform duration-300 group-hover/link:translate-x-0.5" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
}