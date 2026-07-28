"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";

interface FooterColumn {
  title: string;
  links: { label: string; href: string; icon?: React.ReactNode }[];
}

const LogoIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <path d="m9 11 2 2 4-4" />
  </svg>
);

const footerConfig: FooterColumn[] = [
  {
    title: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Team", href: "/team" },
      { label: "Contact", href: "/contact" },
      { label: "How It Works", href: "/how-it-works" },
    ],
  },
  {
    title: "Products",
    links: [
      { label: "For Founders", href: "/register" },
      { label: "For Investors", href: "/directory" },
    ],
  },
  {
    title: "Social",
    links: [
      {
        label: "LinkedIn",
        href: "https://linkedin.com",
        icon: (
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
            <rect x="2" y="9" width="4" height="12" />
            <circle cx="4" cy="4" r="2" />
          </svg>
        ),
      },
      {
        label: "Instagram",
        href: "https://instagram.com",
        icon: (
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
            <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
          </svg>
        ),
      },
      {
        label: "X",
        href: "https://x.com",
        icon: (
          <svg className="w-4.5 h-4.5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
        ),
      },
    ],
  },
];

export default function Footer() {
  const currentYear = 2026;

  return (
    <footer className="w-full border-t border-[rgba(255,255,255,0.03)] bg-[rgba(10,10,18,0.4)] backdrop-blur-xl transition-all duration-300 mt-auto">
      <div className="max-w-[1200px] mx-auto px-4 md:px-6 pt-12 pb-8 flex flex-col gap-10">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
          {footerConfig.map((col) => (
            <div key={col.title} className="flex flex-col gap-3.5">
              <h3 className="text-sm font-medium text-white/60 tracking-wide">
                {col.title}
              </h3>
              {col.title === "Social" ? (
                <div className="flex items-center gap-4 mt-1">
                  {col.links.map((link) => (
                    <motion.a
                      key={link.label}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ y: -2, scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="text-[rgba(255,255,255,0.2)] hover:text-[#00E5FF] transition-all duration-300 p-1 -m-1 focus:outline-hidden"
                      aria-label={link.label}
                    >
                      {link.icon}
                    </motion.a>
                  ))}
                </div>
              ) : (
                <ul className="flex flex-col gap-2.5">
                  {col.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="relative text-sm text-[rgba(255,255,255,0.3)] hover:text-white transition-all duration-300 group"
                      >
                        {link.label}
                        <span className="absolute bottom-0 left-0 w-0 h-px bg-gradient-to-r from-[#00E5FF] to-[#7000FF] transition-all duration-300 group-hover:w-full" />
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>

        <div className="border-t border-[rgba(255,255,255,0.03)] pt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="absolute inset-0 bg-[#00E5FF] blur-md opacity-10" />
              <LogoIcon className="w-5 h-5 text-[#00E5FF] relative z-10" />
            </div>
            <p className="text-xs text-[rgba(255,255,255,0.2)] font-normal">
              © {currentYear} TrustScore AI. All rights reserved.
            </p>
          </div>
          <div className="flex gap-6">
            <Link
              href="/privacy"
              className="text-xs text-[rgba(255,255,255,0.15)] hover:text-[rgba(255,255,255,0.4)] transition-colors duration-300"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className="text-xs text-[rgba(255,255,255,0.15)] hover:text-[rgba(255,255,255,0.4)] transition-colors duration-300"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}