"use client";

import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { createClient } from "@/lib/supabase/client";
import { BadgeTier } from "@/types/startup";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { PerspectiveCamera, Float, Sphere, Ring, Torus, MeshDistortMaterial } from "@react-three/drei";
import * as THREE from "three";
import { motion, AnimatePresence } from "framer-motion";

const BackgroundScene = () => {
  const particlesRef = useRef<THREE.Points>(null!);
  const count = 150;
  const positions = new Float32Array(count * 3);

  useEffect(() => {
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 12;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 12;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 12;
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
<<<<<<< HEAD
      <bufferAttribute attach="attributes-position" args={[positions, 3]} />
=======
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
>>>>>>> 26d8fc9a3ab69e9c55514a8fadf62e1a863b6057
      </bufferGeometry>
      <pointsMaterial size={0.02} transparent opacity={0.3} color="#00E5FF" sizeAttenuation />
    </points>
  );
};

const AdminScene = ({ score }: { score: number | null }) => {
  const meshRef = useRef<THREE.Mesh>(null!);
  const { mouse } = useThree();
  const scoreValue = score || 0;

  useFrame((state) => {
    if (meshRef.current) {
      const x = (mouse.x - 0) * 0.2;
      const y = (mouse.y - 0) * 0.1;
      meshRef.current.rotation.x += (y - meshRef.current.rotation.x) * 0.02;
      meshRef.current.rotation.y += (x - meshRef.current.rotation.y) * 0.02;
      const time = state.clock.getElapsedTime();
      meshRef.current.position.y = Math.sin(time * 0.3) * 0.1;
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
    <group>
      <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5}>
        <mesh ref={meshRef} scale={1.8}>
          <icosahedronGeometry args={[1, 1]} />
          <MeshDistortMaterial
            color={color}
            metalness={0.9}
            roughness={0.05}
            clearcoat={1}
            clearcoatRoughness={0.05}
            transparent
            opacity={0.85}
            distort={0.3}
            speed={0.5}
            emissive={color}
            emissiveIntensity={0.2}
          />
        </mesh>
      </Float>
      <Ring args={[1.8, 2.0, 64]} rotation={[Math.PI / 2, 0, 0]}>
        <meshPhysicalMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.1}
          transparent
          opacity={0.2}
          metalness={0.8}
          roughness={0.2}
        />
      </Ring>
      <Ring args={[2.2, 2.4, 64]} rotation={[Math.PI / 3, 0.2, 0]}>
        <meshPhysicalMaterial
          color="#7000FF"
          emissive="#7000FF"
          emissiveIntensity={0.05}
          transparent
          opacity={0.1}
          metalness={0.8}
          roughness={0.2}
        />
      </Ring>
      <Sphere args={[0.05, 8, 8]} position={[2.2, 0, 0]}>
        <meshPhysicalMaterial color="#00E5FF" emissive="#00E5FF" emissiveIntensity={1} />
      </Sphere>
      <Sphere args={[0.05, 8, 8]} position={[-2.2, 0, 0]}>
        <meshPhysicalMaterial color="#7000FF" emissive="#7000FF" emissiveIntensity={1} />
      </Sphere>
      <Sphere args={[0.05, 8, 8]} position={[0, 2.2, 0]}>
        <meshPhysicalMaterial color="#00FFA3" emissive="#00FFA3" emissiveIntensity={1} />
      </Sphere>
      <Sphere args={[0.05, 8, 8]} position={[0, -2.2, 0]}>
        <meshPhysicalMaterial color="#C8A451" emissive="#C8A451" emissiveIntensity={1} />
      </Sphere>
    </group>
  );
};

const IconArrowLeft = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
  </svg>
);

const IconCheck = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const IconX = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
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
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
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
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: [0.23, 1, 0.32, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

interface FounderEntry {
  name: string;
  linkedin: string;
}

interface InvestorEntry {
  name: string;
  amount: number;
  currency: string;
  round: string;
  date: string;
}

interface Company {
  id: string;
  owner_id: string;
  name: string;
  cin: string;
  legal_status: string;
  founded_date: string;
  sector: string;
  description: string;
  website: string | null;
  stage: string;
  revenue: number | null;
  revenue_currency: string;
  active_users: number | null;
  growth_rate: string | null;
  currently_raising: string;
  externally_funded: boolean;
  incubator: boolean;
  team_size: number | null;
  show_score: boolean;
  founders: FounderEntry[];
  incubators: string[];
  investors: InvestorEntry[];
  coi_filename: string | null;
  financials_filename: string | null;
  pitch_deck_filename: string | null;
  cap_table_filename: string | null;
  status: "pending" | "under_review" | "approved" | "rejected";
  trust_score: number | null;
  verification: Record<string, BadgeTier> | null;
  created_at: string;
}

export default function AdminReviewDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const supabase = createClient();

  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [company, setCompany] = useState<Company | null>(null);

  const [cinTier, setCinTier] = useState<BadgeTier>("self-reported");
  const [revenueTier, setRevenueTier] = useState<BadgeTier>("self-reported");
  const [foundersTier, setFoundersTier] = useState<BadgeTier>("self-reported");
  const [incubatorTier, setIncubatorTier] = useState<BadgeTier>("self-reported");
  const [fundingTier, setFundingTier] = useState<BadgeTier>("self-reported");
  const [scoreInput, setScoreInput] = useState<string>("");

  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState("");

  const [activeTab, setActiveTab] = useState<"basics" | "founders" | "traction" | "funding" | "documents">("basics");

  useEffect(() => {
    async function checkAdminAndFetch() {
      try {
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError || !user) {
          router.push("/auth?mode=signin");
          return;
        }

        const { data: isUserAdmin, error: rpcError } = await supabase.rpc("is_admin");
        if (rpcError || !isUserAdmin) {
          router.push("/dashboard");
          return;
        }

        setIsAdmin(true);

        const { data, error: companyError } = await supabase
          .from("companies")
          .select("*")
          .eq("id", id)
          .single();

        if (companyError || !data) {
          setSubmitError("Company profile not found.");
        } else {
          const fetchedCompany = data as Company;
          setCompany(fetchedCompany);

          const verificationObj = fetchedCompany.verification || {};
          setCinTier(verificationObj.cin || "self-reported");
          setRevenueTier(verificationObj.revenue || "self-reported");
          setFoundersTier(verificationObj.founders || "self-reported");
          setIncubatorTier(verificationObj.incubator || "self-reported");
          setFundingTier(verificationObj.funding || "self-reported");

          if (fetchedCompany.trust_score !== null) {
            setScoreInput(Math.round(fetchedCompany.trust_score * 100).toString());
          }
        }
      } catch (err: any) {
        setSubmitError(err.message || "An unexpected error occurred during page load.");
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      checkAdminAndFetch();
    }
  }, [id, router, supabase]);

  const handleAction = async (nextStatus: "approved" | "rejected" | "under_review") => {
    setSubmitting(true);
    setSubmitError("");
    setSubmitSuccess("");

    try {
      let finalScore: number | null = null;

      if (nextStatus === "approved") {
        if (!scoreInput.trim()) {
          throw new Error("A TrustScore is required to approve a company.");
        }
      }

      if (scoreInput.trim()) {
        const parsed = parseInt(scoreInput, 10);
        if (isNaN(parsed) || parsed < 0 || parsed > 100 || scoreInput.includes(".")) {
          throw new Error("TrustScore must be a whole number between 0 and 100.");
        }
        finalScore = parsed / 100;
      }

      if (nextStatus === "rejected") {
        finalScore = null;
      }

      const verificationPayload = {
        cin: cinTier,
        revenue: revenueTier,
        founders: foundersTier,
        incubator: incubatorTier,
        funding: fundingTier
      };

      const { error } = await supabase
        .from("companies")
        .update({
          status: nextStatus,
          trust_score: finalScore,
          verification: verificationPayload
        })
        .eq("id", id);

      if (error) {
        throw new Error(error.message);
      }

      setSubmitSuccess(`Startup has been successfully marked as ${nextStatus.replace("_", " ")}.`);

      if (company) {
        setCompany({
          ...company,
          status: nextStatus,
          trust_score: finalScore,
          verification: verificationPayload
        });
      }

      if (nextStatus === "approved" || nextStatus === "rejected") {
        setTimeout(() => {
          router.push("/admin");
        }, 1500);
      }
    } catch (err: any) {
      setSubmitError(err.message || "Failed to submit review.");
    } finally {
      setSubmitting(false);
    }
  };

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: currency,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case "approved": return "text-[#00FFA3]";
      case "rejected": return "text-[#FF4444]";
      case "under_review": return "text-[#C8A451]";
      default: return "text-[rgba(255,255,255,0.4)]";
    }
  };

  const getScoreColor = (score: number | null) => {
    if (!score) return "text-[rgba(255,255,255,0.4)]";
    if (score >= 0.8) return "text-[#00FFA3]";
    if (score >= 0.6) return "text-[#00E5FF]";
    if (score >= 0.4) return "text-[#C8A451]";
    return "text-[#7000FF]";
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-[#030305] text-white">
        <Navbar />
        <main className="flex-1 flex items-center justify-center p-6">
          <div className="relative">
            <div className="w-12 h-12 border-2 border-[#00E5FF] border-t-transparent rounded-full animate-spin" />
            <div className="absolute inset-0 w-12 h-12 border-2 border-[#7000FF] border-b-transparent rounded-full animate-spin" style={{ animationDirection: "reverse", animationDuration: "1.5s" }} />
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!isAdmin) return null;

  if (!company) {
    return (
      <div className="min-h-screen flex flex-col bg-[#030305] text-white">
        <Navbar />
        <main className="flex-1 max-w-[1100px] mx-auto px-4 md:px-6 py-12 text-center">
          <div className="bg-[rgba(10,10,18,0.6)] backdrop-blur-xl border border-[rgba(255,255,255,0.05)] rounded-card p-12">
            <h2 className="text-xl font-medium text-white">Startup profile not found or is unavailable</h2>
            <Link href="/admin" className="text-sm text-[#00E5FF] hover:text-[#00E5FF]/80 mt-4 inline-flex items-center gap-2 transition-colors">
              <IconArrowLeft className="w-4 h-4" />
              Back to Review Queue
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const foundedYear = company.founded_date ? new Date(company.founded_date).getFullYear() : "N/A";
  const allowedTiers: { value: BadgeTier; label: string }[] = [
    { value: "self-reported", label: "Self-reported" },
    { value: "ai-extracted", label: "AI-extracted" },
    { value: "document-backed", label: "Document-backed" },
    { value: "investor-backed", label: "Investor-backed" }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#030305] text-white overflow-x-hidden">
      <div className="fixed inset-0 -z-10 pointer-events-none">
        <Canvas style={{ background: "#030305" }} dpr={[1, 2]}>
          <PerspectiveCamera makeDefault position={[0, 0, 6]} fov={50} />
          <ambientLight intensity={0.3} color="#00E5FF" />
          <directionalLight position={[5, 5, 5]} intensity={0.8} color="#7000FF" />
          <directionalLight position={[-5, -2, 5]} intensity={0.5} color="#00E5FF" />
          <pointLight position={[0, 0, 3]} intensity={1} color="#00FFA3" />
          <BackgroundScene />
          <AdminScene score={company.trust_score} />
        </Canvas>
      </div>

      <div className="fixed inset-0 -z-5 bg-gradient-to-b from-[#030305]/60 via-transparent to-[#030305]/80 pointer-events-none" />

      <Navbar />

      <main className="relative z-10 flex-1 w-full max-w-[1200px] mx-auto px-4 md:px-6 py-8 flex flex-col gap-6">

        <AnimatedSection className="flex items-center gap-3">
          <Link
            href="/admin"
            className="text-xs font-semibold text-[#00E5FF] hover:text-[#00E5FF]/80 transition-colors flex items-center gap-1 group"
          >
            <IconArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            Back to Review Queue
          </Link>
        </AnimatedSection>

        <AnimatePresence>
          {submitError && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-[rgba(255,68,68,0.05)] border border-[rgba(255,68,68,0.15)] text-[#FF4444] text-xs p-4 rounded-card backdrop-blur-xl"
            >
              <p className="font-semibold flex items-center gap-2">
                <IconX className="w-4 h-4" />
                Review Failed
              </p>
              <p className="mt-0.5">{submitError}</p>
            </motion.div>
          )}
          {submitSuccess && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-[rgba(0,255,163,0.05)] border border-[rgba(0,255,163,0.15)] text-[#00FFA3] text-xs p-4 rounded-card backdrop-blur-xl"
            >
              <p className="font-semibold flex items-center gap-2">
                <IconCheck className="w-4 h-4" />
                Review Saved
              </p>
              <p className="mt-0.5">{submitSuccess}</p>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatedCard delay={0.1} className="bg-[rgba(10,10,18,0.6)] backdrop-blur-xl border border-[rgba(255,255,255,0.05)] rounded-card p-6 flex flex-col sm:flex-row justify-between sm:items-center gap-4 group hover:border-[rgba(0,229,255,0.1)] transition-all duration-500">
          <div className="flex items-center gap-4">
            <div className="relative w-14 h-14 rounded-xl border border-[rgba(255,255,255,0.05)] bg-[rgba(10,10,18,0.4)] flex items-center justify-center font-semibold text-[#00E5FF] select-none group-hover:border-[rgba(0,229,255,0.2)] transition-all duration-500">
              <span className="text-lg">{company.name.slice(0, 2).toUpperCase()}</span>
              <div className="absolute inset-0 bg-gradient-to-br from-[#00E5FF]/5 to-[#7000FF]/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </div>
            <div>
              <h1 className="text-xl font-medium tracking-tight text-white">{company.name}</h1>
              <div className="flex items-center gap-3 mt-1">
                <p className="text-xs text-[rgba(255,255,255,0.4)] capitalize">Sector: {company.sector}</p>
                <span className="w-px h-3 bg-[rgba(255,255,255,0.05)]" />
                <p className={`text-xs capitalize font-medium ${getStatusColor(company.status)}`}>
                  {company.status.replace("_", " ")}
                </p>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-start sm:items-end">
            <span className="text-[10px] text-[rgba(255,255,255,0.3)] tracking-wider font-semibold font-mono uppercase">TrustScore</span>
            <span className={`text-2xl font-medium tracking-tight mt-0.5 ${getScoreColor(company.trust_score)}`}>
              {company.trust_score !== null ? Math.round(company.trust_score * 100) : "—"}
            </span>
          </div>
        </AnimatedCard>

        <div className="flex gap-1 overflow-x-auto pb-0.5 border-b border-[rgba(255,255,255,0.05)]">
          {[
            { id: "basics", label: "Basics & Identity", icon: IconBuilding },
            { id: "founders", label: "Founders", icon: IconUsers },
            { id: "traction", label: "Traction", icon: IconTrending },
            { id: "funding", label: "Funding", icon: IconDocument },
            { id: "documents", label: "Documents", icon: IconDocument }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as "basics" | "founders" | "traction" | "funding" | "documents")}
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">

          <div className="lg:col-span-2 space-y-6">

            {activeTab === "basics" && (
              <AnimatedCard delay={0.2} className="bg-[rgba(10,10,18,0.4)] backdrop-blur-xl border border-[rgba(255,255,255,0.03)] rounded-card p-6 space-y-4 hover:border-[rgba(255,255,255,0.05)] transition-all duration-500">
                <h3 className="text-sm font-semibold text-white border-b border-[rgba(255,255,255,0.03)] pb-3 flex items-center gap-2">
                  <IconBuilding className="w-4 h-4 text-[#00E5FF]" />
                  Basics & Identity
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="p-3 bg-[rgba(255,255,255,0.02)] rounded-card border border-[rgba(255,255,255,0.02)]">
                    <p className="text-[rgba(255,255,255,0.3)] font-medium">Corporate Identity Number (CIN)</p>
                    <p className="text-white font-medium mt-1 font-mono">{company.cin || "N/A"}</p>
                  </div>
                  <div className="p-3 bg-[rgba(255,255,255,0.02)] rounded-card border border-[rgba(255,255,255,0.02)]">
                    <p className="text-[rgba(255,255,255,0.3)] font-medium">Legal Status</p>
                    <p className="text-white font-medium mt-1 capitalize">{company.legal_status || "N/A"}</p>
                  </div>
                  <div className="p-3 bg-[rgba(255,255,255,0.02)] rounded-card border border-[rgba(255,255,255,0.02)]">
                    <p className="text-[rgba(255,255,255,0.3)] font-medium">Founded Year</p>
                    <p className="text-white font-medium mt-1">{foundedYear}</p>
                  </div>
                  <div className="p-3 bg-[rgba(255,255,255,0.02)] rounded-card border border-[rgba(255,255,255,0.02)]">
                    <p className="text-[rgba(255,255,255,0.3)] font-medium">Website</p>
                    <p className="text-white font-medium mt-1">
                      {company.website ? (
                        <a href={company.website} target="_blank" rel="noreferrer" className="text-[#00E5FF] hover:underline">
                          {company.website}
                        </a>
                      ) : "None"}
                    </p>
                  </div>
                  <div className="sm:col-span-2 p-3 bg-[rgba(255,255,255,0.02)] rounded-card border border-[rgba(255,255,255,0.02)]">
                    <p className="text-[rgba(255,255,255,0.3)] font-medium">Description</p>
                    <p className="text-white font-medium mt-1 leading-relaxed">{company.description || "No description provided."}</p>
                  </div>
                </div>
              </AnimatedCard>
            )}

            {activeTab === "founders" && (
              <AnimatedCard delay={0.2} className="bg-[rgba(10,10,18,0.4)] backdrop-blur-xl border border-[rgba(255,255,255,0.03)] rounded-card p-6 space-y-4 hover:border-[rgba(255,255,255,0.05)] transition-all duration-500">
                <h3 className="text-sm font-semibold text-white border-b border-[rgba(255,255,255,0.03)] pb-3 flex items-center gap-2">
                  <IconUsers className="w-4 h-4 text-[#7000FF]" />
                  Founders & Leadership
                </h3>
                <div className="space-y-3">
                  <div className="p-3 bg-[rgba(255,255,255,0.02)] rounded-card border border-[rgba(255,255,255,0.02)]">
                    <p className="text-[rgba(255,255,255,0.3)] font-medium">Team Size</p>
                    <p className="text-white font-medium mt-1">{company.team_size || "Not stated"}</p>
                  </div>
                  {company.founders && company.founders.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
                      {company.founders.map((founder, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: i * 0.05 }}
                          className="bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.03)] rounded-card p-3 flex justify-between items-center text-xs"
                        >
                          <span className="font-medium text-white">{founder.name}</span>
                          {founder.linkedin && (
                            <a href={founder.linkedin} target="_blank" rel="noreferrer" className="text-[#00E5FF] hover:underline font-medium">
                              LinkedIn
                            </a>
                          )}
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-[rgba(255,255,255,0.4)]">No founder listings provided.</p>
                  )}
                </div>
              </AnimatedCard>
            )}

            {activeTab === "traction" && (
              <AnimatedCard delay={0.2} className="bg-[rgba(10,10,18,0.4)] backdrop-blur-xl border border-[rgba(255,255,255,0.03)] rounded-card p-6 space-y-4 hover:border-[rgba(255,255,255,0.05)] transition-all duration-500">
                <h3 className="text-sm font-semibold text-white border-b border-[rgba(255,255,255,0.03)] pb-3 flex items-center gap-2">
                  <IconTrending className="w-4 h-4 text-[#00FFA3]" />
                  Stage & Financial Traction
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="p-3 bg-[rgba(255,255,255,0.02)] rounded-card border border-[rgba(255,255,255,0.02)]">
                    <p className="text-[rgba(255,255,255,0.3)] font-medium">Current Stage</p>
                    <p className="text-white font-medium mt-1 capitalize">{company.stage || "N/A"}</p>
                  </div>
                  <div className="p-3 bg-[rgba(255,255,255,0.02)] rounded-card border border-[rgba(255,255,255,0.02)]">
                    <p className="text-[rgba(255,255,255,0.3)] font-medium">Revenue</p>
                    <p className="text-white font-medium mt-1">
                      {company.revenue ? formatCurrency(company.revenue, company.revenue_currency || "INR") : "Self-reported: Zero / Undisclosed"}
                    </p>
                  </div>
                  <div className="p-3 bg-[rgba(255,255,255,0.02)] rounded-card border border-[rgba(255,255,255,0.02)]">
                    <p className="text-[rgba(255,255,255,0.3)] font-medium">Active Users</p>
                    <p className="text-white font-medium mt-1">{company.active_users ? company.active_users.toLocaleString() : "Not stated"}</p>
                  </div>
                  <div className="p-3 bg-[rgba(255,255,255,0.02)] rounded-card border border-[rgba(255,255,255,0.02)]">
                    <p className="text-[rgba(255,255,255,0.3)] font-medium">Growth Rate</p>
                    <p className="text-white font-medium mt-1">{company.growth_rate || "N/A"}</p>
                  </div>
                </div>
              </AnimatedCard>
            )}

            {activeTab === "funding" && (
              <AnimatedCard delay={0.2} className="bg-[rgba(10,10,18,0.4)] backdrop-blur-xl border border-[rgba(255,255,255,0.03)] rounded-card p-6 space-y-4 hover:border-[rgba(255,255,255,0.05)] transition-all duration-500">
                <h3 className="text-sm font-semibold text-white border-b border-[rgba(255,255,255,0.03)] pb-3 flex items-center gap-2">
                  <IconDocument className="w-4 h-4 text-[#C8A451]" />
                  Endorsements & Capital
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs mb-2">
                  <div className="p-3 bg-[rgba(255,255,255,0.02)] rounded-card border border-[rgba(255,255,255,0.02)]">
                    <p className="text-[rgba(255,255,255,0.3)] font-medium">Incubated Startup?</p>
                    <p className="text-white font-medium mt-1">{company.incubator ? "Yes" : "No"}</p>
                  </div>
                  <div className="p-3 bg-[rgba(255,255,255,0.02)] rounded-card border border-[rgba(255,255,255,0.02)]">
                    <p className="text-[rgba(255,255,255,0.3)] font-medium">Currently Raising capital?</p>
                    <p className="text-white font-medium mt-1 capitalize">{company.currently_raising || "N/A"}</p>
                  </div>
                </div>

                {company.incubator && company.incubators && company.incubators.length > 0 && (
                  <div className="text-xs p-3 bg-[rgba(255,255,255,0.02)] rounded-card border border-[rgba(255,255,255,0.02)]">
                    <p className="text-[rgba(255,255,255,0.3)] font-medium mb-1">Affiliated Incubators</p>
                    <div className="flex flex-wrap gap-2">
                      {company.incubators.map((inc, i) => (
                        <span key={i} className="bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.03)] px-2 py-1 rounded-[4px] text-white text-xs">
                          {inc}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {company.externally_funded && company.investors && company.investors.length > 0 ? (
                  <div className="text-xs space-y-2 mt-3">
                    <p className="text-[rgba(255,255,255,0.3)] font-medium border-t border-[rgba(255,255,255,0.03)] pt-3">Capital Contributions & Investors</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {company.investors.map((inv, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.05 }}
                          className="bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.03)] rounded-card p-3 space-y-1"
                        >
                          <p className="font-medium text-white">{inv.name}</p>
                          <p className="text-[rgba(255,255,255,0.4)] text-[11px]">
                            Amount: {formatCurrency(inv.amount, inv.currency)} | Round: {inv.round}
                          </p>
                          <p className="text-[rgba(255,255,255,0.3)] text-[10px]">Date: {new Date(inv.date).toLocaleDateString()}</p>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-xs p-3 bg-[rgba(255,255,255,0.02)] rounded-card border border-[rgba(255,255,255,0.02)]">
                    <p className="text-[rgba(255,255,255,0.3)] font-medium">Externally Funded</p>
                    <p className="text-white font-medium mt-1">{company.externally_funded ? "Yes (no details provided)" : "No"}</p>
                  </div>
                )}
              </AnimatedCard>
            )}

            {activeTab === "documents" && (
              <AnimatedCard delay={0.2} className="bg-[rgba(10,10,18,0.4)] backdrop-blur-xl border border-[rgba(255,255,255,0.03)] rounded-card p-6 space-y-4 hover:border-[rgba(255,255,255,0.05)] transition-all duration-500">
                <h3 className="text-sm font-semibold text-white border-b border-[rgba(255,255,255,0.03)] pb-3 flex items-center gap-2">
                  <IconDocument className="w-4 h-4 text-[#00E5FF]" />
                  Uploaded Documents
                </h3>
                <div className="grid grid-cols-1 gap-3 text-xs text-[rgba(255,255,255,0.4)]">
                  {[
                    { label: "Certificate of Incorporation", value: company.coi_filename },
                    { label: "Financial statements / Revenue Proof", value: company.financials_filename },
                    { label: "Pitch Deck", value: company.pitch_deck_filename },
                    { label: "Cap Table", value: company.cap_table_filename }
                  ].map((doc, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="p-3 bg-[rgba(255,255,255,0.02)] rounded-card border border-[rgba(255,255,255,0.02)] flex items-center justify-between"
                    >
                      <span className="font-semibold text-white">{doc.label}</span>
                      <span className="font-mono text-[rgba(255,255,255,0.3)]">{doc.value || "None provided"}</span>
                    </motion.div>
                  ))}
                </div>
              </AnimatedCard>
            )}

          </div>

          <div className="space-y-6 lg:sticky lg:top-24">

            <AnimatedCard delay={0.3} className="bg-[rgba(10,10,18,0.6)] backdrop-blur-xl border border-[rgba(255,255,255,0.05)] rounded-card p-6 space-y-6 hover:border-[rgba(255,255,255,0.08)] transition-all duration-500">
              <div className="flex flex-col gap-1 border-b border-[rgba(255,255,255,0.03)] pb-3">
                <h3 className="text-sm font-semibold text-white">Admin Review Actions</h3>
                <p className="text-[11px] text-[rgba(255,255,255,0.3)]">Set credibility levels and record the score outcome.</p>
              </div>

              <div className="space-y-4">
                {[
                  { label: "Basics & CIN Verification", value: cinTier, setter: setCinTier },
                  { label: "Traction & Revenue Verification", value: revenueTier, setter: setRevenueTier },
                  { label: "Founders Verification", value: foundersTier, setter: setFoundersTier },
                  { label: "Endorsements & Incubator Verification", value: incubatorTier, setter: setIncubatorTier },
                  { label: "Funding & Investor Verification", value: fundingTier, setter: setFundingTier }
                ].map((field, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 + i * 0.05 }}
                    className="flex flex-col gap-1.5"
                  >
                    <label className="text-xs font-semibold text-white/80">{field.label}</label>
                    <select
                      value={field.value}
                      onChange={(e) => field.setter(e.target.value as BadgeTier)}
                      className="w-full border border-[rgba(255,255,255,0.05)] bg-[rgba(10,10,18,0.6)] text-white rounded-button px-3 py-2 text-xs focus:ring-1 focus:ring-[#00E5FF] focus:outline-hidden transition-all duration-300 hover:border-[rgba(255,255,255,0.1)]"
                    >
                      {allowedTiers.map((tier) => (
                        <option key={tier.value} value={tier.value}>{tier.label}</option>
                      ))}
                    </select>
                  </motion.div>
                ))}

                <div className="flex flex-col gap-1.5 border-t border-[rgba(255,255,255,0.03)] pt-4">
                  <label className="text-xs font-semibold text-white/80">TrustScore (0-100)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    placeholder="Enter whole number"
                    value={scoreInput}
                    onChange={(e) => setScoreInput(e.target.value)}
                    className="w-full border border-[rgba(255,255,255,0.05)] bg-[rgba(10,10,18,0.6)] text-white rounded-button px-3 py-2 text-xs focus:ring-1 focus:ring-[#00E5FF] focus:outline-hidden transition-all duration-300 hover:border-[rgba(255,255,255,0.1)]"
                  />
                  <p className="text-[10px] text-[rgba(255,255,255,0.2)] font-mono">Stores as decimal score / 100 in database.</p>
                </div>
              </div>

              <div className="flex flex-col gap-2 pt-2 border-t border-[rgba(255,255,255,0.03)]">
                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  disabled={submitting}
                  onClick={() => handleAction("approved")}
                  className="w-full bg-gradient-to-r from-[#00E5FF] to-[#00FFA3] text-[#030305] px-4 py-2.5 text-xs font-medium rounded-button hover:shadow-[0_0_40px_rgba(0,229,255,0.2)] active:scale-98 transition-all duration-300 focus:outline-hidden disabled:opacity-50 cursor-pointer text-center"
                >
                  {submitting ? "Processing..." : "Approve"}
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  disabled={submitting}
                  onClick={() => handleAction("under_review")}
                  className="w-full border border-[rgba(255,255,255,0.05)] text-white bg-[rgba(10,10,18,0.4)] px-4 py-2.5 text-xs font-medium rounded-button hover:bg-[rgba(255,255,255,0.02)] active:scale-98 transition-all duration-300 focus:outline-hidden disabled:opacity-50 cursor-pointer text-center"
                >
                  {submitting ? "Saving..." : "Mark Under Review"}
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  disabled={submitting}
                  onClick={() => handleAction("rejected")}
                  className="w-full bg-gradient-to-r from-[#FF4444] to-[#FF6B6B] text-white px-4 py-2.5 text-xs font-medium rounded-button hover:shadow-[0_0_40px_rgba(255,68,68,0.2)] active:scale-98 transition-all duration-300 focus:outline-hidden disabled:opacity-50 cursor-pointer text-center"
                >
                  {submitting ? "Rejecting..." : "Reject"}
                </motion.button>
              </div>
            </AnimatedCard>

          </div>

        </div>

      </main>

      <Footer />
    </div>
  );
}
