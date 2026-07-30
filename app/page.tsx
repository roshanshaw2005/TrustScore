"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import VerificationBadge from "@/components/VerificationBadge";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { PerspectiveCamera, Float, Sparkles, Torus, MeshDistortMaterial, Stars } from "@react-three/drei";
import * as THREE from "three";
import { useInView } from "react-intersection-observer";

const HeroScene = () => {
  const meshRef = useRef<THREE.Mesh>(null!);
  const { mouse } = useThree();

  useFrame((state) => {
    if (meshRef.current) {
      const x = (mouse.x - 0) * 0.3;
      const y = (mouse.y - 0) * 0.2;
      meshRef.current.rotation.x += (y - meshRef.current.rotation.x) * 0.02;
      meshRef.current.rotation.y += (x - meshRef.current.rotation.y) * 0.02;
      const time = state.clock.getElapsedTime();
      meshRef.current.position.y = Math.sin(time * 0.5) * 0.15;
    }
  });

  return (
    <Float speed={1} rotationIntensity={1} floatIntensity={1}>
      <mesh ref={meshRef}>
        <torusGeometry args={[1.6, 0.4, 32, 64]} />
        <meshStandardMaterial color="#10B981" metalness={0.8} roughness={0.2} emissive="#10B981" emissiveIntensity={0.1} />
      </mesh>
    </Float>
  );
};

const NeuralNetworkParticles = () => {
  const particlesRef = useRef<THREE.Points>(null!);
  const count = 200;
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);

  useEffect(() => {
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 15;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 10;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 8;
      
      colors[i * 3] = 0.05 + Math.random() * 0.1;
      colors[i * 3 + 1] = 0.7 + Math.random() * 0.3;
      colors[i * 3 + 2] = 0.2 + Math.random() * 0.2;
    }
  }, []);

  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y = state.clock.getElapsedTime() * 0.008;
      particlesRef.current.rotation.x = Math.sin(state.clock.getElapsedTime() * 0.005) * 0.03;
    }
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.025}
        transparent
        opacity={0.3}
        blending={THREE.AdditiveBlending}
        vertexColors
        sizeAttenuation
      />
    </points>
  );
};

const ConnectingLines = () => {
  const linesRef = useRef<THREE.LineSegments>(null!);
  const count = 80;
  const positions = new Float32Array(count * 6);
  const colors = new Float32Array(count * 6);

  useEffect(() => {
    for (let i = 0; i < count; i++) {
      const x1 = (Math.random() - 0.5) * 12;
      const y1 = (Math.random() - 0.5) * 8;
      const z1 = (Math.random() - 0.5) * 6;
      const x2 = x1 + (Math.random() - 0.5) * 3;
      const y2 = y1 + (Math.random() - 0.5) * 3;
      const z2 = z1 + (Math.random() - 0.5) * 3;
      
      positions[i * 6] = x1;
      positions[i * 6 + 1] = y1;
      positions[i * 6 + 2] = z1;
      positions[i * 6 + 3] = x2;
      positions[i * 6 + 4] = y2;
      positions[i * 6 + 5] = z2;
      
      colors[i * 6] = 0.05;
      colors[i * 6 + 1] = 0.7 + Math.random() * 0.3;
      colors[i * 6 + 2] = 0.2;
      colors[i * 6 + 3] = 0.05;
      colors[i * 6 + 4] = 0.7 + Math.random() * 0.3;
      colors[i * 6 + 5] = 0.2;
    }
  }, []);

  useFrame((state) => {
    if (linesRef.current) {
      linesRef.current.rotation.y = state.clock.getElapsedTime() * 0.005;
    }
  });

  return (
    <lineSegments ref={linesRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <lineBasicMaterial vertexColors opacity={0.08} transparent />
    </lineSegments>
  );
};

const HeroBackground = () => {
  return (
    <div className="fixed inset-0 -z-10 pointer-events-none">
      <Canvas style={{ background: "#FCFDFF" }} dpr={[1, 2]} camera={{ position: [0, 0, 10] }}>
        <PerspectiveCamera makeDefault position={[0, 0, 10]} fov={50} />
        <ambientLight intensity={0.15} color="#10B981" />
        <directionalLight position={[5, 5, 5]} intensity={0.4} color="#10B981" />
        <directionalLight position={[-5, -2, 5]} intensity={0.2} color="#2563EB" />
        <pointLight position={[0, 0, 3]} intensity={0.3} color="#10B981" />
        <Stars radius={50} depth={50} count={1500} factor={4} saturation={0.3} fade speed={1} />
        <NeuralNetworkParticles />
        <ConnectingLines />
        <HeroScene />
        <Sparkles count={100} scale={[12, 12, 12]} size={0.02} speed={0.3} color="#10B981" opacity={0.15} />
        <Sparkles count={50} scale={[12, 12, 12]} size={0.015} speed={0.2} color="#2563EB" opacity={0.1} />
      </Canvas>
    </div>
  );
};

const IconUser = ({ className = "w-5.5 h-5.5" }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15.59 14.37a6 6 0 0 1-5.84 0M8 21.75h8M12 18v3.75m0-16.5c-3.17 0-5.75 2.58-5.75 5.75S9.12 16.5 12 16.5s5.75-2.58 5.75-5.75-2.58-5.75-5.75-5.75Z" />
  </svg>
);

const IconShield = ({ className = "w-5.5 h-5.5" }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z" />
  </svg>
);

const IconCheck = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="2.5 6 4.5 8 9.5 3.5" />
  </svg>
);

const IconStar = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 20 20" fill="currentColor">
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
  </svg>
);

const AnimatedSection = ({
  children,
  className = "",
  delay = 0
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.8, delay, ease: [0.23, 1, 0.32, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

const AnimatedCard = ({
  children,
  className = "",
  delay = 0
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={inView ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 30, scale: 0.95 }}
      transition={{ duration: 0.6, delay, ease: [0.23, 1, 0.32, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

const CountUp = ({ target, label, suffix = "+", duration = 2 }: { target: number; label: string; suffix?: string; duration?: number }) => {
  const [count, setCount] = useState(0);
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  useEffect(() => {
    if (inView) {
      let start = 0;
      const increment = target / (duration * 60);
      const timer = setInterval(() => {
        start += increment;
        if (start >= target) {
          setCount(target);
          clearInterval(timer);
        } else {
          setCount(Math.floor(start));
        }
      }, 16);
      return () => clearInterval(timer);
    }
  }, [inView, target, duration]);

  return (
    <div ref={ref} className="flex flex-col gap-1.5">
      <span className="text-3xl md:text-5xl font-bold text-[#10B981] tracking-tight font-mono tabular-nums">
        {count}{suffix}
      </span>
      <span className="text-[10px] uppercase tracking-wider font-semibold text-[#94A3B8]">
        {label}
      </span>
    </div>
  );
};

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [productsOpen, setProductsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const { scrollYProgress } = useScroll();
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.8]);
  const opacity = useTransform(scrollYProgress, [0, 0.1], [1, 0]);

  const proofTiers = [
    {
      tier: "self-reported",
      desc: "Basic company details and credentials provided by the founder.",
    },
    {
      tier: "ai-extracted",
      desc: "Information automatically extracted and structured from public and private datasets.",
    },
    {
      tier: "document-backed",
      desc: "Verified against official company documents, filings, and financial reports.",
    },
    {
      tier: "stakeholder-endorsed",
      desc: "Validated by verified stakeholders, team members, customers or existing investors.",
    },
    {
      tier: "investor-backed",
      desc: "Third-party validation from lead/co-lead institutional investor backing.",
    },
  ] as const;

  return (
    <div className="min-h-screen flex flex-col bg-[#FCFDFF] overflow-x-hidden">
      <HeroBackground />
      <div className="fixed inset-0 -z-5 bg-gradient-to-b from-[#F8FAFC]/50 via-transparent to-[#F0F9FF]/30 pointer-events-none" />

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

      <main className="relative z-10 flex-1 w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16 flex flex-col items-center">
        <section className="flex flex-col lg:flex-row items-center gap-8 lg:gap-16 mt-4 lg:mt-8 w-full max-w-6xl">
          <motion.div 
            className="flex-1 text-center lg:text-left"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
          >
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-[rgba(16,185,129,0.06)] border border-[rgba(16,185,129,0.12)] rounded-full text-[11px] sm:text-xs font-medium text-[#10B981] select-none tracking-tight"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse" />
              Verifying potential, at scale.
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold tracking-tight text-[#09090B] leading-[1.05] mt-6"
            >
              Build a credibility profile that
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#10B981] via-[#2563EB] to-[#0F172A]"> investors trust.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-base sm:text-lg md:text-xl text-[#475569] leading-relaxed mt-4 max-w-xl mx-auto lg:mx-0"
            >
              Founders get a verifiable TrustScore to accelerate funding. Investors run due diligence with document-backed insights.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 mt-8 w-full sm:w-auto justify-center lg:justify-start"
            >
              <Link
                href="/register"
                className="w-full sm:w-auto text-center bg-gradient-to-r from-[#10B981] to-[#059669] text-white px-8 py-4 text-sm sm:text-base font-semibold rounded-2xl shadow-[0_4px_6px_-1px_rgba(0,0,0,0.03)] hover:shadow-[0_0_20px_rgba(16,185,129,0.25)] active:scale-95 transition-all duration-200 cursor-pointer"
              >
                I&apos;m a founder
              </Link>
              <Link
                href="/directory"
                className="w-full sm:w-auto text-center border border-[#E2E8F0] bg-white text-[#09090B] px-8 py-4 text-sm sm:text-base font-semibold rounded-2xl hover:bg-[#F8FAFC] active:scale-95 transition-all duration-200 cursor-pointer"
              >
                I&apos;m an investor
              </Link>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.4, ease: [0.23, 1, 0.32, 1] }}
            className="flex-1 w-full flex justify-center perspective-1000"
            whileHover={{ rotateY: 4, rotateX: 2, scale: 1.02 }}
          >
            <div className="relative w-full max-w-[600px]">
              <div className="absolute inset-0 bg-gradient-to-br from-[#10B981]/10 via-[#2563EB]/10 to-[#0F172A]/10 rounded-2xl blur-3xl animate-pulse-slow" />
              <div className="relative bg-white rounded-2xl border border-[rgba(255,255,255,0.5)] overflow-hidden shadow-[0_4px_6px_-1px_rgba(0,0,0,0.03),0_2px_4px_-2px_rgba(0,0,0,0.03)]">
                <Image
                  src="/hero-mockup.png"
                  alt="TrustScore AI Dashboard Showcase"
                  width={600}
                  height={450}
                  className="w-full h-auto object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-[#10B981]/5 via-transparent to-[#2563EB]/5 pointer-events-none" />
                <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-[#FCFDFF] to-transparent pointer-events-none" />
              </div>
            </div>
          </motion.div>
        </section>

        <AnimatedSection className="w-full border-t border-[#F1F5F9] py-8 sm:py-12 my-12 sm:my-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 text-center">
            <CountUp target={50} label="Startups registered" />
            <CountUp target={10} label="Avg seed round (M)" />
            <CountUp target={50} label="Active investors" />
            <CountUp target={5} label="Verification levels" />
          </div>
        </AnimatedSection>

        <AnimatedSection className="w-full flex flex-col items-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#09090B] text-center tracking-tight mb-8 sm:mb-12">
            One score, <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#10B981] to-[#2563EB]">five levels</span> of proof
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 w-full">
            {proofTiers.map((tierItem, idx) => (
              <AnimatedCard key={tierItem.tier} delay={idx * 0.05}>
                <div className="bg-white border border-[#F1F5F9] rounded-2xl p-5 flex flex-col gap-4 justify-between hover:border-[#10B981]/20 hover:shadow-[0_4px_6px_-1px_rgba(0,0,0,0.03)] transition-all duration-200 group h-full">
                  <div className="flex flex-col gap-3">
                    <div className="text-[10px] text-[#94A3B8] font-semibold uppercase tracking-wider font-mono">
                      Level {idx + 1}
                    </div>
                    <VerificationBadge tier={tierItem.tier} className="w-fit" />
                  </div>
                  <p className="text-[12px] text-[#475569] leading-relaxed mt-2 group-hover:text-[#09090B] transition-colors duration-200">
                    {tierItem.desc}
                  </p>
                </div>
              </AnimatedCard>
            ))}
          </div>
        </AnimatedSection>

        <AnimatedSection className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full mt-16">
          <AnimatedCard delay={0.1}>
            <div className="bg-white border border-[#F1F5F9] rounded-2xl p-8 flex flex-col gap-6 hover:border-[#10B981]/20 hover:shadow-[0_4px_6px_-1px_rgba(0,0,0,0.03)] transition-all duration-200 group h-full">
              <div className="w-14 h-14 rounded-full bg-[rgba(16,185,129,0.08)] border border-[rgba(16,185,129,0.12)] flex items-center justify-center text-[#10B981] group-hover:shadow-[0_0_20px_rgba(16,185,129,0.08)] transition-all duration-200">
                <IconUser className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-[#09090B]">For founders</h3>
                <ul className="flex flex-col gap-3 mt-4">
                  <li className="flex items-start gap-3 text-sm text-[#475569] leading-relaxed group-hover:text-[#09090B] transition-colors duration-200">
                    <IconCheck className="w-4 h-4 text-[#10B981] flex-shrink-0 mt-0.5" />
                    <span>Build a verifiable credibility profile that stands out to top-tier VCs.</span>
                  </li>
                  <li className="flex items-start gap-3 text-sm text-[#475569] leading-relaxed group-hover:text-[#09090B] transition-colors duration-200">
                    <IconCheck className="w-4 h-4 text-[#10B981] flex-shrink-0 mt-0.5" />
                    <span>Maintain full control over who accesses your detailed metrics.</span>
                  </li>
                  <li className="flex items-start gap-3 text-sm text-[#475569] leading-relaxed group-hover:text-[#09090B] transition-colors duration-200">
                    <IconCheck className="w-4 h-4 text-[#10B981] flex-shrink-0 mt-0.5" />
                    <span>Become &quot;due-diligence ready&quot; by identifying compliance gaps early.</span>
                  </li>
                </ul>
              </div>
            </div>
          </AnimatedCard>

          <AnimatedCard delay={0.2}>
            <div className="bg-white border border-[#F1F5F9] rounded-2xl p-8 flex flex-col gap-6 hover:border-[#10B981]/20 hover:shadow-[0_4px_6px_-1px_rgba(0,0,0,0.03)] transition-all duration-200 group h-full">
              <div className="w-14 h-14 rounded-full bg-[rgba(16,185,129,0.08)] border border-[rgba(16,185,129,0.12)] flex items-center justify-center text-[#10B981] group-hover:shadow-[0_0_20px_rgba(16,185,129,0.08)] transition-all duration-200">
                <IconShield className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-[#09090B]">For investors</h3>
                <ul className="flex flex-col gap-3 mt-4">
                  <li className="flex items-start gap-3 text-sm text-[#475569] leading-relaxed group-hover:text-[#09090B] transition-colors duration-200">
                    <IconCheck className="w-4 h-4 text-[#10B981] flex-shrink-0 mt-0.5" />
                    <span>Skip weeks of repetitive due diligence with pre-verified data.</span>
                  </li>
                  <li className="flex items-start gap-3 text-sm text-[#475569] leading-relaxed group-hover:text-[#09090B] transition-colors duration-200">
                    <IconCheck className="w-4 h-4 text-[#10B981] flex-shrink-0 mt-0.5" />
                    <span>See the source document behind every metric in one click.</span>
                  </li>
                  <li className="flex items-start gap-3 text-sm text-[#475569] leading-relaxed group-hover:text-[#09090B] transition-colors duration-200">
                    <IconCheck className="w-4 h-4 text-[#10B981] flex-shrink-0 mt-0.5" />
                    <span>Track portfolio health with real-time, automated updates.</span>
                  </li>
                </ul>
              </div>
            </div>
          </AnimatedCard>
        </AnimatedSection>

        <AnimatedSection className="w-full flex flex-col items-center mt-24">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#09090B] text-center tracking-tight mb-16">
            Why TrustScore is the <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#10B981] to-[#2563EB]">future</span> of startup credibility
          </h2>

          <div className="flex flex-col gap-24 w-full">
            <AnimatedCard delay={0.1}>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div className="flex flex-col gap-4">
                  <span className="text-[10px] text-[#10B981] font-mono uppercase tracking-wider">01</span>
                  <h3 className="text-2xl lg:text-3xl font-bold text-[#09090B] tracking-tight">
                    Transparency that cuts through the noise.
                  </h3>
                  <p className="text-sm sm:text-base text-[#475569] leading-relaxed">
                    We don&apos;t just give you a number. We provide the &quot;reason&quot; behind every score, mapping each metric back to its source document or endorsement.
                  </p>
                  <div className="flex flex-col gap-3 mt-4">
                    <div className="flex items-center gap-3 p-3 bg-[#F8FAFC] border border-[#F1F5F9] rounded-xl w-fit">
                      <div className="w-5 h-5 rounded-full bg-[rgba(16,185,129,0.08)] flex items-center justify-center text-[#10B981] flex-shrink-0">
                        <IconCheck className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-xs font-semibold text-[#09090B]">100% Data Provenance Accuracy</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-[#F8FAFC] border border-[#F1F5F9] rounded-xl w-fit">
                      <div className="w-5 h-5 rounded-full bg-[rgba(16,185,129,0.08)] flex items-center justify-center text-[#10B981] flex-shrink-0">
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
                        </svg>
                      </div>
                      <span className="text-xs font-semibold text-[#09090B]">Real-time Metric Updates</span>
                    </div>
                  </div>
                </div>
                <div className="w-full flex justify-center">
                  <div className="relative w-full max-w-[480px]">
                    <div className="absolute inset-0 bg-gradient-to-br from-[#10B981]/8 via-[#2563EB]/8 to-[#10B981]/8 rounded-2xl blur-2xl" />
                    <div className="relative bg-white rounded-2xl border border-[rgba(255,255,255,0.5)] overflow-hidden shadow-[0_4px_6px_-1px_rgba(0,0,0,0.03)]">
                      <img
                        src="/feature-transparency.png"
                        alt="Data verification metric detail panel"
                        className="w-full h-auto object-cover"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </AnimatedCard>

            <AnimatedCard delay={0.2}>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div className="w-full flex justify-center order-2 lg:order-1">
                  <div className="relative w-full max-w-[480px]">
                    <div className="absolute inset-0 bg-gradient-to-br from-[#2563EB]/8 via-[#10B981]/8 to-[#2563EB]/8 rounded-2xl blur-2xl" />
                    <div className="relative bg-white rounded-2xl border border-[rgba(255,255,255,0.5)] overflow-hidden shadow-[0_4px_6px_-1px_rgba(0,0,0,0.03)]">
                      <img
                        src="/feature-diligence.png"
                        alt="Standardized compliance folder diagram mockup"
                        className="w-full h-auto object-cover"
                      />
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-4 order-1 lg:order-2">
                  <span className="text-[10px] text-[#10B981] font-mono uppercase tracking-wider">02</span>
                  <h3 className="text-2xl lg:text-3xl font-bold text-[#09090B] tracking-tight">
                    Accelerate your due diligence.
                  </h3>
                  <p className="text-sm sm:text-base text-[#475569] leading-relaxed">
                    Stop manually verifying every metric. Our platform automates the tedious parts of the investment process so you can focus on building relationships.
                  </p>
                  <div className="flex flex-col gap-3 mt-4">
                    <div className="flex items-center gap-3 p-3 bg-[#F8FAFC] border border-[#F1F5F9] rounded-xl w-fit">
                      <div className="w-5 h-5 rounded-full bg-[rgba(16,185,129,0.08)] flex items-center justify-center text-[#10B981] flex-shrink-0">
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                        </svg>
                      </div>
                      <span className="text-xs font-semibold text-[#09090B]">Reduce Diligence Time by 80%</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-[#F8FAFC] border border-[#F1F5F9] rounded-xl w-fit">
                      <div className="w-5 h-5 rounded-full bg-[rgba(16,185,129,0.08)] flex items-center justify-center text-[#10B981] flex-shrink-0">
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.75V12A9.75 9.75 0 0 1 12 2.25h1.5A9.75 9.75 0 0 1 23.25 12v.75m-21 0a2.25 2.25 0 0 0 2.25 2.25h16.5a2.25 2.25 0 0 0 2.25-2.25m-21 0V16.5a2.25 2.25 0 0 0 2.25 2.25h16.5a2.25 2.25 0 0 0 2.25-2.25V12.75m-16.5 6V21a2.25 2.25 0 0 0 2.25 2.25h12A2.25 2.25 0 0 0 19.5 21v-2.25" />
                        </svg>
                      </div>
                      <span className="text-xs font-semibold text-[#09090B]">Standardized Data Packages</span>
                    </div>
                  </div>
                </div>
              </div>
            </AnimatedCard>
          </div>
        </AnimatedSection>

        <AnimatedSection className="w-full max-w-[800px] mx-auto text-center flex flex-col items-center gap-6 mt-28 py-12 px-4 border-t border-[#F1F5F9]">
          <div className="flex items-center gap-1 text-[#10B981] text-lg select-none">
            <IconStar className="w-5 h-5" />
            <IconStar className="w-5 h-5" />
            <IconStar className="w-5 h-5" />
            <IconStar className="w-5 h-5" />
            <IconStar className="w-5 h-5" />
          </div>

          <blockquote className="text-lg sm:text-xl font-normal text-[#09090B] leading-relaxed max-w-2xl">
            &quot;TrustScore accelerated our Series A diligence by weeks. It gave our new investors instant confidence in our core metrics.&quot;
          </blockquote>

          <div className="flex flex-col items-center gap-2 mt-2">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[rgba(16,185,129,0.12)] to-[rgba(16,185,129,0.12)] border border-[rgba(255,255,255,0.05)] flex items-center justify-center text-[#10B981] text-sm font-semibold select-none">
              SS
            </div>
            <div className="text-sm font-semibold text-[#09090B]">Sarah Stein</div>
            <div className="text-xs text-[#94A3B8]">Founder, BioMed Tech</div>
          </div>
        </AnimatedSection>

        <AnimatedSection className="w-full mb-20">
          <div className="relative bg-gradient-to-br from-[rgba(16,185,129,0.04)] via-[rgba(37,99,235,0.02)] to-[rgba(16,185,129,0.04)] border border-[#F1F5F9] rounded-2xl p-8 sm:p-12 text-center flex flex-col items-center gap-6 overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-[#10B981]/5 via-[#2563EB]/3 to-[#10B981]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#10B981]/8 rounded-full blur-3xl group-hover:bg-[#10B981]/12 transition-all duration-700" />
            <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-[#2563EB]/8 rounded-full blur-3xl group-hover:bg-[#2563EB]/12 transition-all duration-700" />

            <div className="relative z-10 flex flex-col items-center gap-6">
              <motion.div
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                transition={{ duration: 0.6, type: "spring", stiffness: 200 }}
                viewport={{ once: true }}
                className="w-20 h-20 rounded-full bg-gradient-to-br from-[#10B981] to-[#059669] p-1 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.03)]"
              >
                <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
                  <Image
                    src="/logo.png"
                    alt="TrustScore AI Logo"
                    width={40}
                    height={40}
                    className="w-10 h-10 object-contain"
                  />
                </div>
              </motion.div>

              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#09090B]">
                Ready to verify your potential?
              </h2>
              <p className="text-sm sm:text-base text-[#475569] max-w-lg leading-relaxed">
                Join hundreds of startups and investors using TrustScore to streamline the world of venture capital.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mt-4 w-full sm:w-auto justify-center">
                <Link
                  href="/register"
                  className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-[#10B981] to-[#059669] text-white text-sm font-semibold rounded-2xl shadow-[0_4px_6px_-1px_rgba(0,0,0,0.03)] hover:shadow-[0_0_20px_rgba(16,185,129,0.25)] active:scale-95 transition-all duration-200 cursor-pointer text-center"
                >
                  Get Started Now
                </Link>
                <Link
                  href="/directory"
                  className="w-full sm:w-auto px-8 py-4 border border-[#E2E8F0] bg-white text-[#09090B] text-sm font-semibold rounded-2xl hover:bg-[#F8FAFC] active:scale-95 transition-all duration-200 cursor-pointer text-center"
                >
                  View Demo Profile
                </Link>
              </div>
            </div>
          </div>
        </AnimatedSection>
      </main>

      <Footer />
    </div>
  );
}