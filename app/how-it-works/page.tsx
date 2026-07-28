"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import VerificationBadge from "@/components/VerificationBadge";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

/* ---------- Icons ---------- */
const IconDocument = ({ className = "w-5.5 h-5.5" }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0 3 3m-3-3-3 3M6.75 19.5h10.5a2.25 2.25 0 0 0 2.25-2.25V6.75a2.25 2.25 0 0 0-2.25-2.25H6.75A2.25 2.25 0 0 0 4.5 6.75v10.5a2.25 2.25 0 0 0 2.25 2.25Z" />
  </svg>
);

const IconAI = ({ className = "w-5.5 h-5.5" }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 21m0 0-.75-5.096m.75 5.096H3.75m16.5 0H15m0 0-.75-5.096m.75 5.096.813-5.096M9 3v5.25M9 8.25h6M15 3v5.25m3.75 5.25a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM6.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" />
  </svg>
);

const IconLive = ({ className = "w-5.5 h-5.5" }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9s2.015-9 4.5-9m0 0a9.003 9.003 0 0 1 8.716 6.747M12 3a9.003 9.003 0 0 0-8.716 6.747M3.75 12h16.5" />
  </svg>
);

const IconShield = ({ className = "w-5.5 h-5.5" }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z" />
  </svg>
);

const IconCheck = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="2.5 6 4.5 8 9.5 3.5" />
  </svg>
);

const IconCoin = ({ className = "w-8 h-8" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2" />
  </svg>
);

/* ---------- Animated wrappers ---------- */
const AnimatedSection = ({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) => {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{ duration: 0.7, delay, ease: [0.23, 1, 0.32, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

/* ---------- Interactive How It Works Card ---------- */
const HowItWorksCard = ({ step, title, description, icon, color, index, isActive, onHover }: {
  step: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  index: number;
  isActive: boolean;
  onHover: (index: number | null) => void;
}) => {
  return (
    <motion.div
      onMouseEnter={() => onHover(index)}
      onMouseLeave={() => onHover(null)}
      animate={{
        y: isActive ? -12 : 0,
        scale: isActive ? 1.02 : 1,
        boxShadow: isActive 
          ? `0 20px 60px rgba(0,0,0,0.4), 0 0 40px ${color}20` 
          : "0 4px 20px rgba(0,0,0,0.2)",
      }}
      transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
      className={`relative bg-[rgba(16,20,28,0.6)] backdrop-blur-xl border ${isActive ? `border-[${color}]/30` : 'border-white/[0.05]'} rounded-card p-6 flex flex-col gap-4 transition-all duration-300 cursor-pointer group`}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <div className={`w-12 h-12 rounded-full bg-[${color}]/10 border border-[${color}]/20 flex items-center justify-center text-[${color}] transition-all duration-300 ${isActive ? `shadow-[0_0_30px_${color}20]` : ''}`}>
            {icon}
          </div>
          <div>
            <span className="text-[10px] text-white/20 font-mono uppercase tracking-wider">{step}</span>
            <h3 className="text-lg font-semibold text-white">{title}</h3>
          </div>
        </div>
        {isActive && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="w-8 h-8 rounded-full bg-[#00FFA3]/10 border border-[#00FFA3]/20 flex items-center justify-center"
          >
            <IconCheck className="w-4 h-4 text-[#00FFA3]" />
          </motion.div>
        )}
      </div>
      <p className="text-sm text-white/40 leading-relaxed">{description}</p>
      
      {/* Animated coin indicator */}
      {isActive && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute -top-3 -right-3"
        >
          <motion.div
            animate={{ 
              rotate: 360,
              scale: [1, 1.2, 1],
            }}
            transition={{ 
              rotate: { duration: 2, repeat: Infinity, ease: "linear" },
              scale: { duration: 1, repeat: Infinity, ease: "easeInOut" }
            }}
            className="w-8 h-8 rounded-full bg-gradient-to-br from-[#C8A451] to-[#F5D97E] shadow-[0_0_20px_rgba(200,164,81,0.3)] flex items-center justify-center"
          >
            <IconCoin className="w-5 h-5 text-[#0B0F17]" />
          </motion.div>
        </motion.div>
      )}
      
      {/* Progress line between cards */}
      {index < 2 && (
        <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 w-0.5 h-6 bg-gradient-to-b from-[#C8A451]/30 to-transparent" />
      )}
    </motion.div>
  );
};

export default function HowItWorks() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [productsOpen, setProductsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [activeCard, setActiveCard] = useState<number | null>(null);

  const steps = [
    {
      step: "Step 01",
      title: "Sovereign Identity Verification",
      description: "Founder and company identity cryptographically confirmed through multiple data sources and document verification.",
      icon: <IconDocument className="w-6 h-6" />,
      color: "#00FFA3"
    },
    {
      step: "Step 02",
      title: "Regulatory & Cross-Chain Data Analysis",
      description: "On-chain activity, credit signals, compliance status, and regulatory checks are analyzed by our AI engine.",
      icon: <IconAI className="w-6 h-6" />,
      color: "#00E5FF"
    },
    {
      step: "Step 03",
      title: "Immutable Minting",
      description: "Your verified TrustScore is permanently minted on-chain, creating an unalterable record of your credibility.",
      icon: <IconLive className="w-6 h-6" />,
      color: "#C8A451"
    }
  ];

  const evidenceTiers = [
    { tier: "self-reported", name: "Self-reported", desc: "The founder stated it. No supporting proof yet." },
    { tier: "ai-extracted", name: "AI-extracted", desc: "Our AI pulled it from a document or source the founder provided." },
    { tier: "document-backed", name: "Document-backed", desc: "Supported by an uploaded document, such as financials or an incorporation certificate." },
    { tier: "stakeholder-endorsed", name: "Stakeholder-endorsed", desc: "Confirmed by a credible third party, like an incubator or accelerator." },
    { tier: "investor-backed", name: "Investor-backed", desc: "The strongest signal. A real investor has committed capital." },
  ] as const;

  return (
    <div className="min-h-screen flex flex-col bg-[#0B0F17] overflow-x-hidden">
      <Navbar
        isLoggedIn={isLoggedIn}
        onAuthToggle={() => {
          setIsLoggedIn((prev) => !prev);
          if (isLoggedIn) setProfileOpen(false);
        }}
        productsOpenOverride={productsOpen}
        profileOpenOverride={profileOpen}
        onProductsOpenChange={setProductsOpen}
        onProfileOpenChange={setProfileOpen}
      />

      <main className="relative z-10 flex-1 w-full max-w-[1200px] mx-auto px-4 md:px-6 py-12 flex flex-col items-center">
        {/* HERO */}
        <section className="flex flex-col items-center text-center mt-6 md:mt-12 max-w-3xl w-full">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-white/[0.02] border border-white/[0.05] rounded-full text-[11px] font-medium text-white/30 select-none tracking-tight"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#C8A451] animate-pulse" />
            Sovereign Digital Identity Protocol
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl md:text-6xl font-medium tracking-tight text-white leading-[1.1] mt-6"
          >
            The Definitive Benchmark
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#C8A451] via-[#00E5FF] to-[#C8A451]"> of Digital Trust</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-base md:text-lg text-white/40 leading-relaxed mt-4 max-w-2xl"
          >
            Every claim, cryptographically verified. Every score, immutably minted.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 mt-8 w-full sm:w-auto justify-center"
          >
            <Link href="/register" className="w-full sm:w-auto text-center bg-gradient-to-r from-[#C8A451] to-[#00E5FF] text-[#0B0F17] px-6 py-3 text-sm font-medium rounded-lg hover:shadow-[0_0_40px_rgba(200,164,81,0.3)] active:scale-98 transition-all duration-300">
              Get Your Score
            </Link>
            <Link href="/directory" className="w-full sm:w-auto text-center border border-white/[0.05] bg-white/[0.02] text-white px-6 py-3 text-sm font-medium rounded-lg hover:bg-white/[0.04] active:scale-98 transition-all duration-300">
              Explore Registered Profiles
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-10 w-full"
          >
            <div className="relative w-full max-w-[850px] mx-auto">
              <div className="absolute inset-0 bg-gradient-to-br from-[#C8A451]/5 via-[#00E5FF]/5 to-transparent rounded-2xl blur-2xl" />
              <div className="relative bg-[rgba(16,20,28,0.6)] backdrop-blur-sm rounded-2xl border border-white/[0.05] overflow-hidden">
                <Image
                  src="/dashboard-preview.png"
                  alt="Institution Dashboard Preview"
                  width={1200}
                  height={800}
                  className="w-full h-auto object-cover"
                />
              </div>
            </div>
          </motion.div>
        </section>

        {/* METRICS */}
        <AnimatedSection className="w-full grid grid-cols-1 md:grid-cols-3 gap-6 py-16 my-8 border-t border-white/[0.03]">
          <div className="bg-[rgba(16,20,28,0.6)] backdrop-blur-xl border border-white/[0.05] rounded-card p-6 hover:border-[#C8A451]/20 transition-all duration-500">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-full bg-[#C8A451]/5 border border-[#C8A451]/10 flex items-center justify-center text-[#C8A451]">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
              </div>
              <h3 className="text-sm font-semibold text-white">Verification Speed</h3>
            </div>
            <p className="text-3xl font-bold text-[#C8A451]">2.4s</p>
            <p className="text-xs text-white/30 mt-1">Average verification time</p>
          </div>

          <div className="bg-[rgba(16,20,28,0.6)] backdrop-blur-xl border border-white/[0.05] rounded-card p-6 hover:border-[#00E5FF]/20 transition-all duration-500">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-full bg-[#00E5FF]/5 border border-[#00E5FF]/10 flex items-center justify-center text-[#00E5FF]">
                <IconShield className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-semibold text-white">Protocol Security</h3>
            </div>
            <p className="text-3xl font-bold text-[#00E5FF]">99.9%</p>
            <p className="text-xs text-white/30 mt-1">Security audit score</p>
          </div>

          <div className="bg-[rgba(16,20,28,0.6)] backdrop-blur-xl border border-white/[0.05] rounded-card p-6 hover:border-[#00FFA3]/20 transition-all duration-500">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-full bg-[#00FFA3]/5 border border-[#00FFA3]/10 flex items-center justify-center text-[#00FFA3]">
                <IconAI className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-semibold text-white">Identity Weight</h3>
            </div>
            <p className="text-3xl font-bold text-[#00FFA3]">92.7</p>
            <p className="text-xs text-white/30 mt-1">Average identity confidence</p>
          </div>
        </AnimatedSection>

        {/* BENTO IMAGES */}
        <AnimatedSection className="w-full grid grid-cols-1 md:grid-cols-2 gap-6 py-8">
          <div className="relative w-full">
            <div className="absolute inset-0 bg-gradient-to-br from-[#C8A451]/5 via-[#00E5FF]/5 to-transparent rounded-2xl blur-2xl" />
            <div className="relative bg-[rgba(16,20,28,0.6)] backdrop-blur-sm rounded-2xl border border-white/[0.05] overflow-hidden">
              <Image src="/security-node-network.png" alt="Global Data Network Map" width={600} height={600} className="w-full h-auto object-cover" />
            </div>
          </div>
          <div className="relative w-full">
            <div className="absolute inset-0 bg-gradient-to-br from-[#C8A451]/5 via-[#00E5FF]/5 to-transparent rounded-2xl blur-2xl" />
            <div className="relative bg-[rgba(16,20,28,0.6)] backdrop-blur-sm rounded-2xl border border-white/[0.05] overflow-hidden">
              <Image src="/isometric-badges.png" alt="Sovereign Tier Badges" width={600} height={600} className="w-full h-auto object-cover" />
            </div>
          </div>
        </AnimatedSection>

        {/* EVIDENCE TIERS */}
        <AnimatedSection className="w-full flex flex-col items-center mt-24">
          <h2 className="text-2xl md:text-3xl font-medium text-white text-center tracking-tight mb-3">Five Levels of Evidence</h2>
          <p className="text-sm md:text-base text-white/40 text-center leading-relaxed max-w-xl mb-12">
            Every claim on a profile carries a verification level, so you can see at a glance how much to believe it.
          </p>
          <div className="flex flex-col gap-4 w-full max-w-[850px]">
            {evidenceTiers.map((item, idx) => (
              <motion.div
                key={item.tier}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
                viewport={{ once: true }}
                className="bg-[rgba(10,10,18,0.4)] backdrop-blur-xl border border-white/[0.03] rounded-card p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 hover:border-[#00E5FF]/[0.08] transition-all duration-500"
              >
                <div className="flex items-start gap-4">
                  <div className="text-[10px] text-white/15 font-semibold uppercase tracking-wider font-mono mt-1.5 flex-shrink-0">
                    Level {idx + 1}
                  </div>
                  <div className="flex flex-col gap-1">
                    <h3 className="text-base font-medium text-white">{item.name}</h3>
                    <p className="text-xs text-white/30 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
                <VerificationBadge tier={item.tier} />
              </motion.div>
            ))}
          </div>
        </AnimatedSection>

        {/* INTERACTIVE HOW IT WORKS CARDS */}
        <AnimatedSection className="w-full flex flex-col items-center mt-24">
          <h2 className="text-2xl md:text-3xl font-medium text-white text-center tracking-tight mb-4">How It Works</h2>
          <p className="text-sm md:text-base text-white/40 text-center leading-relaxed max-w-xl mb-12">
            Hover over each card to see the verification journey in action
          </p>

          <div className="relative w-full max-w-3xl mx-auto">
            {/* Vertical connecting line */}
            <div className="absolute left-8 top-12 bottom-12 w-0.5 bg-gradient-to-b from-[#C8A451]/20 via-[#00E5FF]/20 to-[#00FFA3]/20" />
            
            <div className="flex flex-col gap-8">
              {steps.map((step, index) => (
                <HowItWorksCard
                  key={index}
                  step={step.step}
                  title={step.title}
                  description={step.description}
                  icon={step.icon}
                  color={step.color}
                  index={index}
                  isActive={activeCard === index}
                  onHover={setActiveCard}
                />
              ))}
            </div>
          </div>
        </AnimatedSection>

        {/* CTA */}
        <AnimatedSection className="w-full mb-20 mt-24">
          <div className="relative bg-gradient-to-br from-[#C8A451]/5 via-[#00E5FF]/[0.02] to-[#00FFA3]/[0.02] border border-white/[0.05] rounded-card p-8 md:p-12 text-center flex flex-col items-center gap-6 overflow-hidden group">
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#C8A451]/5 rounded-full blur-3xl group-hover:bg-[#C8A451]/10 transition-all duration-700" />
            <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-[#00E5FF]/5 rounded-full blur-3xl group-hover:bg-[#00E5FF]/10 transition-all duration-700" />
            <div className="relative z-10 flex flex-col items-center gap-6">
              <motion.div
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                transition={{ duration: 0.5, type: "spring" }}
                viewport={{ once: true }}
                className="w-16 h-16 rounded-full bg-gradient-to-br from-[#C8A451] to-[#00E5FF] p-0.5"
              >
                <div className="w-full h-full rounded-full bg-[#0B0F17] flex items-center justify-center">
                  <span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#C8A451] to-[#00E5FF]">AI</span>
                </div>
              </motion.div>
              <h2 className="text-2xl md:text-3xl font-medium tracking-tight text-white">Trust, Earned Through Evidence</h2>
              <p className="text-sm md:text-base text-white/40 max-w-lg leading-relaxed">
                Not another directory of unverified claims. A place where credibility is proven.
              </p>
              <Link href="/register" className="px-10 py-4 bg-gradient-to-r from-[#C8A451] to-[#00E5FF] text-[#0B0F17] text-sm font-medium rounded-button hover:shadow-[0_0_60px_rgba(200,164,81,0.3)] active:scale-98 transition-all duration-300 inline-flex items-center gap-2">
                Get Started
              </Link>
            </div>
          </div>
        </AnimatedSection>
      </main>

      <Footer />
    </div>
  );
}