"use client";

import React, { useEffect, useState, useRef } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import StartupCard from "@/components/StartupCard";
import { StartupCardData, BadgeTier } from "@/types/startup";
import { createClient } from "@/lib/supabase/client";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { PerspectiveCamera, Float, Sparkles, Torus, MeshDistortMaterial } from "@react-three/drei";
import * as THREE from "three";
import { motion } from "framer-motion";

const DirectoryScene = () => {
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
      <mesh ref={meshRef} scale={2.0}>
        <octahedronGeometry args={[1, 0]} />
        <MeshDistortMaterial
          color="#00E5FF"
          metalness={0.9}
          roughness={0.05}
          clearcoat={1}
          clearcoatRoughness={0.05}
          transparent
          opacity={0.08}
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
  const count = 120;
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
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} args={[positions, 3]} />
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
      <Torus args={[2.8, 0.015, 16, 100]} rotation={[Math.PI / 2, 0, 0]}>
        <meshPhysicalMaterial color="#7000FF" emissive="#7000FF" emissiveIntensity={0.08} transparent opacity={0.08} metalness={0.8} roughness={0.2} />
      </Torus>
      <Torus args={[3.2, 0.01, 16, 100]} rotation={[Math.PI / 3, 0.15, 0]}>
        <meshPhysicalMaterial color="#00FFA3" emissive="#00FFA3" emissiveIntensity={0.06} transparent opacity={0.05} metalness={0.8} roughness={0.2} />
      </Torus>
    </group>
  );
};

const DirectoryBackground = () => {
  return (
    <div className="fixed inset-0 -z-10 pointer-events-none">
      <Canvas style={{ background: "#030305" }} dpr={[1, 2]}>
        <PerspectiveCamera makeDefault position={[0, 0, 8]} fov={45} />
        <ambientLight intensity={0.2} color="#00E5FF" />
        <directionalLight position={[5, 5, 5]} intensity={0.4} color="#7000FF" />
        <directionalLight position={[-5, -2, 5]} intensity={0.2} color="#00E5FF" />
        <pointLight position={[0, 0, 3]} intensity={0.3} color="#00FFA3" />
        <BackgroundParticles />
        <RingSystem />
        <DirectoryScene />
        <Sparkles count={80} scale={[10, 10, 10]} size={0.015} speed={0.2} color="#00E5FF" opacity={0.15} />
        <Sparkles count={40} scale={[10, 10, 10]} size={0.01} speed={0.15} color="#7000FF" opacity={0.1} />
      </Canvas>
    </div>
  );
};

const IconSearch = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

const IconGrid = ({ className = "w-12 h-12" }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
  </svg>
);

const IconFilter = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" />
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
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: [0.23, 1, 0.32, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

interface CompanyDbRow {
  id: string;
  name: string;
  description: string | null;
  sector: string | null;
  stage: string | null;
  founded_date: string | null;
  investors: any[] | null;
  trust_score: number | null;
  verification: Record<string, string> | null;
  show_score: boolean;
}

export default function DirectoryPage() {
  const supabase = createClient();
  const [companies, setCompanies] = useState<CompanyDbRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSector, setSelectedSector] = useState("");
  const [selectedStage, setSelectedStage] = useState("");

  useEffect(() => {
    async function fetchApprovedCompanies() {
      try {
        const { data, error } = await supabase
          .from("companies")
          .select("id, name, description, sector, stage, founded_date, investors, trust_score, verification, show_score")
          .eq("status", "approved");

        if (error) {
          setErrorMsg(error.message);
        } else {
          setCompanies(data || []);
        }
      } catch (err: any) {
        setErrorMsg(err.message || "Failed to load directory data.");
      } finally {
        setLoading(false);
      }
    }

    fetchApprovedCompanies();
  }, [supabase]);

  const filteredCompanies = companies.filter((company) => {
    const nameText = company.name || "";
    const descText = company.description || "";
    
    const matchesSearch =
      nameText.toLowerCase().includes(searchQuery.toLowerCase()) ||
      descText.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesSector =
      !selectedSector ||
      (company.sector || "").toLowerCase() === selectedSector.toLowerCase();

    const matchesStage =
      !selectedStage ||
      (company.stage || "").toLowerCase() === selectedStage.toLowerCase();

    return matchesSearch && matchesSector && matchesStage;
  });

  const availableSectors = Array.from(
    new Set(
      companies
        .map((c) => c.sector)
        .filter((sector): sector is string => !!sector)
    )
  ).sort();

  const availableStages = Array.from(
    new Set(
      companies
        .map((c) => c.stage)
        .filter((stage): stage is string => !!stage)
    )
  ).sort();

  const mapToCardData = (company: CompanyDbRow): StartupCardData => {
    return {
      id: company.id,
      name: company.name,
      logoUrl: "",
      description: company.description || "",
      sector: company.sector || "",
      stage: company.stage || "",
      location: "India",
      foundedYear: company.founded_date ? new Date(company.founded_date).getFullYear() : 2026,
      investorCount: (company.investors || []).length,
      fundingRound: (company.investors || [])[0]?.round || company.stage || "Pre-Seed",
      trustScore: company.trust_score !== null ? company.trust_score : 0,
      badgeTier: (company.verification?.cin || "self-reported") as BadgeTier,
      showScore: company.show_score,
    };
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#030305] overflow-x-hidden">
      <DirectoryBackground />
      <div className="fixed inset-0 -z-5 bg-gradient-to-b from-[#030305]/40 via-transparent to-[#030305]/80 pointer-events-none" />

      <Navbar />

      <main className="relative z-10 flex-1 w-full max-w-[1200px] mx-auto px-4 md:px-6 py-12 flex flex-col gap-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col gap-3"
        >
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[rgba(0,229,255,0.05)] border border-[rgba(0,229,255,0.1)] rounded-full text-[11px] font-medium text-[#00E5FF] select-none tracking-tight w-fit">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00E5FF] animate-pulse" />
            Discover Startups
          </div>
          <h1 className="text-3xl font-medium tracking-tight text-white">
            Startup Directory
          </h1>
          <p className="text-sm text-[rgba(255,255,255,0.4)] max-w-2xl leading-relaxed">
            Explore verified early-stage startups. Discover details about sector, staging, funding rounds, and their computed TrustScore credibility rating.
          </p>
        </motion.div>

        {errorMsg && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[rgba(255,68,68,0.05)] border border-[rgba(255,68,68,0.15)] text-[#FF4444] text-xs p-4 rounded-card"
          >
            <p className="font-semibold">Error Loading Directory</p>
            <p className="mt-1 font-normal text-[rgba(255,255,255,0.4)]">{errorMsg}</p>
          </motion.div>
        )}

        <AnimatedCard className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center w-full bg-[rgba(10,10,18,0.4)] backdrop-blur-xl border border-[rgba(255,255,255,0.03)] rounded-card p-4 hover:border-[rgba(255,255,255,0.05)] transition-all duration-500">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search startups..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-9 border border-[rgba(255,255,255,0.05)] bg-[rgba(10,10,18,0.4)] text-white rounded-button pl-9 pr-3 text-sm placeholder:text-[rgba(255,255,255,0.2)] focus:outline-hidden focus:ring-1 focus:ring-[#00E5FF] focus:border-[#00E5FF] transition-all duration-300 hover:border-[rgba(255,255,255,0.1)]"
            />
            <IconSearch className="absolute left-3 top-2.5 w-4 h-4 text-[rgba(255,255,255,0.15)]" />
          </div>

          <select
            value={selectedSector}
            onChange={(e) => setSelectedSector(e.target.value)}
            className="h-9 border border-[rgba(255,255,255,0.05)] bg-[rgba(10,10,18,0.4)] text-white rounded-button px-3 text-sm focus:outline-hidden focus:ring-1 focus:ring-[#00E5FF] focus:border-[#00E5FF] transition-all duration-300 hover:border-[rgba(255,255,255,0.1)] cursor-pointer"
          >
            <option value="" className="bg-[#030305]">Sector (All)</option>
            {availableSectors.length > 0 ? (
              availableSectors.map((sec) => (
                <option key={sec} value={sec} className="bg-[#030305]">{sec}</option>
              ))
            ) : (
              <>
                <option value="healthtech" className="bg-[#030305]">Healthtech</option>
                <option value="logistics" className="bg-[#030305]">Logistics</option>
                <option value="climate" className="bg-[#030305]">Climate</option>
                <option value="energy" className="bg-[#030305]">Energy</option>
                <option value="cybersecurity" className="bg-[#030305]">Cybersecurity</option>
                <option value="agtech" className="bg-[#030305]">Agtech</option>
                <option value="fintech" className="bg-[#030305]">Fintech</option>
                <option value="deeptech" className="bg-[#030305]">Deeptech</option>
                <option value="ai" className="bg-[#030305]">AI</option>
              </>
            )}
          </select>

          <select
            value={selectedStage}
            onChange={(e) => setSelectedStage(e.target.value)}
            className="h-9 border border-[rgba(255,255,255,0.05)] bg-[rgba(10,10,18,0.4)] text-white rounded-button px-3 text-sm focus:outline-hidden focus:ring-1 focus:ring-[#00E5FF] focus:border-[#00E5FF] transition-all duration-300 hover:border-[rgba(255,255,255,0.1)] cursor-pointer"
          >
            <option value="" className="bg-[#030305]">Stage (All)</option>
            {availableStages.length > 0 ? (
              availableStages.map((stg) => (
                <option key={stg} value={stg} className="bg-[#030305]">{stg}</option>
              ))
            ) : (
              <>
                <option value="idea" className="bg-[#030305]">Idea</option>
                <option value="mvp" className="bg-[#030305]">MVP</option>
                <option value="revenue" className="bg-[#030305]">Revenue</option>
                <option value="scaling" className="bg-[#030305]">Scaling</option>
              </>
            )}
          </select>
        </AnimatedCard>

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="relative">
              <div className="w-12 h-12 border-2 border-[#00E5FF] border-t-transparent rounded-full animate-spin" />
              <div className="absolute inset-0 w-12 h-12 border-2 border-[#7000FF] border-b-transparent rounded-full animate-spin" style={{ animationDirection: "reverse", animationDuration: "1.5s" }} />
            </div>
          </div>
        ) : companies.length === 0 ? (
          <AnimatedCard>
            <div className="bg-[rgba(10,10,18,0.4)] backdrop-blur-xl border border-[rgba(255,255,255,0.03)] rounded-card p-12 text-center hover:border-[rgba(255,255,255,0.05)] transition-all duration-500">
              <IconGrid className="w-12 h-12 text-[rgba(255,255,255,0.05)] mx-auto" />
              <h3 className="text-base font-semibold text-white mt-4">No startups are currently in the directory</h3>
              <p className="text-xs text-[rgba(255,255,255,0.3)] mt-1">Startups will appear here once their submissions are approved by our review team.</p>
            </div>
          </AnimatedCard>
        ) : filteredCompanies.length === 0 ? (
          <AnimatedCard>
            <div className="bg-[rgba(10,10,18,0.4)] backdrop-blur-xl border border-[rgba(255,255,255,0.03)] rounded-card p-12 text-center hover:border-[rgba(255,255,255,0.05)] transition-all duration-500">
              <IconSearch className="w-12 h-12 text-[rgba(255,255,255,0.05)] mx-auto" />
              <h3 className="text-base font-semibold text-white mt-4">No startups found matching your filters</h3>
              <p className="text-xs text-[rgba(255,255,255,0.3)] mt-1">Try resetting your sector, stage, or typing a different search term.</p>
            </div>
          </AnimatedCard>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCompanies.map((company, index) => (
              <AnimatedCard key={company.id} delay={index * 0.03}>
                <StartupCard startup={mapToCardData(company)} />
              </AnimatedCard>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}