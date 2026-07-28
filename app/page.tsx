"use client";

import { motion } from "framer-motion";
import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import VerificationBadge from "@/components/VerificationBadge";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { PerspectiveCamera, Float, Sparkles, Torus, MeshDistortMaterial } from "@react-three/drei";
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
    <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5}>
      <mesh ref={meshRef} scale={2.5}>
        <icosahedronGeometry args={[1, 2]} />
        <MeshDistortMaterial
          color="#00E5FF"
          metalness={0.9}
          roughness={0.05}
          clearcoat={1}
          clearcoatRoughness={0.05}
          transparent
          opacity={0.15}
          distort={0.4}
          speed={0.3}
          emissive="#00E5FF"
          emissiveIntensity={0.1}
        />
      </mesh>
    </Float>
  );
};

const BackgroundParticles = () => {
  const particlesRef = useRef<THREE.Points>(null!);
  const count = 150;
  const positions = new Float32Array(count * 3);

  useEffect(() => {
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 10;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 10;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 10;
    }
  }, []);

  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y = state.clock.getElapsedTime() * 0.015;
    }
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.02} transparent opacity={0.3} color="#00E5FF" sizeAttenuation />
    </points>
  );
};

const RingSystem = () => {
  const ringRef = useRef<THREE.Mesh>(null!);

  useFrame((state) => {
    if (ringRef.current) {
      ringRef.current.rotation.x = Math.sin(state.clock.getElapsedTime() * 0.08) * 0.2;
      ringRef.current.rotation.z = Math.cos(state.clock.getElapsedTime() * 0.06) * 0.15;
    }
  });

  return (
    <group ref={ringRef}>
      <Torus args={[2.8, 0.015, 16, 100]} rotation={[Math.PI / 2, 0, 0]}>
        <meshPhysicalMaterial color="#7000FF" emissive="#7000FF" emissiveIntensity={0.15} transparent opacity={0.15} metalness={0.8} roughness={0.2} />
      </Torus>
      <Torus args={[3.2, 0.01, 16, 100]} rotation={[Math.PI / 3, 0.2, 0]}>
        <meshPhysicalMaterial color="#00FFA3" emissive="#00FFA3" emissiveIntensity={0.1} transparent opacity={0.1} metalness={0.8} roughness={0.2} />
      </Torus>
    </group>
  );
};

const HeroBackground = () => {
  return (
    <div className="fixed inset-0 -z-10 pointer-events-none">
      <Canvas style={{ background: "#030305" }} dpr={[1, 2]}>
        <PerspectiveCamera makeDefault position={[0, 0, 8]} fov={45} />
        <ambientLight intensity={0.2} color="#00E5FF" />
        <directionalLight position={[5, 5, 5]} intensity={0.5} color="#7000FF" />
        <directionalLight position={[-5, -2, 5]} intensity={0.3} color="#00E5FF" />
        <pointLight position={[0, 0, 3]} intensity={0.5} color="#00FFA3" />
        <BackgroundParticles />
        <RingSystem />
        <HeroScene />
        <Sparkles count={100} scale={[10, 10, 10]} size={0.015} speed={0.2} color="#00E5FF" opacity={0.3} />
        <Sparkles count={50} scale={[10, 10, 10]} size={0.01} speed={0.15} color="#7000FF" opacity={0.2} />
      </Canvas>
    </div>
  );
};

const IconUser = ({ className = "w-5.5 h-5.5" }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.59 14.37a6 6 0 0 1-5.84 0M8 21.75h8M12 18v3.75m0-16.5c-3.17 0-5.75 2.58-5.75 5.75S9.12 16.5 12 16.5s5.75-2.58 5.75-5.75-2.58-5.75-5.75-5.75Z" />
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
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{ duration: 0.7, delay, ease: [0.23, 1, 0.32, 1] }}
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

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [productsOpen, setProductsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

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
    <div className="min-h-screen flex flex-col bg-[#030305] overflow-x-hidden">
      <HeroBackground />
      <div className="fixed inset-0 -z-5 bg-gradient-to-b from-[#030305]/40 via-transparent to-[#030305]/80 pointer-events-none" />

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
        <section className="flex flex-col md:flex-row items-center gap-12 mt-6 md:mt-12 w-full max-w-5xl">
          <div className="flex-1 text-left">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.05)] rounded-full text-[11px] font-medium text-[rgba(255,255,255,0.3)] select-none tracking-tight"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#00E5FF] animate-pulse" />
              Verifying potential, at scale.
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl md:text-6xl font-medium tracking-tight text-white leading-[1.1] mt-6"
            >
              Build a credibility profile that
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00E5FF] via-[#7000FF] to-[#00FFA3]"> investors trust.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-base md:text-lg text-[rgba(255,255,255,0.4)] leading-relaxed mt-4 max-w-xl"
            >
              Founders get a verifiable TrustScore to accelerate funding. Investors run due diligence with document-backed insights.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 mt-8 w-full sm:w-auto justify-start"
            >
              <Link
                href="/register"
                className="w-full sm:w-auto text-center bg-gradient-to-r from-[#00E5FF] to-[#7000FF] text-white px-6 py-3 text-sm font-medium rounded-lg hover:shadow-[0_0_40px_rgba(0,229,255,0.2)] active:scale-98 transition-all duration-300 cursor-pointer"
              >
                I&apos;m a founder
              </Link>
              <Link
                href="/directory"
                className="w-full sm:w-auto text-center border border-[rgba(255,255,255,0.05)] bg-[rgba(255,255,255,0.02)] text-white px-6 py-3 text-sm font-medium rounded-lg hover:bg-[rgba(255,255,255,0.04)] active:scale-98 transition-all duration-300 cursor-pointer"
              >
                I&apos;m an investor
              </Link>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex-1 w-full flex justify-center"
          >
            <div className="relative w-full max-w-[550px]">
              <div className="absolute inset-0 bg-gradient-to-br from-[#00E5FF]/5 via-[#7000FF]/5 to-[#00FFA3]/5 rounded-2xl border border-[rgba(255,255,255,0.03)] blur-2xl" />
              <div className="relative bg-[rgba(10,10,18,0.4)] backdrop-blur-sm rounded-2xl border border-[rgba(255,255,255,0.03)] overflow-hidden">
                <Image
                  src="/hero-mockup.png"
                  alt="TrustScore AI Dashboard Showcase"
                  width={550}
                  height={400}
                  className="w-full h-auto object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-br from-[#00E5FF]/5 via-transparent to-[#7000FF]/5 pointer-events-none" />
              </div>
            </div>
          </motion.div>
        </section>

        <AnimatedSection className="w-full border-t border-[rgba(255,255,255,0.03)] py-8 my-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="flex flex-col gap-1.5">
              <span className="text-2xl md:text-3xl font-medium text-[#00E5FF] tracking-tight">50+</span>
              <span className="text-[10px] uppercase tracking-wider font-semibold text-[rgba(255,255,255,0.2)]">Startups registered</span>
            </div>
            <div className="flex flex-col gap-1.5">
              <span className="text-2xl md:text-3xl font-medium text-[#00E5FF] tracking-tight">10+</span>
              <span className="text-[10px] uppercase tracking-wider font-semibold text-[rgba(255,255,255,0.2)]">Avg seed round</span>
            </div>
            <div className="flex flex-col gap-1.5">
              <span className="text-2xl md:text-3xl font-medium text-[#00E5FF] tracking-tight">50+</span>
              <span className="text-[10px] uppercase tracking-wider font-semibold text-[rgba(255,255,255,0.2)]">Active investors</span>
            </div>
            <div className="flex flex-col gap-1.5">
              <span className="text-2xl md:text-3xl font-medium text-[#00E5FF] tracking-tight">5</span>
              <span className="text-[10px] uppercase tracking-wider font-semibold text-[rgba(255,255,255,0.2)]">Verification levels</span>
            </div>
          </div>
        </AnimatedSection>

        <AnimatedSection className="w-full flex flex-col items-center">
          <h2 className="text-2xl md:text-3xl font-medium text-white text-center tracking-tight mb-8">
            One score, five levels of proof
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 w-full">
            {proofTiers.map((tierItem, idx) => (
              <AnimatedCard key={tierItem.tier} delay={idx * 0.05}>
                <div className="bg-[rgba(10,10,18,0.4)] backdrop-blur-xl border border-[rgba(255,255,255,0.03)] rounded-card p-5 flex flex-col gap-4 justify-between hover:border-[rgba(0,229,255,0.1)] transition-all duration-500 group h-full">
                  <div className="flex flex-col gap-3">
                    <div className="text-[10px] text-[rgba(255,255,255,0.15)] font-semibold uppercase tracking-wider font-mono">
                      Level {idx + 1}
                    </div>
                    <VerificationBadge tier={tierItem.tier} className="w-fit" />
                  </div>
                  <p className="text-[12px] text-[rgba(255,255,255,0.3)] leading-relaxed mt-2 group-hover:text-[rgba(255,255,255,0.5)] transition-colors duration-300">
                    {tierItem.desc}
                  </p>
                </div>
              </AnimatedCard>
            ))}
          </div>
        </AnimatedSection>

        <AnimatedSection className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full mt-16">
          <AnimatedCard delay={0.1}>
            <div className="bg-[rgba(10,10,18,0.4)] backdrop-blur-xl border border-[rgba(255,255,255,0.03)] rounded-card p-8 flex flex-col gap-6 hover:border-[rgba(0,229,255,0.1)] transition-all duration-500 group h-full">
              <div className="w-12 h-12 rounded-full bg-[rgba(0,229,255,0.05)] border border-[rgba(0,229,255,0.1)] flex items-center justify-center text-[#00E5FF] group-hover:shadow-[0_0_30px_rgba(0,229,255,0.05)] transition-all duration-500">
                <IconUser className="w-5.5 h-5.5" />
              </div>
              <div>
                <h3 className="text-xl font-medium text-white">For founders</h3>
                <ul className="flex flex-col gap-3 mt-4">
                  <li className="flex items-start gap-2.5 text-sm text-[rgba(255,255,255,0.4)] leading-relaxed group-hover:text-[rgba(255,255,255,0.6)] transition-colors duration-300">
                    <IconCheck className="w-4 h-4 text-[#00FFA3] flex-shrink-0 mt-0.5" />
                    <span>Build a verifiable credibility profile that stands out to top-tier VCs.</span>
                  </li>
                  <li className="flex items-start gap-2.5 text-sm text-[rgba(255,255,255,0.4)] leading-relaxed group-hover:text-[rgba(255,255,255,0.6)] transition-colors duration-300">
                    <IconCheck className="w-4 h-4 text-[#00FFA3] flex-shrink-0 mt-0.5" />
                    <span>Maintain full control over who accesses your detailed metrics.</span>
                  </li>
                  <li className="flex items-start gap-2.5 text-sm text-[rgba(255,255,255,0.4)] leading-relaxed group-hover:text-[rgba(255,255,255,0.6)] transition-colors duration-300">
                    <IconCheck className="w-4 h-4 text-[#00FFA3] flex-shrink-0 mt-0.5" />
                    <span>Become &quot;due-diligence ready&quot; by identifying compliance gaps early.</span>
                  </li>
                </ul>
              </div>
            </div>
          </AnimatedCard>

          <AnimatedCard delay={0.2}>
            <div className="bg-[rgba(10,10,18,0.4)] backdrop-blur-xl border border-[rgba(255,255,255,0.03)] rounded-card p-8 flex flex-col gap-6 hover:border-[rgba(112,0,255,0.1)] transition-all duration-500 group h-full">
              <div className="w-12 h-12 rounded-full bg-[rgba(112,0,255,0.05)] border border-[rgba(112,0,255,0.1)] flex items-center justify-center text-[#7000FF] group-hover:shadow-[0_0_30px_rgba(112,0,255,0.05)] transition-all duration-500">
                <IconShield className="w-5.5 h-5.5" />
              </div>
              <div>
                <h3 className="text-xl font-medium text-white">For investors</h3>
                <ul className="flex flex-col gap-3 mt-4">
                  <li className="flex items-start gap-2.5 text-sm text-[rgba(255,255,255,0.4)] leading-relaxed group-hover:text-[rgba(255,255,255,0.6)] transition-colors duration-300">
                    <IconCheck className="w-4 h-4 text-[#00FFA3] flex-shrink-0 mt-0.5" />
                    <span>Skip weeks of repetitive due diligence with pre-verified data.</span>
                  </li>
                  <li className="flex items-start gap-2.5 text-sm text-[rgba(255,255,255,0.4)] leading-relaxed group-hover:text-[rgba(255,255,255,0.6)] transition-colors duration-300">
                    <IconCheck className="w-4 h-4 text-[#00FFA3] flex-shrink-0 mt-0.5" />
                    <span>See the source document behind every metric in one click.</span>
                  </li>
                  <li className="flex items-start gap-2.5 text-sm text-[rgba(255,255,255,0.4)] leading-relaxed group-hover:text-[rgba(255,255,255,0.6)] transition-colors duration-300">
                    <IconCheck className="w-4 h-4 text-[#00FFA3] flex-shrink-0 mt-0.5" />
                    <span>Track portfolio health with real-time, automated updates.</span>
                  </li>
                </ul>
              </div>
            </div>
          </AnimatedCard>
        </AnimatedSection>

        <AnimatedSection className="w-full flex flex-col items-center mt-24">
          <h2 className="text-2xl md:text-3xl font-medium text-white text-center tracking-tight mb-16">
            Why TrustScore is the future of startup credibility
          </h2>

          <div className="flex flex-col gap-24 w-full">
            <AnimatedCard delay={0.1}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                <div className="flex flex-col gap-4">
                  <h3 className="text-xl md:text-2xl font-medium text-white tracking-tight">
                    Transparency that cuts through the noise.
                  </h3>
                  <p className="text-sm md:text-base text-[rgba(255,255,255,0.4)] leading-relaxed">
                    We don&apos;t just give you a number. We provide the &quot;reason&quot; behind every score, mapping each metric back to its source document or endorsement.
                  </p>
                  <div className="flex flex-col gap-3 mt-4">
                    <div className="flex items-center gap-3 p-3 bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.03)] rounded-button w-fit">
                      <div className="w-5 h-5 rounded-full bg-[rgba(0,255,163,0.05)] flex items-center justify-center text-[#00FFA3] flex-shrink-0">
                        <IconCheck className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-xs font-semibold text-white">100% Data Provenance Accuracy</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.03)] rounded-button w-fit">
                      <div className="w-5 h-5 rounded-full bg-[rgba(0,229,255,0.05)] flex items-center justify-center text-[#00E5FF] flex-shrink-0">
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
                        </svg>
                      </div>
                      <span className="text-xs font-semibold text-white">Real-time Metric Updates</span>
                    </div>
                  </div>
                </div>
                <div className="w-full flex justify-center">
                  <div className="relative w-full max-w-[460px]">
                    <div className="absolute inset-0 bg-gradient-to-br from-[#00E5FF]/5 via-[#7000FF]/5 to-[#00FFA3]/5 rounded-2xl border border-[rgba(255,255,255,0.03)] blur-2xl" />
                    <div className="relative bg-[rgba(10,10,18,0.4)] backdrop-blur-sm rounded-2xl border border-[rgba(255,255,255,0.03)] overflow-hidden">
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                <div className="w-full flex justify-center order-2 md:order-1">
                  <div className="relative w-full max-w-[460px]">
                    <div className="absolute inset-0 bg-gradient-to-br from-[#7000FF]/5 via-[#00E5FF]/5 to-[#00FFA3]/5 rounded-2xl border border-[rgba(255,255,255,0.03)] blur-2xl" />
                    <div className="relative bg-[rgba(10,10,18,0.4)] backdrop-blur-sm rounded-2xl border border-[rgba(255,255,255,0.03)] overflow-hidden">
                      <img
                        src="/feature-diligence.png"
                        alt="Standardized compliance folder diagram mockup"
                        className="w-full h-auto object-cover"
                      />
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-4 order-1 md:order-2">
                  <h3 className="text-xl md:text-2xl font-medium text-white tracking-tight">
                    Accelerate your due diligence.
                  </h3>
                  <p className="text-sm md:text-base text-[rgba(255,255,255,0.4)] leading-relaxed">
                    Stop manually verifying every metric. Our platform automates the tedious parts of the investment process so you can focus on building relationships.
                  </p>
                  <div className="flex flex-col gap-3 mt-4">
                    <div className="flex items-center gap-3 p-3 bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.03)] rounded-button w-fit">
                      <div className="w-5 h-5 rounded-full bg-[rgba(0,229,255,0.05)] flex items-center justify-center text-[#00E5FF] flex-shrink-0">
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                        </svg>
                      </div>
                      <span className="text-xs font-semibold text-white">Reduce Diligence Time by 80%</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.03)] rounded-button w-fit">
                      <div className="w-5 h-5 rounded-full bg-[rgba(0,229,255,0.05)] flex items-center justify-center text-[#00E5FF] flex-shrink-0">
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.75V12A9.75 9.75 0 0 1 12 2.25h1.5A9.75 9.75 0 0 1 23.25 12v.75m-21 0a2.25 2.25 0 0 0 2.25 2.25h16.5a2.25 2.25 0 0 0 2.25-2.25m-21 0V16.5a2.25 2.25 0 0 0 2.25 2.25h16.5a2.25 2.25 0 0 0 2.25-2.25V12.75m-16.5 6V21a2.25 2.25 0 0 0 2.25 2.25h12A2.25 2.25 0 0 0 19.5 21v-2.25" />
                        </svg>
                      </div>
                      <span className="text-xs font-semibold text-white">Standardized Data Packages</span>
                    </div>
                  </div>
                </div>
              </div>
            </AnimatedCard>
          </div>
        </AnimatedSection>

        <AnimatedSection className="w-full max-w-[800px] mx-auto text-center flex flex-col items-center gap-6 mt-28 py-12 px-4 border-t border-[rgba(255,255,255,0.03)]">
          <div className="flex items-center gap-1 text-[#C8A451] text-lg select-none">
            <IconStar className="w-5 h-5" />
            <IconStar className="w-5 h-5" />
            <IconStar className="w-5 h-5" />
            <IconStar className="w-5 h-5" />
            <IconStar className="w-5 h-5" />
          </div>

          <blockquote className="text-lg md:text-xl font-normal text-white leading-relaxed">
            &quot;TrustScore accelerated our Series A diligence by weeks. It gave our new investors instant confidence in our core metrics.&quot;
          </blockquote>

          <div className="flex flex-col items-center gap-2 mt-2">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[rgba(0,229,255,0.1)] to-[rgba(112,0,255,0.1)] border border-[rgba(255,255,255,0.05)] flex items-center justify-center text-[#00E5FF] text-xs font-semibold select-none">
              SS
            </div>
            <div className="text-sm font-semibold text-white">Sarah Stein</div>
            <div className="text-xs text-[rgba(255,255,255,0.3)]">Founder, BioMed Tech</div>
          </div>
        </AnimatedSection>

        <AnimatedSection className="w-full mb-20">
          <div className="relative bg-gradient-to-br from-[rgba(0,229,255,0.05)] via-[rgba(112,0,255,0.02)] to-[rgba(0,255,163,0.02)] border border-[rgba(255,255,255,0.05)] rounded-card p-8 md:p-12 text-center flex flex-col items-center gap-6 overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-[#00E5FF]/5 via-[#7000FF]/2 to-[#00FFA3]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#00E5FF]/5 rounded-full blur-3xl group-hover:bg-[#00E5FF]/10 transition-all duration-700" />
            <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-[#7000FF]/5 rounded-full blur-3xl group-hover:bg-[#7000FF]/10 transition-all duration-700" />

            <div className="relative z-10 flex flex-col items-center gap-6">
              <motion.div
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                transition={{ duration: 0.5, type: "spring" }}
                viewport={{ once: true }}
                className="w-16 h-16 rounded-full bg-gradient-to-br from-[#00E5FF] to-[#7000FF] p-0.5"
              >
                <div className="w-full h-full rounded-full bg-[#030305] flex items-center justify-center">
                  <span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#00E5FF] to-[#7000FF]">AI</span>
                </div>
              </motion.div>

              <h2 className="text-2xl md:text-3xl font-medium tracking-tight text-white">
                Ready to verify your potential?
              </h2>
              <p className="text-sm md:text-base text-[rgba(255,255,255,0.4)] max-w-lg leading-relaxed">
                Join hundreds of startups and investors using TrustScore to streamline the world of venture capital.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mt-4 w-full sm:w-auto justify-center">
                <Link
                  href="/register"
                  className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-[#00E5FF] to-[#7000FF] text-white text-sm font-medium rounded-button hover:shadow-[0_0_40px_rgba(0,229,255,0.2)] active:scale-98 transition-all duration-300 cursor-pointer text-center"
                >
                  Get Started Now
                </Link>
                <Link
                  href="/directory"
                  className="w-full sm:w-auto px-6 py-3 border border-[rgba(255,255,255,0.05)] bg-[rgba(255,255,255,0.02)] text-white text-sm font-medium rounded-button hover:bg-[rgba(255,255,255,0.04)] active:scale-98 transition-all duration-300 cursor-pointer text-center"
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