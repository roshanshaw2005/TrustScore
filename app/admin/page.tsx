"use client";

import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { createClient } from "@/lib/supabase/client";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { PerspectiveCamera, Float, Sphere, Ring, Torus, MeshDistortMaterial, Sparkles } from "@react-three/drei";
import * as THREE from "three";
import { motion, AnimatePresence } from "framer-motion";

const AdminQueueScene = () => {
  const meshRef = useRef<THREE.Mesh>(null!);
  const { mouse } = useThree();

  useFrame((state) => {
    if (meshRef.current) {
      const x = (mouse.x - 0) * 0.15;
      const y = (mouse.y - 0) * 0.1;
      meshRef.current.rotation.x += (y - meshRef.current.rotation.x) * 0.02;
      meshRef.current.rotation.y += (x - meshRef.current.rotation.y) * 0.02;
      const time = state.clock.getElapsedTime();
      meshRef.current.position.y = Math.sin(time * 0.3) * 0.1;
    }
  });

  return (
    <group>
      <Float speed={1.2} rotationIntensity={0.15} floatIntensity={0.3}>
        <mesh ref={meshRef} scale={1.5}>
          <octahedronGeometry args={[1, 0]} />
          <MeshDistortMaterial
            color="#00E5FF"
            metalness={0.9}
            roughness={0.05}
            clearcoat={1}
            clearcoatRoughness={0.05}
            transparent
            opacity={0.4}
            distort={0.2}
            speed={0.3}
            emissive="#00E5FF"
            emissiveIntensity={0.1}
          />
        </mesh>
      </Float>
      <Ring args={[2.0, 2.2, 64]} rotation={[Math.PI / 2, 0, 0]}>
        <meshPhysicalMaterial
          color="#7000FF"
          emissive="#7000FF"
          emissiveIntensity={0.05}
          transparent
          opacity={0.15}
          metalness={0.8}
          roughness={0.2}
        />
      </Ring>
      <Ring args={[2.4, 2.6, 64]} rotation={[Math.PI / 3, 0.2, 0]}>
        <meshPhysicalMaterial
          color="#00FFA3"
          emissive="#00FFA3"
          emissiveIntensity={0.05}
          transparent
          opacity={0.1}
          metalness={0.8}
          roughness={0.2}
        />
      </Ring>
      <Sparkles count={80} scale={[6, 6, 6]} size={0.015} speed={0.2} color="#00E5FF" opacity={0.3} />
      <Sparkles count={40} scale={[6, 6, 6]} size={0.01} speed={0.15} color="#7000FF" opacity={0.2} />
    </group>
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
      <pointsMaterial size={0.015} transparent opacity={0.2} color="#00E5FF" sizeAttenuation />
    </points>
  );
};

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

const IconShield = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12Z" />
  </svg>
);

const IconArrowRight = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12h15m0 0-6.75-6.75M19.5 12l-6.75 6.75" />
  </svg>
);

const IconDocument = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
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

interface CompanyQueueItem {
  id: string;
  name: string;
  sector: string;
  created_at: string;
  status: "pending" | "under_review" | "approved" | "rejected";
}

export default function AdminQueuePage() {
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [companies, setCompanies] = useState<CompanyQueueItem[]>([]);
  const [errorMsg, setErrorMsg] = useState("");
  const [activeTab, setActiveTab] = useState<"companies" | "vouches">("companies");
  const [vouches, setVouches] = useState<any[]>([]);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [confirmingVouchId, setConfirmingVouchId] = useState<string | null>(null);
  const [rejectingVouchId, setRejectingVouchId] = useState<string | null>(null);
  const [verifyingLedger, setVerifyingLedger] = useState(false);
  const [integrityResult, setIntegrityResult] = useState<{ status: "intact" | "tampered"; count?: number; row?: any } | null>(null);

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

        const { data: companiesData, error: fetchError } = await supabase
          .from("companies")
          .select("id, name, sector, created_at, status")
          .in("status", ["pending", "under_review"])
          .order("created_at", { ascending: true });

        if (fetchError) {
          setErrorMsg(fetchError.message);
        } else {
          setCompanies(companiesData || []);
        }

        const { data: vouchesData, error: vouchesError } = await supabase
          .from("vouches")
          .select(`
            id,
            amount,
            currency,
            round,
            status,
            invested_on,
            investor_note,
            proof_filename,
            created_at,
            founder_note,
            founder_responded_at,
            company_id,
            investor_id
          `)
          .in("status", ["pending_admin", "disputed"])
          .order("created_at", { ascending: false });

        if (vouchesError) {
          setErrorMsg((prev) => prev || vouchesError.message);
        } else if (vouchesData && vouchesData.length > 0) {
          const uniqueCompanyIds = Array.from(new Set(vouchesData.map((v) => v.company_id)));
          const uniqueInvestorIds = Array.from(new Set(vouchesData.map((v) => v.investor_id)));

          const [companiesRes, profilesRes] = await Promise.all([
            supabase.from("companies").select("id, name").in("id", uniqueCompanyIds),
            supabase.from("investor_profiles").select("user_id, firm_name, investor_type").in("user_id", uniqueInvestorIds),
          ]);

          const companiesMap: Record<string, string> = {};
          if (companiesRes.data) {
            companiesRes.data.forEach((c) => {
              companiesMap[c.id] = c.name;
            });
          }

          const profilesMap: Record<string, { firm_name: string | null; investor_type: string }> = {};
          if (profilesRes.data) {
            profilesRes.data.forEach((p) => {
              profilesMap[p.user_id] = {
                firm_name: p.firm_name,
                investor_type: p.investor_type,
              };
            });
          }

          const joined = vouchesData.map((v) => {
            const profile = profilesMap[v.investor_id];
            let investorName = "Angel Investor";
            if (profile) {
              if (profile.investor_type === "angel") {
                investorName = "Angel Investor";
              } else if (profile.firm_name) {
                investorName = profile.firm_name;
              } else {
                investorName = `Investor (${profile.investor_type.toUpperCase()})`;
              }
            }

            return {
              ...v,
              company_name: companiesMap[v.company_id] || "Unknown Startup",
              investor_name: investorName,
              investor_type: profile ? profile.investor_type : "angel",
            };
          });

          setVouches(joined);
        } else {
          setVouches([]);
        }
      } catch (err: any) {
        setErrorMsg(err.message || "An unexpected error occurred while loading the queue.");
      } finally {
        setLoading(false);
      }
    }

    checkAdminAndFetch();
  }, [router, supabase]);

  const handleConfirmVouch = async (vouchId: string) => {
    setActionLoading(vouchId);
    setErrorMsg("");
    try {
      const { error } = await supabase
        .from("vouches")
        .update({ status: "confirmed" })
        .eq("id", vouchId);

      if (error) {
        setErrorMsg(error.message);
      } else {
        setVouches((prev) => prev.filter((v) => v.id !== vouchId));
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to confirm vouch.");
    } finally {
      setActionLoading(null);
      setConfirmingVouchId(null);
    }
  };

  const handleRejectVouch = async (vouchId: string) => {
    setActionLoading(vouchId);
    setErrorMsg("");
    try {
      const { error } = await supabase
        .from("vouches")
        .update({ status: "rejected" })
        .eq("id", vouchId);

      if (error) {
        setErrorMsg(error.message);
      } else {
        setVouches((prev) => prev.filter((v) => v.id !== vouchId));
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to reject vouch.");
    } finally {
      setActionLoading(null);
      setRejectingVouchId(null);
    }
  };

  const handleVerifyLedger = async () => {
    setVerifyingLedger(true);
    setIntegrityResult(null);
    setErrorMsg("");
    try {
      const { data: invalidRow, error: rpcError } = await supabase.rpc("verify_event_chain");
      
      if (rpcError) {
        setErrorMsg(rpcError.message);
        return;
      }

      const isTampered = invalidRow && invalidRow.seq !== null && invalidRow.seq !== undefined;

      if (isTampered) {
        setIntegrityResult({
          status: "tampered",
          row: invalidRow
        });
      } else {
        const { count, error: countError } = await supabase
          .from("verification_events")
          .select("*", { head: true, count: "exact" });

        if (countError) {
          setErrorMsg(countError.message);
        } else {
          setIntegrityResult({
            status: "intact",
            count: count || 0
          });
        }
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to run ledger verification.");
    } finally {
      setVerifyingLedger(false);
    }
  };

  const getStatusStyles = (status: string) => {
    switch (status) {
      case "under_review":
        return "bg-[rgba(200,164,81,0.1)] border-[rgba(200,164,81,0.2)] text-[#C8A451]";
      case "pending":
      default:
        return "bg-[rgba(255,255,255,0.02)] border-[rgba(255,255,255,0.05)] text-[rgba(255,255,255,0.4)]";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "under_review":
        return "Under Review";
      case "pending":
      default:
        return "Pending";
    }
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

  return (
    <div className="min-h-screen flex flex-col bg-[#030305] text-white overflow-x-hidden">
      <div className="fixed inset-0 -z-10 pointer-events-none">
        <Canvas style={{ background: "#030305" }} dpr={[1, 2]}>
          <PerspectiveCamera makeDefault position={[0, 0, 8]} fov={50} />
          <ambientLight intensity={0.2} color="#00E5FF" />
          <directionalLight position={[5, 5, 5]} intensity={0.5} color="#7000FF" />
          <directionalLight position={[-5, -2, 5]} intensity={0.3} color="#00E5FF" />
          <pointLight position={[0, 0, 3]} intensity={0.5} color="#00FFA3" />
          <BackgroundParticles />
          <AdminQueueScene />
        </Canvas>
      </div>
      <div className="fixed inset-0 -z-5 bg-gradient-to-b from-[#030305]/60 via-transparent to-[#030305]/80 pointer-events-none" />

      <Navbar />

      <main className="relative z-10 flex-1 w-full max-w-[1200px] mx-auto px-4 md:px-6 py-8 flex flex-col gap-6">
        
        <AnimatedCard>
          <div className="flex flex-col gap-1">
            <h1 className="text-3xl font-medium tracking-tight text-white">Review Queue</h1>
            <p className="text-sm text-[rgba(255,255,255,0.4)]">
              Select a submitted company profile to perform verification checks and assign a TrustScore.
            </p>
          </div>
        </AnimatedCard>

        <AnimatedCard delay={0.1} className="bg-[rgba(10,10,18,0.6)] backdrop-blur-xl border border-[rgba(255,255,255,0.05)] rounded-card p-5 space-y-4 hover:border-[rgba(0,229,255,0.1)] transition-all duration-500">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[rgba(0,229,255,0.05)] border border-[rgba(0,229,255,0.1)] flex items-center justify-center text-[#00E5FF]">
                <IconShield className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white">Ledger Cryptographic Integrity</h3>
                <p className="text-xs text-[rgba(255,255,255,0.3)] mt-0.5 font-light">
                  Run cryptographic verification checks across the global verification events log.
                </p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              {integrityResult && (
                <motion.span
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full border text-[10px] font-semibold tracking-wide ${
                    integrityResult.status === "intact"
                      ? "bg-[rgba(0,255,163,0.05)] border-[rgba(0,255,163,0.15)] text-[#00FFA3]"
                      : "bg-[rgba(255,68,68,0.05)] border-[rgba(255,68,68,0.15)] text-[#FF4444]"
                  }`}
                >
                  {integrityResult.status === "intact"
                    ? `Ledger intact (${integrityResult.count} events checked)`
                    : "Tampering detected"}
                </motion.span>
              )}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="button"
                disabled={verifyingLedger}
                onClick={handleVerifyLedger}
                className="h-8 px-4 bg-gradient-to-r from-[#00E5FF] to-[#7000FF] text-white rounded-button text-xs font-semibold transition-all duration-300 hover:shadow-[0_0_30px_rgba(0,229,255,0.15)] disabled:opacity-50 cursor-pointer flex items-center gap-1.5"
              >
                {verifyingLedger ? (
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : null}
                Verify Ledger
              </motion.button>
            </div>
          </div>

          {integrityResult && integrityResult.status === "tampered" && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-[rgba(255,68,68,0.05)] border border-[rgba(255,68,68,0.15)] text-xs p-4 rounded-button space-y-2 mt-2"
            >
              <div className="flex items-center gap-2 text-[#FF4444] font-semibold">
                <IconX className="w-4 h-4" />
                <span>Cryptographic Tampering Mismatch</span>
              </div>
              <p className="text-[rgba(255,255,255,0.4)] font-light">
                The event chain failed verification. The first modified or corrupted ledger entry details:
              </p>
              <div className="bg-[rgba(10,10,18,0.4)] p-3 rounded-button border border-[rgba(255,255,255,0.03)] text-[11px] font-mono space-y-1.5 text-[rgba(255,255,255,0.6)] overflow-x-auto">
                <p><span className="font-semibold text-[rgba(255,255,255,0.3)]">Sequence ID:</span> {integrityResult.row.seq}</p>
                <p><span className="font-semibold text-[rgba(255,255,255,0.3)]">Event UUID:</span> {integrityResult.row.id}</p>
                <p><span className="font-semibold text-[rgba(255,255,255,0.3)]">Event Type:</span> {integrityResult.row.event_type}</p>
                <p><span className="font-semibold text-[rgba(255,255,255,0.3)]">Timestamp (UTC):</span> {new Date(integrityResult.row.created_at).toUTCString()}</p>
                <p><span className="font-semibold text-[rgba(255,255,255,0.3)]">Payload:</span> {JSON.stringify(integrityResult.row.payload)}</p>
                <p><span className="font-semibold text-[rgba(255,255,255,0.3)]">Stored Hash:</span> {integrityResult.row.hash}</p>
                <p><span className="font-semibold text-[rgba(255,255,255,0.3)]">Previous Hash:</span> {integrityResult.row.prev_hash}</p>
              </div>
            </motion.div>
          )}
        </AnimatedCard>

        {errorMsg && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[rgba(255,68,68,0.05)] border border-[rgba(255,68,68,0.15)] text-[#FF4444] text-xs p-4 rounded-card"
          >
            <p className="font-semibold">Error Loading Queue</p>
            <p className="mt-1 font-normal text-[rgba(255,255,255,0.4)]">{errorMsg}</p>
          </motion.div>
        )}

        <div className="flex gap-6 border-b border-[rgba(255,255,255,0.03)]">
          <button
            type="button"
            onClick={() => setActiveTab("companies")}
            className={`pb-3 text-xs font-semibold tracking-wide border-b-2 transition-all duration-300 cursor-pointer ${
              activeTab === "companies"
                ? "border-[#00E5FF] text-white"
                : "border-transparent text-[rgba(255,255,255,0.3)] hover:text-[rgba(255,255,255,0.6)]"
            }`}
          >
            Startups Queue ({companies.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("vouches")}
            className={`pb-3 text-xs font-semibold tracking-wide border-b-2 transition-all duration-300 cursor-pointer ${
              activeTab === "vouches"
                ? "border-[#00E5FF] text-white"
                : "border-transparent text-[rgba(255,255,255,0.3)] hover:text-[rgba(255,255,255,0.6)]"
            }`}
          >
            Vouches Queue ({vouches.length})
          </button>
        </div>

        {activeTab === "companies" ? (
          <AnimatedCard delay={0.2} className="w-full bg-[rgba(10,10,18,0.4)] backdrop-blur-xl border border-[rgba(255,255,255,0.03)] rounded-card overflow-hidden hover:border-[rgba(255,255,255,0.05)] transition-all duration-500">
            {companies.length === 0 ? (
              <div className="p-12 text-center">
                <div className="w-12 h-12 mx-auto rounded-full bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.03)] flex items-center justify-center">
                  <IconDocument className="w-6 h-6 text-[rgba(255,255,255,0.1)]" />
                </div>
                <h3 className="text-sm font-semibold text-white mt-4">No startups currently awaiting review</h3>
                <p className="text-xs text-[rgba(255,255,255,0.3)] mt-1">All startup submissions have been processed.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-[rgba(255,255,255,0.03)] bg-[rgba(255,255,255,0.02)] text-[10px] font-semibold text-[rgba(255,255,255,0.3)] tracking-wider uppercase">
                      <th className="py-3.5 px-6">Company Name</th>
                      <th className="py-3.5 px-6">Sector</th>
                      <th className="py-3.5 px-6">Submitted Date</th>
                      <th className="py-3.5 px-6">Status</th>
                      <th className="py-3.5 px-6 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[rgba(255,255,255,0.02)] text-sm">
                    {companies.map((company, index) => (
                      <motion.tr
                        key={company.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.03 }}
                        className="hover:bg-[rgba(255,255,255,0.02)] transition-colors cursor-pointer group"
                        onClick={() => router.push(`/admin/${company.id}`)}
                      >
                        <td className="py-3.5 px-6 font-medium text-white group-hover:text-[#00E5FF] transition-colors">
                          {company.name}
                        </td>
                        <td className="py-3.5 px-6 text-[rgba(255,255,255,0.4)]">
                          {company.sector}
                        </td>
                        <td className="py-3.5 px-6 text-[rgba(255,255,255,0.4)]">
                          {new Date(company.created_at).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric"
                          })}
                        </td>
                        <td className="py-3.5 px-6">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full border text-[10px] font-semibold tracking-wide ${getStatusStyles(company.status)}`}>
                            {getStatusLabel(company.status)}
                          </span>
                        </td>
                        <td className="py-3.5 px-6 text-right">
                          <span className="text-xs font-semibold text-[#00E5FF] group-hover:underline flex items-center justify-end gap-1">
                            Review details <IconArrowRight className="w-3 h-3" />
                          </span>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </AnimatedCard>
        ) : (
          <AnimatedCard delay={0.2} className="w-full bg-[rgba(10,10,18,0.4)] backdrop-blur-xl border border-[rgba(255,255,255,0.03)] rounded-card overflow-hidden hover:border-[rgba(255,255,255,0.05)] transition-all duration-500">
            {vouches.length === 0 ? (
              <div className="p-12 text-center">
                <div className="w-12 h-12 mx-auto rounded-full bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.03)] flex items-center justify-center">
                  <IconUsers className="w-6 h-6 text-[rgba(255,255,255,0.1)]" />
                </div>
                <h3 className="text-sm font-semibold text-white mt-4">No backings currently awaiting review</h3>
                <p className="text-xs text-[rgba(255,255,255,0.3)] mt-1">All investor backing claims have been processed.</p>
              </div>
            ) : (
              <div className="divide-y divide-[rgba(255,255,255,0.02)]">
                {vouches.map((vouch, index) => {
                  const isBusy = actionLoading === vouch.id;
                  const isConfirming = confirmingVouchId === vouch.id;
                  const isRejecting = rejectingVouchId === vouch.id;
                  const isDisputed = vouch.status === "disputed";

                  return (
                    <motion.div
                      key={vouch.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.03 }}
                      className="p-6 space-y-4 hover:bg-[rgba(255,255,255,0.01)] transition-colors"
                    >
                      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
                        <div className="space-y-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="text-base font-semibold text-white">
                              {vouch.investor_name}
                            </span>
                            <span className="text-xs text-[rgba(255,255,255,0.3)] font-light">backed</span>
                            <span className="text-sm font-semibold text-white">
                              {vouch.company_name}
                            </span>
                          </div>
                          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[rgba(255,255,255,0.3)]">
                            <span className="capitalize">Type: {vouch.investor_type}</span>
                            <span>&bull;</span>
                            <span className="capitalize">Round: {vouch.round}</span>
                            <span>&bull;</span>
                            <span>
                              Amount:{" "}
                              {vouch.amount !== null
                                ? `${vouch.amount.toLocaleString()} ${vouch.currency.toUpperCase()}`
                                : `N/A ${vouch.currency.toUpperCase()}`}
                            </span>
                          </div>
                        </div>

                        <div>
                          {isDisputed ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border border-[rgba(200,164,81,0.2)] bg-[rgba(200,164,81,0.05)] text-[#C8A451]">
                              Disputed
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border border-[rgba(255,255,255,0.03)] bg-[rgba(255,255,255,0.02)] text-[rgba(255,255,255,0.3)]">
                              Founder agreed
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-[rgba(255,255,255,0.01)] p-4 rounded-button border border-[rgba(255,255,255,0.02)] text-xs">
                        <div className="space-y-1">
                          <p className="font-semibold text-[rgba(255,255,255,0.2)] uppercase text-[10px] tracking-wider">Investor note</p>
                          <p className="text-[rgba(255,255,255,0.6)] italic">
                            {vouch.investor_note ? `"${vouch.investor_note}"` : "No note provided."}
                          </p>
                        </div>
                        <div className="space-y-1">
                          <p className="font-semibold text-[rgba(255,255,255,0.2)] uppercase text-[10px] tracking-wider">Proof document</p>
                          {vouch.proof_filename ? (
                            <div className="flex items-center gap-1.5 text-[rgba(255,255,255,0.6)] font-medium mt-0.5">
                              <IconDocument className="w-3.5 h-3.5 text-[rgba(255,255,255,0.2)] flex-shrink-0" />
                              <span>{vouch.proof_filename}</span>
                            </div>
                          ) : (
                            <p className="text-[rgba(255,255,255,0.3)] italic">No proof file uploaded.</p>
                          )}
                        </div>
                      </div>

                      {isDisputed && vouch.founder_note && (
                        <div className="bg-[rgba(200,164,81,0.03)] p-3 rounded-button border border-[rgba(200,164,81,0.05)] text-xs text-[#C8A451]">
                          <p className="font-semibold mb-0.5">Founder Disagreement Explainer</p>
                          <p className="italic">"{vouch.founder_note}"</p>
                        </div>
                      )}

                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[10px] text-[rgba(255,255,255,0.2)] font-light">
                        <div>
                          Submitted:{" "}
                          <span className="font-medium text-[rgba(255,255,255,0.4)]">
                            {new Date(vouch.created_at).toLocaleString()}
                          </span>
                        </div>
                        {vouch.founder_responded_at && (
                          <>
                            <span>&bull;</span>
                            <div>
                              Founder Responded:{" "}
                              <span className="font-medium text-[rgba(255,255,255,0.4)]">
                                {new Date(vouch.founder_responded_at).toLocaleString()}
                              </span>
                            </div>
                          </>
                        )}
                        {vouch.invested_on && (
                          <>
                            <span>&bull;</span>
                            <div>
                              Invested On:{" "}
                              <span className="font-medium text-[rgba(255,255,255,0.4)]">
                                {new Date(vouch.invested_on).toLocaleDateString()}
                              </span>
                            </div>
                          </>
                        )}
                      </div>

                      <div className="pt-2 border-t border-[rgba(255,255,255,0.02)]">
                        {isConfirming ? (
                          <div className="bg-[rgba(200,164,81,0.03)] border border-[rgba(200,164,81,0.05)] p-4 rounded-button text-xs text-white flex flex-col md:flex-row md:items-center justify-between gap-3">
                            <div>
                              <p className="font-semibold text-[#C8A451]">Are you sure you want to confirm this backing?</p>
                              <p className="text-[rgba(255,255,255,0.3)] mt-0.5 font-light">
                                This action is permanent and irreversible. The backing will be locked as confirmed.
                              </p>
                            </div>
                            <div className="flex gap-2">
                              <button
                                type="button"
                                disabled={isBusy}
                                onClick={() => setConfirmingVouchId(null)}
                                className="h-7 px-3 border border-[rgba(255,255,255,0.05)] bg-[rgba(10,10,18,0.4)] text-white rounded-button text-[10px] font-semibold hover:bg-[rgba(255,255,255,0.02)] transition-colors cursor-pointer"
                              >
                                Cancel
                              </button>
                              <button
                                type="button"
                                disabled={isBusy}
                                onClick={() => handleConfirmVouch(vouch.id)}
                                className="h-7 px-3 bg-gradient-to-r from-[#00E5FF] to-[#00FFA3] text-[#030305] rounded-button text-[10px] font-semibold hover:shadow-[0_0_30px_rgba(0,229,255,0.15)] transition-all duration-300 cursor-pointer"
                              >
                                Yes, Confirm
                              </button>
                            </div>
                          </div>
                        ) : isRejecting ? (
                          <div className="bg-[rgba(255,68,68,0.05)] border border-[rgba(255,68,68,0.15)] p-4 rounded-button text-xs text-white flex flex-col md:flex-row md:items-center justify-between gap-3">
                            <div>
                              <p className="font-semibold text-[#FF4444]">Are you sure you want to reject this backing?</p>
                              <p className="text-[rgba(255,255,255,0.3)] mt-0.5 font-light">
                                This action is permanent and irreversible. The backing will be locked as rejected.
                              </p>
                            </div>
                            <div className="flex gap-2">
                              <button
                                type="button"
                                disabled={isBusy}
                                onClick={() => setRejectingVouchId(null)}
                                className="h-7 px-3 border border-[rgba(255,255,255,0.05)] bg-[rgba(10,10,18,0.4)] text-white rounded-button text-[10px] font-semibold hover:bg-[rgba(255,255,255,0.02)] transition-colors cursor-pointer"
                              >
                                Cancel
                              </button>
                              <button
                                type="button"
                                disabled={isBusy}
                                onClick={() => handleRejectVouch(vouch.id)}
                                className="h-7 px-3 bg-gradient-to-r from-[#FF4444] to-[#FF6B6B] text-white rounded-button text-[10px] font-semibold hover:shadow-[0_0_30px_rgba(255,68,68,0.15)] transition-all duration-300 cursor-pointer"
                              >
                                Yes, Reject
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex gap-2">
                            <motion.button
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              type="button"
                              disabled={isBusy}
                              onClick={() => {
                                setConfirmingVouchId(vouch.id);
                                setRejectingVouchId(null);
                              }}
                              className="h-8 px-4 bg-gradient-to-r from-[#00E5FF] to-[#00FFA3] text-[#030305] rounded-button text-xs font-semibold transition-all duration-300 hover:shadow-[0_0_30px_rgba(0,229,255,0.15)] disabled:opacity-50 cursor-pointer"
                            >
                              Confirm
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              type="button"
                              disabled={isBusy}
                              onClick={() => {
                                setRejectingVouchId(vouch.id);
                                setConfirmingVouchId(null);
                              }}
                              className="h-8 px-4 border border-[rgba(255,255,255,0.05)] bg-[rgba(10,10,18,0.4)] text-white rounded-button text-xs font-semibold transition-all duration-300 hover:bg-[rgba(255,255,255,0.02)] disabled:opacity-50 cursor-pointer"
                            >
                              Reject
                            </motion.button>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </AnimatedCard>
        )}
      </main>

      <Footer />
    </div>
  );
}