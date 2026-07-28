"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import VerificationBadge from "@/components/VerificationBadge";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { PerspectiveCamera, Float, Sparkles, Torus, MeshDistortMaterial } from "@react-three/drei";
import * as THREE from "three";

const DemoScene = ({ score }: { score: number }) => {
  const meshRef = useRef<THREE.Mesh>(null!);
  const { mouse } = useThree();
  const scoreValue = score / 100;

  useFrame((state) => {
    if (meshRef.current) {
      const x = (mouse.x - 0) * 0.2;
      const y = (mouse.y - 0) * 0.15;
      meshRef.current.rotation.x += (y - meshRef.current.rotation.x) * 0.02;
      meshRef.current.rotation.y += (x - meshRef.current.rotation.y) * 0.02;
      const time = state.clock.getElapsedTime();
      meshRef.current.position.y = Math.sin(time * 0.3) * 0.08;
    }
  });

  const getColor = () => {
    if (scoreValue >= 0.8) return "#00FFA3";
    if (scoreValue >= 0.6) return "#00E5FF";
    if (scoreValue >= 0.4) return "#C8A451";
    return "#7000FF";
  };

  const color = getColor();

  return (
    <Float speed={1.2} rotationIntensity={0.15} floatIntensity={0.3}>
      <mesh ref={meshRef} scale={1.8}>
        <icosahedronGeometry args={[1, 1]} />
        <MeshDistortMaterial
          color={color}
          metalness={0.9}
          roughness={0.05}
          clearcoat={1}
          clearcoatRoughness={0.05}
          transparent
          opacity={0.12}
          distort={0.25}
          speed={0.4}
          emissive={color}
          emissiveIntensity={0.08}
        />
      </mesh>
    </Float>
  );
};

const BackgroundParticles = () => {
  const particlesRef = useRef<THREE.Points>(null!);
  const count = 100;
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
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.015} transparent opacity={0.12} color="#00E5FF" sizeAttenuation />
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
        <meshPhysicalMaterial color="#7000FF" emissive="#7000FF" emissiveIntensity={0.08} transparent opacity={0.08} metalness={0.8} roughness={0.2} />
      </Torus>
      <Torus args={[2.9, 0.01, 16, 100]} rotation={[Math.PI / 3, 0.15, 0]}>
        <meshPhysicalMaterial color="#00FFA3" emissive="#00FFA3" emissiveIntensity={0.06} transparent opacity={0.05} metalness={0.8} roughness={0.2} />
      </Torus>
    </group>
  );
};

const DemoBackground = ({ score }: { score: number }) => {
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
        <DemoScene score={score} />
        <Sparkles count={60} scale={[8, 8, 8]} size={0.015} speed={0.2} color="#00E5FF" opacity={0.15} />
        <Sparkles count={30} scale={[8, 8, 8]} size={0.01} speed={0.15} color="#7000FF" opacity={0.1} />
      </Canvas>
    </div>
  );
};

const IconArrowLeft = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
  </svg>
);

const IconCheck = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="2.5 6 4.5 8 9.5 3.5" />
  </svg>
);

const IconX = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const IconBuilding = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 21V6.75a.75.75 0 0 1 .75-.75h13.5a.75.75 0 0 1 .75.75V21m-6.75-15v15m-3-15v15m-3-15v15m6.75-15v15" />
  </svg>
);

const IconUsers = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
  </svg>
);

const IconTrending = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18 9 11.25l4.306 4.307a11.95 11.95 0 0 1 5.814-5.518l2.74-1.22m0 0-3.75-1.002m3.75 1.003-1.002 3.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
  </svg>
);

const IconDocument = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
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
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.6, delay, ease: [0.23, 1, 0.32, 1] }}
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
      transition={{ duration: 0.5, delay, ease: [0.23, 1, 0.32, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

interface DimensionScore {
  name: string;
  score: number;
  icon: React.ReactNode;
  color: string;
}

export default function DemoPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [productsOpen, setProductsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"basics" | "founders" | "traction" | "funding" | "documents">("basics");

  const trustScore = 84;

  const dimensionScores: DimensionScore[] = [
    { name: "Team", score: 92, icon: <IconUsers className="w-5 h-5" />, color: "#00E5FF" },
    { name: "Market", score: 78, icon: <IconTrending className="w-5 h-5" />, color: "#00FFA3" },
    { name: "Traction", score: 85, icon: <IconDocument className="w-5 h-5" />, color: "#C8A451" },
    { name: "Financial Clarity", score: 88, icon: <IconBuilding className="w-5 h-5" />, color: "#7000FF" },
    { name: "Compliance", score: 76, icon: <IconCheck className="w-5 h-5" />, color: "#00E5FF" },
  ];

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-[#00FFA3]";
    if (score >= 60) return "text-[#00E5FF]";
    if (score >= 40) return "text-[#C8A451]";
    return "text-[#7000FF]";
  };

  const getScoreGlow = (score: number) => {
    if (score >= 80) return "shadow-[0_0_60px_rgba(0,255,163,0.15)]";
    if (score >= 60) return "shadow-[0_0_60px_rgba(0,229,255,0.15)]";
    if (score >= 40) return "shadow-[0_0_60px_rgba(200,164,81,0.15)]";
    return "shadow-[0_0_60px_rgba(112,0,255,0.15)]";
  };

  const getScoreRing = (score: number) => {
    const percentage = score / 100;
    const circumference = 2 * Math.PI * 54;
    const offset = circumference - percentage * circumference;
    return offset;
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#030305] overflow-x-hidden">
      <DemoBackground score={trustScore} />
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

      <main className="relative z-10 flex-1 w-full max-w-[1200px] mx-auto px-4 md:px-6 py-8 flex flex-col gap-6">
        
        <AnimatedSection className="flex items-center gap-3">
          <Link
            href="/about"
            className="text-xs font-semibold text-[#00E5FF] hover:text-[#00E5FF]/80 transition-colors flex items-center gap-1 group"
          >
            <IconArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            Back to About
          </Link>
          <span className="text-xs text-[rgba(255,255,255,0.1)]">•</span>
          <span className="text-xs text-[rgba(255,255,255,0.2)] font-mono">Demo Profile</span>
        </AnimatedSection>

        <AnimatedCard delay={0.1} className="bg-[rgba(10,10,18,0.6)] backdrop-blur-xl border border-[rgba(255,255,255,0.05)] rounded-card p-6 flex flex-col md:flex-row justify-between items-center gap-6 hover:border-[rgba(0,229,255,0.08)] transition-all duration-500">
          <div className="flex items-center gap-4">
            <div className="relative w-16 h-16 rounded-xl border border-[rgba(255,255,255,0.05)] bg-[rgba(10,10,18,0.4)] flex items-center justify-center font-semibold text-[#00E5FF] select-none">
              <span className="text-lg">AI</span>
              <div className="absolute inset-0 bg-gradient-to-br from-[#00E5FF]/5 to-[#7000FF]/5 rounded-xl" />
            </div>
            <div>
              <h1 className="text-2xl font-medium text-white tracking-tight">Apex Biosensors</h1>
              <div className="flex items-center gap-3 mt-1">
                <p className="text-xs text-[rgba(255,255,255,0.4)] capitalize">Sector: Healthtech</p>
                <span className="w-px h-3 bg-[rgba(255,255,255,0.05)]" />
                <p className="text-xs text-[rgba(255,255,255,0.4)]">Status: <span className="text-[#00FFA3]">Approved</span></p>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-center gap-1">
            <span className="text-[10px] text-[rgba(255,255,255,0.2)] tracking-wider font-semibold font-mono uppercase">TrustScore</span>
            <div className="relative">
              <span className={`text-4xl font-bold tracking-tight ${getScoreColor(trustScore)}`}>
                {trustScore}
              </span>
              <div className={`absolute -inset-4 blur-2xl ${getScoreGlow(trustScore)} opacity-30 rounded-full`} />
            </div>
          </div>
        </AnimatedCard>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          
          <div className="lg:col-span-2 space-y-6">
            
            <AnimatedCard delay={0.2} className="bg-[rgba(10,10,18,0.4)] backdrop-blur-xl border border-[rgba(255,255,255,0.03)] rounded-card p-6 space-y-4 hover:border-[rgba(255,255,255,0.05)] transition-all duration-500">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[rgba(200,164,81,0.05)] border border-[rgba(200,164,81,0.08)] flex items-center justify-center text-[#C8A451]">
                  <IconDocument className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-semibold text-white">TrustScore Breakdown</h3>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {dimensionScores.map((dim, index) => (
                  <motion.div
                    key={dim.name}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-center justify-between p-3 bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.03)] rounded-card"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full bg-[${dim.color}05] border border-[${dim.color}08] flex items-center justify-center text-[${dim.color}]`}>
                        {dim.icon}
                      </div>
                      <span className="text-sm font-medium text-white">{dim.name}</span>
                    </div>
                    <span className={`text-lg font-bold ${getScoreColor(dim.score)}`}>{dim.score}</span>
                  </motion.div>
                ))}
              </div>
            </AnimatedCard>

            <div className="flex gap-1 overflow-x-auto pb-0.5 border-b border-[rgba(255,255,255,0.03)]">
              {[
                { id: "basics", label: "Basics & Identity", icon: IconBuilding },
                { id: "founders", label: "Founders", icon: IconUsers },
                { id: "traction", label: "Traction", icon: IconTrending },
                { id: "funding", label: "Funding", icon: IconDocument },
                { id: "documents", label: "Documents", icon: IconDocument }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-4 py-2.5 text-xs font-medium transition-all duration-300 border-b-2 ${
                    activeTab === tab.id
                      ? "border-[#00E5FF] text-white"
                      : "border-transparent text-[rgba(255,255,255,0.3)] hover:text-white"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <tab.icon className="w-4 h-4" />
                    {tab.label}
                  </span>
                </button>
              ))}
            </div>

            {activeTab === "basics" && (
              <AnimatedCard delay={0.2} className="bg-[rgba(10,10,18,0.4)] backdrop-blur-xl border border-[rgba(255,255,255,0.03)] rounded-card p-6 space-y-4 hover:border-[rgba(255,255,255,0.05)] transition-all duration-500">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="p-3 bg-[rgba(255,255,255,0.02)] rounded-card border border-[rgba(255,255,255,0.02)]">
                    <p className="text-[rgba(255,255,255,0.3)] font-medium">Company Name</p>
                    <p className="text-white font-medium mt-1">Apex Biosensors Pvt Ltd</p>
                  </div>
                  <div className="p-3 bg-[rgba(255,255,255,0.02)] rounded-card border border-[rgba(255,255,255,0.02)]">
                    <p className="text-[rgba(255,255,255,0.3)] font-medium">CIN</p>
                    <p className="text-white font-medium mt-1 font-mono">U72900KA2021PTC145678</p>
                  </div>
                  <div className="p-3 bg-[rgba(255,255,255,0.02)] rounded-card border border-[rgba(255,255,255,0.02)]">
                    <p className="text-[rgba(255,255,255,0.3)] font-medium">Legal Status</p>
                    <p className="text-white font-medium mt-1 capitalize">Pvt Ltd</p>
                  </div>
                  <div className="p-3 bg-[rgba(255,255,255,0.02)] rounded-card border border-[rgba(255,255,255,0.02)]">
                    <p className="text-[rgba(255,255,255,0.3)] font-medium">Founded</p>
                    <p className="text-white font-medium mt-1">2021</p>
                  </div>
                  <div className="sm:col-span-2 p-3 bg-[rgba(255,255,255,0.02)] rounded-card border border-[rgba(255,255,255,0.02)]">
                    <p className="text-[rgba(255,255,255,0.3)] font-medium">Description</p>
                    <p className="text-white font-medium mt-1 leading-relaxed">Continuous glucose monitoring using non-invasive infrared spectroscopy.</p>
                  </div>
                </div>
              </AnimatedCard>
            )}

          </div>

          <div className="space-y-6 lg:sticky lg:top-24">
            
            <AnimatedCard delay={0.3} className="bg-[rgba(10,10,18,0.6)] backdrop-blur-xl border border-[rgba(255,255,255,0.05)] rounded-card p-6 space-y-6 hover:border-[rgba(255,255,255,0.08)] transition-all duration-500">
              <div className="flex flex-col items-center gap-4">
                <div className="relative w-40 h-40">
                  <svg className="w-full h-full -rotate-90">
                    <circle
                      cx="80"
                      cy="80"
                      r="54"
                      fill="none"
                      stroke="rgba(255,255,255,0.03)"
                      strokeWidth="12"
                    />
                    <circle
                      cx="80"
                      cy="80"
                      r="54"
                      fill="none"
                      stroke={trustScore >= 80 ? "#00FFA3" : trustScore >= 60 ? "#00E5FF" : trustScore >= 40 ? "#C8A451" : "#7000FF"}
                      strokeWidth="12"
                      strokeLinecap="round"
                      strokeDasharray={`${2 * Math.PI * 54}`}
                      strokeDashoffset={getScoreRing(trustScore)}
                      className="transition-all duration-1000"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className={`text-4xl font-bold ${getScoreColor(trustScore)}`}>{trustScore}</span>
                    <span className="text-[10px] text-[rgba(255,255,255,0.2)] font-mono uppercase">TrustScore</span>
                  </div>
                </div>
                <div className="text-center">
                  <VerificationBadge tier="investor-backed" />
                  <p className="text-xs text-[rgba(255,255,255,0.3)] mt-2">Investor-backed verification</p>
                </div>
              </div>

              <div className="border-t border-[rgba(255,255,255,0.03)] pt-4 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[rgba(255,255,255,0.3)]">Verification Level</span>
                  <span className="text-white font-medium">Level 5</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[rgba(255,255,255,0.3)]">Data Points</span>
                  <span className="text-white font-medium">247</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[rgba(255,255,255,0.3)]">Last Updated</span>
                  <span className="text-white font-medium">2 hours ago</span>
                </div>
              </div>
            </AnimatedCard>

          </div>

        </div>

      </main>

      <Footer />
    </div>
  );
}