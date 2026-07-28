"use client";

import React, { useState, useRef, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import StartupCard from "@/components/StartupCard";
import { StartupCardData } from "@/types/startup";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { PerspectiveCamera, Float, Sparkles, Torus, MeshDistortMaterial } from "@react-three/drei";
import * as THREE from "three";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

const PreviewScene = () => {
  const meshRef = useRef<THREE.Mesh>(null!);
  const { mouse } = useThree();

  useFrame((state) => {
    if (meshRef.current) {
      const x = (mouse.x - 0) * 0.15;
      const y = (mouse.y - 0) * 0.1;
      meshRef.current.rotation.x += (y - meshRef.current.rotation.x) * 0.02;
      meshRef.current.rotation.y += (x - meshRef.current.rotation.y) * 0.02;
      const time = state.clock.getElapsedTime();
      meshRef.current.position.y = Math.sin(time * 0.3) * 0.08;
    }
  });

  return (
    <Float speed={1.2} rotationIntensity={0.15} floatIntensity={0.3}>
      <mesh ref={meshRef} scale={1.8}>
        <icosahedronGeometry args={[1, 1]} />
        <MeshDistortMaterial
          color="#00E5FF"
          metalness={0.9}
          roughness={0.05}
          clearcoat={1}
          clearcoatRoughness={0.05}
          transparent
          opacity={0.1}
          distort={0.2}
          speed={0.3}
          emissive="#00E5FF"
          emissiveIntensity={0.05}
        />
      </mesh>
    </Float>
  );
};

const BackgroundParticles = () => {
  const particlesRef = useRef<THREE.Points>(null!);
  const count = 80;
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
      particlesRef.current.rotation.y = state.clock.getElapsedTime() * 0.01;
    }
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.015} transparent opacity={0.15} color="#00E5FF" sizeAttenuation />
    </points>
  );
};

const RingSystem = () => {
  const ringRef = useRef<THREE.Mesh>(null!);

  useFrame((state) => {
    if (ringRef.current) {
      ringRef.current.rotation.x = Math.sin(state.clock.getElapsedTime() * 0.06) * 0.15;
      ringRef.current.rotation.z = Math.cos(state.clock.getElapsedTime() * 0.05) * 0.1;
    }
  });

  return (
    <group ref={ringRef}>
      <Torus args={[2.5, 0.015, 16, 100]} rotation={[Math.PI / 2, 0, 0]}>
        <meshPhysicalMaterial color="#7000FF" emissive="#7000FF" emissiveIntensity={0.08} transparent opacity={0.1} metalness={0.8} roughness={0.2} />
      </Torus>
      <Torus args={[2.9, 0.01, 16, 100]} rotation={[Math.PI / 3, 0.15, 0]}>
        <meshPhysicalMaterial color="#00FFA3" emissive="#00FFA3" emissiveIntensity={0.06} transparent opacity={0.06} metalness={0.8} roughness={0.2} />
      </Torus>
    </group>
  );
};

const PreviewBackground = () => {
  return (
    <div className="fixed inset-0 -z-10 pointer-events-none">
      <Canvas style={{ background: "#030305" }} dpr={[1, 2]}>
        <PerspectiveCamera makeDefault position={[0, 0, 7]} fov={45} />
        <ambientLight intensity={0.2} color="#00E5FF" />
        <directionalLight position={[5, 5, 5]} intensity={0.4} color="#7000FF" />
        <directionalLight position={[-5, -2, 5]} intensity={0.2} color="#00E5FF" />
        <pointLight position={[0, 0, 3]} intensity={0.3} color="#00FFA3" />
        <BackgroundParticles />
        <RingSystem />
        <PreviewScene />
        <Sparkles count={60} scale={[8, 8, 8]} size={0.015} speed={0.2} color="#00E5FF" opacity={0.2} />
        <Sparkles count={30} scale={[8, 8, 8]} size={0.01} speed={0.15} color="#7000FF" opacity={0.15} />
      </Canvas>
    </div>
  );
};

const IconGrid = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z" />
  </svg>
);

const IconEye = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
  </svg>
);

const IconCheck = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="2.5 6 4.5 8 9.5 3.5" />
  </svg>
);

const IconLock = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
  </svg>
);

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

const mockStartups: StartupCardData[] = [
  {
    name: "Apex Biosensors",
    logoUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=128&h=128&fit=crop&q=80",
    description: "Continuous glucose monitoring using non-invasive infrared spectroscopy.",
    sector: "Healthtech",
    stage: "Scaling",
    location: "Boston, MA",
    foundedYear: 2021,
    investorCount: 8,
    fundingRound: "Series A",
    trustScore: 0.84,
    badgeTier: "investor-backed",
    showScore: true,
  },
  {
    name: "Velo Logistics",
    logoUrl: "https://images.unsplash.com/photo-1618005198143-e528346d9a59?w=128&h=128&fit=crop&q=80",
    description: "Last-mile drone delivery network for urgent medical supplies.",
    sector: "Logistics",
    stage: "Revenue",
    location: "Austin, TX",
    foundedYear: 2022,
    investorCount: 4,
    fundingRound: "Seed",
    trustScore: 0.71,
    badgeTier: "stakeholder-endorsed",
    showScore: true,
  },
  {
    name: "Nova Carbon",
    logoUrl: "https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?w=128&h=128&fit=crop&q=80",
    description: "Direct air capture systems using novel solid sorbent filters.",
    sector: "Climate",
    stage: "MVP",
    location: "Seattle, WA",
    foundedYear: 2023,
    investorCount: 2,
    fundingRound: "Pre-Seed",
    trustScore: 0.65,
    badgeTier: "document-backed",
    showScore: false,
  },
  {
    name: "Solara Analytics",
    logoUrl: "",
    description: "Predictive maintenance algorithms for utility-scale solar farms.",
    sector: "Energy",
    stage: "Idea",
    location: "Denver, CO",
    foundedYear: 2024,
    investorCount: 0,
    fundingRound: "Pre-Seed",
    trustScore: 0.48,
    badgeTier: "self-reported",
    showScore: true,
  },
];

export default function PreviewPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [productsOpen, setProductsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-[#030305] overflow-x-hidden">
      <PreviewBackground />
      <div className="fixed inset-0 -z-5 bg-gradient-to-b from-[#030305]/40 via-transparent to-[#030305]/80 pointer-events-none" />

      <Navbar
        isLoggedIn={isLoggedIn}
        onAuthToggle={() => setIsLoggedIn((prev) => !prev)}
        productsOpenOverride={productsOpen}
        profileOpenOverride={profileOpen}
        onProductsOpenChange={setProductsOpen}
        onProfileOpenChange={setProfileOpen}
      />

      <main className="relative z-10 flex-1 w-full max-w-[1200px] mx-auto px-4 md:px-6 py-12 flex flex-col gap-10">
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col gap-3"
        >
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[rgba(0,229,255,0.05)] border border-[rgba(0,229,255,0.1)] rounded-full text-[11px] font-medium text-[#00E5FF] select-none tracking-tight w-fit">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00E5FF] animate-pulse" />
            Component Preview
          </div>
          <h1 className="text-3xl font-medium tracking-tight text-white">
            Layout Component Preview
          </h1>
          <p className="text-base text-[rgba(255,255,255,0.4)] max-w-2xl leading-relaxed">
            This temporary page allows you to inspect the shared layout components, test responsive behaviors, and verify strict adherence to the design tokens.
          </p>
        </motion.div>

        <AnimatedCard>
          <div className="bg-[rgba(10,10,18,0.4)] backdrop-blur-xl border border-[rgba(255,255,255,0.03)] rounded-card p-6 flex flex-col gap-5 hover:border-[rgba(255,255,255,0.05)] transition-all duration-500">
            <div>
              <h2 className="text-lg font-medium text-white">
                Interactive Preview Controls
              </h2>
              <p className="text-xs text-[rgba(255,255,255,0.3)] mt-1">
                Toggle the states below to test how the top navigation bar and its dropdown cards respond.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <div className="flex flex-col gap-1.5">
                <span className="text-[10px] font-medium text-[rgba(255,255,255,0.2)] uppercase tracking-wider font-mono">Auth State</span>
                <button
                  onClick={() => {
                    setIsLoggedIn(!isLoggedIn);
                    if (isLoggedIn) setProfileOpen(false);
                  }}
                  className={`preview-control px-4 py-2 text-sm font-medium rounded-button border transition-all duration-300 cursor-pointer select-none ${
                    isLoggedIn
                      ? "bg-[rgba(0,229,255,0.05)] border-[rgba(0,229,255,0.15)] text-[#00E5FF] hover:bg-[rgba(0,229,255,0.08)]"
                      : "bg-[rgba(255,255,255,0.02)] border-[rgba(255,255,255,0.05)] text-[rgba(255,255,255,0.4)] hover:bg-[rgba(255,255,255,0.04)]"
                  }`}
                >
                  {isLoggedIn ? "Status: Logged In" : "Status: Logged Out"}
                </button>
              </div>

              <div className="flex flex-col gap-1.5">
                <span className="text-[10px] font-medium text-[rgba(255,255,255,0.2)] uppercase tracking-wider font-mono">Products Menu</span>
                <button
                  onClick={() => setProductsOpen(!productsOpen)}
                  className={`preview-control px-4 py-2 text-sm font-medium rounded-button border transition-all duration-300 cursor-pointer select-none ${
                    productsOpen
                      ? "bg-[rgba(0,229,255,0.05)] border-[rgba(0,229,255,0.15)] text-[#00E5FF] hover:bg-[rgba(0,229,255,0.08)]"
                      : "bg-[rgba(255,255,255,0.02)] border-[rgba(255,255,255,0.05)] text-[rgba(255,255,255,0.4)] hover:bg-[rgba(255,255,255,0.04)]"
                  }`}
                >
                  {productsOpen ? "Force Dropdown: Open" : "Force Dropdown: Closed"}
                </button>
              </div>

              <div className="flex flex-col gap-1.5">
                <span className="text-[10px] font-medium text-[rgba(255,255,255,0.2)] uppercase tracking-wider font-mono">Profile Menu</span>
                <button
                  onClick={() => isLoggedIn && setProfileOpen(!profileOpen)}
                  disabled={!isLoggedIn}
                  className={`preview-control px-4 py-2 text-sm font-medium rounded-button border transition-all duration-300 select-none ${
                    !isLoggedIn
                      ? "bg-[rgba(255,255,255,0.01)] border-[rgba(255,255,255,0.02)] text-[rgba(255,255,255,0.15)] opacity-50 cursor-not-allowed"
                      : profileOpen
                      ? "bg-[rgba(0,229,255,0.05)] border-[rgba(0,229,255,0.15)] text-[#00E5FF] hover:bg-[rgba(0,229,255,0.08)] cursor-pointer"
                      : "bg-[rgba(255,255,255,0.02)] border-[rgba(255,255,255,0.05)] text-[rgba(255,255,255,0.4)] hover:bg-[rgba(255,255,255,0.04)] cursor-pointer"
                  }`}
                >
                  {!isLoggedIn
                    ? "Requires Login State"
                    : profileOpen
                    ? "Force Dropdown: Open"
                    : "Force Dropdown: Closed"}
                </button>
              </div>
            </div>
          </div>
        </AnimatedCard>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <AnimatedCard delay={0.1}>
            <div className="bg-[rgba(10,10,18,0.4)] backdrop-blur-xl border border-[rgba(255,255,255,0.03)] rounded-card p-6 flex flex-col gap-4 hover:border-[rgba(0,229,255,0.05)] transition-all duration-500 group">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[rgba(0,229,255,0.05)] border border-[rgba(0,229,255,0.08)] flex items-center justify-center text-[#00E5FF] group-hover:shadow-[0_0_30px_rgba(0,229,255,0.03)] transition-all duration-500">
                    <IconGrid className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-medium text-white">
                    Verify Your Startup Credibility
                  </h3>
                </div>
                <span className="px-2.5 py-0.5 text-[10px] font-medium bg-[rgba(0,229,255,0.05)] text-[#00E5FF] rounded-full border border-[rgba(0,229,255,0.08)]">
                  Tier 1
                </span>
              </div>
              <p className="text-sm text-[rgba(255,255,255,0.4)] leading-relaxed group-hover:text-[rgba(255,255,255,0.5)] transition-colors duration-300">
                Complete the registration checklist to compute your initial score. Pairing assertions with evidence unlocks advanced verification levels.
              </p>
              <div className="flex gap-3 mt-2">
                <button className="bg-gradient-to-r from-[#00E5FF] to-[#7000FF] text-white px-4 py-2 text-sm font-medium rounded-button hover:shadow-[0_0_30px_rgba(0,229,255,0.15)] active:scale-98 transition-all duration-300 cursor-pointer">
                  Get Started
                </button>
                <button className="border border-[rgba(255,255,255,0.05)] bg-[rgba(255,255,255,0.02)] text-white px-4 py-2 text-sm font-medium rounded-button hover:bg-[rgba(255,255,255,0.04)] active:scale-98 transition-all duration-300 cursor-pointer">
                  View Sample
                </button>
              </div>
            </div>
          </AnimatedCard>

          <AnimatedCard delay={0.2}>
            <div className="bg-[rgba(10,10,18,0.4)] backdrop-blur-xl border border-[rgba(255,255,255,0.03)] rounded-card p-6 flex flex-col gap-4 hover:border-[rgba(112,0,255,0.05)] transition-all duration-500 group">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[rgba(112,0,255,0.05)] border border-[rgba(112,0,255,0.08)] flex items-center justify-center text-[#7000FF] group-hover:shadow-[0_0_30px_rgba(112,0,255,0.03)] transition-all duration-500">
                  <IconEye className="w-5 h-5" />
                </div>
                <h3 className="text-base font-medium text-white">
                  Verify Design Token Conformance
                </h3>
              </div>
              <div className="space-y-2.5">
                <div className="flex items-center justify-between text-sm py-1 border-b border-[rgba(255,255,255,0.03)]">
                  <span className="text-[rgba(255,255,255,0.3)]">Font family</span>
                  <span className="font-medium text-white">Inter (sans-serif)</span>
                </div>
                <div className="flex items-center justify-between text-sm py-1 border-b border-[rgba(255,255,255,0.03)]">
                  <span className="text-[rgba(255,255,255,0.3)]">Card border radius</span>
                  <span className="font-medium text-white">12px (rounded-card)</span>
                </div>
                <div className="flex items-center justify-between text-sm py-1 border-b border-[rgba(255,255,255,0.03)]">
                  <span className="text-[rgba(255,255,255,0.3)]">Button border radius</span>
                  <span className="font-medium text-white">8px (rounded-button)</span>
                </div>
                <div className="flex items-center justify-between text-sm py-1">
                  <span className="text-[rgba(255,255,255,0.3)]">Border thickness</span>
                  <span className="font-medium text-white">1px hairline</span>
                </div>
              </div>
            </div>
          </AnimatedCard>
        </div>

        <div className="flex flex-col gap-6 mt-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h2 className="text-xl font-medium text-white">
              Startup Directory Card Preview
            </h2>
            <p className="text-sm text-[rgba(255,255,255,0.3)] mt-1">
              Interactive display of the reusable StartupCard component in the investor directory, showcasing all verification badge tiers and the locked-score state.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {mockStartups.map((startup, idx) => (
              <AnimatedCard key={idx} delay={0.1 + idx * 0.05}>
                <StartupCard startup={startup} />
              </AnimatedCard>
            ))}
          </div>
        </div>

      </main>

      <Footer />
    </div>
  );
}