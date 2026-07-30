"use client";

import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { createClient } from "@/lib/supabase/client";
import { User } from "@supabase/supabase-js";
import { InvestorProfile } from "@/types/investor";
import { Vouch } from "@/types/vouch";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { PerspectiveCamera, Float, Sparkles, Torus, MeshDistortMaterial } from "@react-three/drei";
import * as THREE from "three";
import { motion, AnimatePresence } from "framer-motion";

const DashboardScene = () => {
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
        <bufferAttribute 
   attach="attributes-position" 
   count={count} 
   array={positions} 
   itemSize={3} 
   args={[positions, 3]}  
/>
      </bufferGeometry>
      <pointsMaterial size={0.015} transparent opacity={0.1} color="#00E5FF" sizeAttenuation />
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

const DashboardBackground = () => {
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
        <DashboardScene />
        <Sparkles count={60} scale={[8, 8, 8]} size={0.015} speed={0.2} color="#00E5FF" opacity={0.15} />
        <Sparkles count={30} scale={[8, 8, 8]} size={0.01} speed={0.15} color="#7000FF" opacity={0.1} />
      </Canvas>
    </div>
  );
};

const IconUser = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.59 14.37a6 6 0 0 1-5.84 0M8 21.75h8M12 18v3.75m0-16.5c-3.17 0-5.75 2.58-5.75 5.75S9.12 16.5 12 16.5s5.75-2.58 5.75-5.75-2.58-5.75-5.75-5.75Z" />
  </svg>
);

const IconMail = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
  </svg>
);

const IconBuilding = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 21V6.75a.75.75 0 0 1 .75-.75h13.5a.75.75 0 0 1 .75.75V21m-6.75-15v15m-3-15v15m-3-15v15m6.75-15v15" />
  </svg>
);

const IconBook = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
  </svg>
);

const IconShield = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z" />
  </svg>
);

const IconWarning = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
  </svg>
);

const IconCheck = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="2.5 6 4.5 8 9.5 3.5" />
  </svg>
);

const IconArrowRight = ({ className = "w-3.5 h-3.5" }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 18 15 12 9 6" />
  </svg>
);

const IconFile = ({ className = "w-3.5 h-3.5" }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.414a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
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

interface Company {
  id: string;
  name: string;
  status: "pending" | "under_review" | "approved" | "rejected";
  created_at: string;
  trust_score: number | null;
}

interface VouchWithCompany {
  id: string;
  amount: number | null;
  currency: string;
  round: string;
  status: Vouch["status"];
  company_id: string;
  companies: {
    name: string;
  } | null;
}

export default function DashboardPage() {
  const router = useRouter();
  const supabase = createClient();

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState("");

  const [companies, setCompanies] = useState<Company[]>([]);
  const [incomingVouches, setIncomingVouches] = useState<any[]>([]);
  const [resolvedVouches, setResolvedVouches] = useState<any[]>([]);
  const [disputingVouchId, setDisputingVouchId] = useState<string | null>(null);
  const [disputeNote, setDisputeNote] = useState("");
  const [actionSubmitting, setActionSubmitting] = useState<string | null>(null);

  const [investorProfile, setInvestorProfile] = useState<InvestorProfile | null>(null);
  const [vouches, setVouches] = useState<VouchWithCompany[]>([]);

  useEffect(() => {
    async function checkAuthAndFetch() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          router.push("/auth");
          return;
        }

        setUser(user);
        const userRole = user.user_metadata?.role || user.user_metadata?.user_type;

        if (userRole === "investor") {
          const [profileRes, vouchesRes] = await Promise.all([
            supabase
              .from("investor_profiles")
              .select("user_id, investor_type, firm_name, firm_website, linkedin_url")
              .eq("user_id", user.id)
              .maybeSingle(),
            supabase
              .from("vouches")
              .select(`
                id,
                amount,
                currency,
                round,
                status,
                company_id,
                companies (
                  name
                )
              `)
              .eq("investor_id", user.id)
              .order("created_at", { ascending: false })
          ]);

          if (profileRes.error) {
            setFetchError(profileRes.error.message);
          } else {
            setInvestorProfile(profileRes.data);
          }

          if (vouchesRes.error) {
            setFetchError((prev) => prev || vouchesRes.error.message);
          } else {
            setVouches((vouchesRes.data as unknown as VouchWithCompany[]) || []);
          }
        } else if (userRole === "founder") {
          const { data, error } = await supabase
            .from("companies")
            .select("id, name, status, created_at, trust_score")
            .eq("owner_id", user.id)
            .order("created_at", { ascending: false });

          if (error) {
            setFetchError(error.message);
          } else {
            setCompanies(data || []);

            const companyIds = data ? data.map((c) => c.id) : [];
            if (companyIds.length > 0) {
              const { data: vouchesData, error: vouchesError } = await supabase
                .from("vouches")
                .select("id, amount, currency, round, status, created_at, invested_on, investor_note, proof_filename, company_id, investor_id")
                .in("company_id", companyIds)
                .order("created_at", { ascending: false });

              if (vouchesError) {
                setFetchError((prev) => prev || vouchesError.message);
              } else if (vouchesData && vouchesData.length > 0) {
                const investorIds = Array.from(new Set(vouchesData.map((v) => v.investor_id)));
                const { data: profiles, error: profilesError } = await supabase
                  .from("investor_profiles")
                  .select("user_id, firm_name, investor_type")
                  .in("user_id", investorIds);

                const profilesMap: Record<string, { firm_name: string | null; investor_type: string }> = {};
                if (profiles) {
                  profiles.forEach((p) => {
                    profilesMap[p.user_id] = {
                      firm_name: p.firm_name,
                      investor_type: p.investor_type,
                    };
                  });
                }

                const joinedVouches = vouchesData.map((v) => {
                  const companyObj = data.find((c) => c.id === v.company_id);
                  const profileObj = profilesMap[v.investor_id];
                  
                  let investorName = "Angel Investor";
                  if (profileObj) {
                    if (profileObj.investor_type === "angel") {
                      investorName = "Angel Investor";
                    } else if (profileObj.firm_name) {
                      investorName = profileObj.firm_name;
                    } else {
                      investorName = `Investor (${profileObj.investor_type.toUpperCase()})`;
                    }
                  }

                  return {
                    ...v,
                    company_name: companyObj ? companyObj.name : "Unknown Startup",
                    investor_name: investorName,
                  };
                });

                const incoming = joinedVouches.filter((v) => v.status === "pending_founder");
                const resolved = joinedVouches.filter((v) => v.status === "pending_admin" || v.status === "disputed");

                setIncomingVouches(incoming);
                setResolvedVouches(resolved);
              } else {
                setIncomingVouches([]);
                setResolvedVouches([]);
              }
            }
          }
        }
      } catch (err: any) {
        setFetchError(err.message || "Failed to load dashboard data.");
      } finally {
        setLoading(false);
      }
    }

    checkAuthAndFetch();
  }, [router, supabase]);

  const handleConfirmVouch = async (vouchId: string) => {
    setActionSubmitting(vouchId);
    setFetchError("");

    try {
      const { error } = await supabase
        .from("vouches")
        .update({ status: "pending_admin" })
        .eq("id", vouchId);

      if (error) {
        setFetchError(error.message);
      } else {
        const confirmedVouch = incomingVouches.find((v) => v.id === vouchId);
        if (confirmedVouch) {
          const updated = { ...confirmedVouch, status: "pending_admin" as const };
          setIncomingVouches((prev) => prev.filter((v) => v.id !== vouchId));
          setResolvedVouches((prev) => [updated, ...prev]);
        }
      }
    } catch (err: any) {
      setFetchError(err.message || "Failed to confirm vouch.");
    } finally {
      setActionSubmitting(null);
    }
  };

  const handleDisputeVouchSubmit = async (vouchId: string) => {
    setActionSubmitting(vouchId);
    setFetchError("");

    try {
      const { error } = await supabase
        .from("vouches")
        .update({
          status: "disputed",
          founder_note: disputeNote.trim() || null,
        })
        .eq("id", vouchId);

      if (error) {
        setFetchError(error.message);
      } else {
        const disputedVouch = incomingVouches.find((v) => v.id === vouchId);
        if (disputedVouch) {
          const updated = {
            ...disputedVouch,
            status: "disputed" as const,
            founder_note: disputeNote.trim() || null,
          };
          setIncomingVouches((prev) => prev.filter((v) => v.id !== vouchId));
          setResolvedVouches((prev) => [updated, ...prev]);
        }
        setDisputingVouchId(null);
        setDisputeNote("");
      }
    } catch (err: any) {
      setFetchError(err.message || "Failed to dispute vouch.");
    } finally {
      setActionSubmitting(null);
    }
  };

  const getStatusStyles = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-[rgba(0,255,163,0.05)] border-[rgba(0,255,163,0.1)] text-[#00FFA3]";
      case "rejected":
        return "bg-[rgba(255,68,68,0.05)] border-[rgba(255,68,68,0.1)] text-[#FF4444]";
      case "under_review":
        return "bg-[rgba(200,164,81,0.05)] border-[rgba(200,164,81,0.1)] text-[#C8A451]";
      case "pending":
      default:
        return "bg-[rgba(255,255,255,0.02)] border-[rgba(255,255,255,0.03)] text-[rgba(255,255,255,0.3)]";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "approved":
        return "Approved";
      case "rejected":
        return "Rejected";
      case "under_review":
        return "Under Review";
      case "pending":
      default:
        return "Pending";
    }
  };

  const getStatusMessage = (status: string) => {
    switch (status) {
      case "approved":
        return "Approved. Your trust score and profile are active and public.";
      case "rejected":
        return "Rejected. Please reach out to our verification support team.";
      case "under_review":
        return "Under review, this usually takes 10 to 15 days.";
      case "pending":
      default:
        return "Pending verification, our team will begin reviewing shortly.";
    }
  };

  const getInvestorTypeLabel = (type: string) => {
    switch (type) {
      case "angel":
        return "Angel";
      case "vc":
        return "VC";
      case "family_office":
        return "Family Office";
      case "syndicate":
        return "Syndicate";
      case "corporate":
        return "Corporate";
      default:
        return type;
    }
  };

  const getVouchStatusLabel = (status: string) => {
    switch (status) {
      case "pending_founder":
        return "Awaiting founder";
      case "pending_admin":
        return "Awaiting review";
      case "confirmed":
        return "Confirmed";
      case "disputed":
        return "Disputed";
      case "rejected":
        return "Not confirmed";
      default:
        return status;
    }
  };

  const getVouchStatusStyles = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-[rgba(0,255,163,0.05)] border-[rgba(0,255,163,0.1)] text-[#00FFA3]";
      case "pending_founder":
      case "pending_admin":
      case "disputed":
        return "bg-[rgba(200,164,81,0.05)] border-[rgba(200,164,81,0.1)] text-[#C8A451]";
      case "rejected":
      default:
        return "bg-[rgba(255,68,68,0.05)] border-[rgba(255,68,68,0.1)] text-[#FF4444]";
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

  if (!user) return null;

  const rawUserRole = user.user_metadata?.role || user.user_metadata?.user_type || "";
  const isInvestor = rawUserRole === "investor";
  const isFounder = rawUserRole === "founder";
  const userRole = isInvestor ? "Investor" : isFounder ? "Founder" : "User";

  const displayName = user.user_metadata?.display_name || user.email || "";
  const userInitials = displayName
    ? displayName
        .split(/\s+/)
        .map((n: string) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "US";

  return (
    <div className="min-h-screen flex flex-col bg-[#030305] overflow-x-hidden">
      <DashboardBackground />
      <div className="fixed inset-0 -z-5 bg-gradient-to-b from-[#030305]/40 via-transparent to-[#030305]/80 pointer-events-none" />

      <Navbar />

      <main className="relative z-10 flex-1 w-full max-w-[1200px] mx-auto px-4 md:px-6 py-12 flex flex-col gap-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col gap-1"
        >
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[rgba(0,229,255,0.05)] border border-[rgba(0,229,255,0.1)] rounded-full text-[11px] font-medium text-[#00E5FF] select-none tracking-tight w-fit">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00E5FF] animate-pulse" />
            {userRole} Dashboard
          </div>
          <h1 className="text-3xl font-medium tracking-tight text-white">
            {userRole} Dashboard
          </h1>
          <p className="text-sm text-[rgba(255,255,255,0.4)]">
            {isInvestor
              ? "Manage your investor profile and track recorded backings."
              : isFounder
              ? "Manage your registered startups and track credibility profiles."
              : "Complete your profile credentials to access features."}
          </p>
        </motion.div>

        <AnimatedCard className="w-full bg-[rgba(10,10,18,0.4)] backdrop-blur-xl border border-[rgba(255,255,255,0.03)] rounded-card p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-[rgba(255,255,255,0.05)] transition-all duration-500">
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10 rounded-full bg-gradient-to-br from-[rgba(0,229,255,0.1)] to-[rgba(112,0,255,0.1)] border border-[rgba(255,255,255,0.05)] flex items-center justify-center text-[#00E5FF] font-medium select-none">
              {userInitials}
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#00E5FF]/5 to-[#7000FF]/5 opacity-0 hover:opacity-100 transition-opacity duration-500" />
            </div>
            <div>
              <h2 className="text-base font-medium text-white">
                {displayName}
              </h2>
              <p className="text-xs text-[rgba(255,255,255,0.3)] capitalize mt-0.5">
                {userRole} Account
              </p>
            </div>
          </div>
          <div className="text-xs text-[rgba(255,255,255,0.2)] flex flex-col sm:items-end">
            <span className="font-mono">{user.email}</span>
          </div>
        </AnimatedCard>

        {fetchError && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full p-4 rounded-lg bg-[rgba(255,68,68,0.05)] border border-[rgba(255,68,68,0.15)] text-[#FF4444] text-sm font-medium"
          >
            {fetchError}
          </motion.div>
        )}

        {!isInvestor && !isFounder ? (
          <AnimatedCard>
            <div className="max-w-md mx-auto w-full bg-[rgba(10,10,18,0.4)] backdrop-blur-xl border border-[rgba(255,255,255,0.03)] rounded-card p-6 shadow-[0_8px_40px_rgba(0,0,0,0.4)] text-center space-y-4 my-8 hover:border-[rgba(255,255,255,0.05)] transition-all duration-500">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-[rgba(200,164,81,0.05)] border border-[rgba(200,164,81,0.1)] mb-2 text-[#C8A451]">
                <IconWarning className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-medium text-white">Complete Your Account</h3>
              <p className="text-sm text-[rgba(255,255,255,0.4)] leading-relaxed">
                Please register your role as either a founder or investor to access the dashboard.
              </p>
            </div>
          </AnimatedCard>
        ) : isInvestor ? (
          <>
            {!investorProfile ? (
              <AnimatedCard>
                <div className="w-full bg-[rgba(10,10,18,0.4)] backdrop-blur-xl border border-[rgba(255,255,255,0.03)] rounded-card p-6 md:p-8 space-y-4 hover:border-[rgba(255,255,255,0.05)] transition-all duration-500">
                  <div className="space-y-2">
                    <h3 className="text-lg font-medium text-white">Complete Your Profile</h3>
                    <p className="text-sm text-[rgba(255,255,255,0.4)] leading-relaxed">
                      Tell us who you are before you record a backing.
                    </p>
                  </div>
                  <div className="pt-2">
                    <Link
                      href="/investor/register"
                      className="inline-flex items-center justify-center bg-gradient-to-r from-[#00E5FF] to-[#7000FF] text-white px-5 h-9 text-sm font-medium rounded-button hover:shadow-[0_0_30px_rgba(0,229,255,0.15)] active:scale-98 transition-all duration-300 cursor-pointer focus:outline-hidden"
                    >
                      Complete Profile
                    </Link>
                  </div>
                </div>
              </AnimatedCard>
            ) : (
              <AnimatedCard>
                <div className="w-full bg-[rgba(10,10,18,0.4)] backdrop-blur-xl border border-[rgba(255,255,255,0.03)] rounded-card p-5 space-y-4 hover:border-[rgba(255,255,255,0.05)] transition-all duration-500">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[rgba(255,255,255,0.03)] pb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[rgba(112,0,255,0.05)] border border-[rgba(112,0,255,0.08)] flex items-center justify-center text-[#7000FF]">
                        <IconUser className="w-5 h-5" />
                      </div>
                      <h3 className="text-lg font-medium text-white">Investor Profile</h3>
                    </div>
                    <Link
                      href="/investor/register"
                      className="h-9 px-4 rounded-button text-sm font-medium border border-[rgba(255,255,255,0.05)] hover:bg-[rgba(255,255,255,0.02)] text-white transition-all duration-300 cursor-pointer select-none flex items-center justify-center"
                    >
                      Edit Profile
                    </Link>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-xs text-[rgba(255,255,255,0.3)] font-medium">Investor Type</p>
                      <p className="text-white mt-1">{getInvestorTypeLabel(investorProfile.investor_type)}</p>
                    </div>
                    {investorProfile.investor_type !== "angel" && investorProfile.firm_name && (
                      <div>
                        <p className="text-xs text-[rgba(255,255,255,0.3)] font-medium">Firm Name</p>
                        <p className="text-white mt-1">{investorProfile.firm_name}</p>
                      </div>
                    )}
                    <div>
                      <p className="text-xs text-[rgba(255,255,255,0.3)] font-medium">LinkedIn URL</p>
                      <a
                        href={investorProfile.linkedin_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#00E5FF] hover:text-[#00E5FF]/80 hover:underline mt-1 block truncate font-medium transition-colors duration-300"
                      >
                        {investorProfile.linkedin_url}
                      </a>
                    </div>
                    {investorProfile.firm_website && (
                      <div>
                        <p className="text-xs text-[rgba(255,255,255,0.3)] font-medium">Firm Website</p>
                        <a
                          href={investorProfile.firm_website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#00E5FF] hover:text-[#00E5FF]/80 hover:underline mt-1 block truncate font-medium transition-colors duration-300"
                        >
                          {investorProfile.firm_website}
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </AnimatedCard>
            )}

            <div className="space-y-4">
              <h2 className="text-xl font-medium tracking-tight text-white">My Backings</h2>

              {vouches.length === 0 ? (
                <AnimatedCard>
                  <div className="max-w-md mx-auto w-full bg-[rgba(10,10,18,0.4)] backdrop-blur-xl border border-[rgba(255,255,255,0.03)] rounded-card p-6 shadow-[0_8px_40px_rgba(0,0,0,0.4)] text-center space-y-6 mt-4 hover:border-[rgba(255,255,255,0.05)] transition-all duration-500">
                    <div className="space-y-2">
                      <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-[rgba(0,229,255,0.05)] border border-[rgba(0,229,255,0.08)] mb-2 text-[#00E5FF]">
                        <IconShield className="w-7 h-7" />
                      </div>
                      <h3 className="text-lg font-medium text-white">No backings yet</h3>
                      <p className="text-sm text-[rgba(255,255,255,0.4)] leading-relaxed">
                        You haven't recorded any backings yet.
                      </p>
                    </div>
                    <div className="pt-2">
                      <Link
                        href="/directory"
                        className="block w-full text-center border border-[rgba(255,255,255,0.05)] hover:bg-[rgba(255,255,255,0.02)] text-white py-2.5 text-sm font-medium rounded-button transition-all duration-300 cursor-pointer focus:outline-hidden"
                      >
                        Browse Startups
                      </Link>
                    </div>
                  </div>
                </AnimatedCard>
              ) : (
                <div className="grid grid-cols-1 gap-4">
                  {vouches.map((vouch, index) => (
                    <AnimatedCard key={vouch.id} delay={index * 0.03}>
                      <div className="w-full bg-[rgba(10,10,18,0.4)] backdrop-blur-xl border border-[rgba(255,255,255,0.03)] rounded-card p-5 space-y-4 hover:border-[rgba(0,229,255,0.08)] transition-all duration-500 text-left">
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                          <div className="space-y-1">
                            <Link
                              href={`/startup/${vouch.company_id}`}
                              className="text-lg font-medium text-white hover:text-[#00E5FF] transition-colors duration-300"
                            >
                              {vouch.companies?.name || "Unknown Startup"}
                            </Link>
                            <p className="text-xs text-[rgba(255,255,255,0.3)]">
                              Backing round: {vouch.round} &bull; Amount:{" "}
                              {vouch.amount !== null
                                ? `${vouch.amount.toLocaleString()} ${vouch.currency.toUpperCase()}`
                                : `N/A ${vouch.currency.toUpperCase()}`}
                            </p>
                          </div>
                          <div className="flex items-center gap-3">
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getVouchStatusStyles(
                                vouch.status
                              )}`}
                            >
                              {getVouchStatusLabel(vouch.status)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </AnimatedCard>
                  ))}
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="space-y-8">
            {incomingVouches.length > 0 && (
              <div className="space-y-4">
                <h2 className="text-xl font-medium tracking-tight text-white">
                  Incoming Backings ({incomingVouches.length})
                </h2>
                <div className="grid grid-cols-1 gap-4">
                  {incomingVouches.map((vouch, index) => {
                    const isDisputing = disputingVouchId === vouch.id;
                    const isBusy = actionSubmitting === vouch.id;

                    return (
                      <AnimatedCard key={vouch.id} delay={index * 0.03}>
                        <div className="w-full bg-[rgba(10,10,18,0.4)] backdrop-blur-xl border border-[rgba(255,255,255,0.03)] rounded-card p-5 space-y-4 hover:border-[rgba(0,229,255,0.08)] transition-all duration-500 text-left">
                          <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                            <div className="space-y-2 flex-1">
                              <div className="flex flex-wrap items-center gap-2">
                                <span className="text-base font-semibold text-white">
                                  {vouch.investor_name}
                                </span>
                                <span className="text-xs text-[rgba(255,255,255,0.2)] font-light">backed</span>
                                <span className="text-sm font-semibold text-white">
                                  {vouch.company_name}
                                </span>
                              </div>
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                                <div>
                                  <p className="text-[10px] uppercase font-semibold text-[rgba(255,255,255,0.2)] font-mono">Round</p>
                                  <p className="font-medium text-white mt-0.5 capitalize">{vouch.round}</p>
                                </div>
                                <div>
                                  <p className="text-[10px] uppercase font-semibold text-[rgba(255,255,255,0.2)] font-mono">Amount</p>
                                  <p className="font-medium text-white mt-0.5">
                                    {vouch.amount !== null
                                      ? `${vouch.amount.toLocaleString()} ${vouch.currency.toUpperCase()}`
                                      : `N/A ${vouch.currency.toUpperCase()}`}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-[10px] uppercase font-semibold text-[rgba(255,255,255,0.2)] font-mono">Date Invested</p>
                                  <p className="font-medium text-white mt-0.5">
                                    {vouch.invested_on
                                      ? new Date(vouch.invested_on).toLocaleDateString(undefined, {
                                          year: "numeric",
                                          month: "long",
                                          day: "numeric",
                                        })
                                      : "N/A"}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-[10px] uppercase font-semibold text-[rgba(255,255,255,0.2)] font-mono">Submitted</p>
                                  <p className="font-medium text-white mt-0.5">
                                    {new Date(vouch.created_at).toLocaleDateString(undefined, {
                                      year: "numeric",
                                      month: "long",
                                      day: "numeric",
                                    })}
                                  </p>
                                </div>
                              </div>

                              {vouch.investor_note && (
                                <div className="bg-[rgba(255,255,255,0.01)] p-3 rounded-button border border-[rgba(255,255,255,0.03)] text-xs">
                                  <p className="font-semibold text-[rgba(255,255,255,0.3)] mb-0.5">Investor Note</p>
                                  <p className="text-white/60 italic">"{vouch.investor_note}"</p>
                                </div>
                              )}

                              {vouch.proof_filename && (
                                <div className="flex items-center gap-1.5 text-xs text-[rgba(255,255,255,0.3)]">
                                  <IconFile className="w-3.5 h-3.5" />
                                  <span>Proof document: <span className="font-medium text-white/60">{vouch.proof_filename}</span></span>
                                </div>
                              )}
                            </div>

                            {!isDisputing && (
                              <div className="flex items-center gap-2 w-full md:w-auto flex-shrink-0">
                                <button
                                  type="button"
                                  disabled={isBusy}
                                  onClick={() => handleConfirmVouch(vouch.id)}
                                  className="flex-1 md:flex-none h-8 px-4 bg-gradient-to-r from-[#00E5FF] to-[#00FFA3] text-[#030305] rounded-button text-xs font-semibold transition-all duration-300 hover:shadow-[0_0_30px_rgba(0,229,255,0.15)] cursor-pointer flex items-center justify-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                  {isBusy && actionSubmitting === vouch.id ? (
                                    <div className="w-3.5 h-3.5 border border-[#030305] border-t-transparent rounded-full animate-spin"></div>
                                  ) : null}
                                  Confirm
                                </button>
                                <button
                                  type="button"
                                  disabled={isBusy}
                                  onClick={() => {
                                    setDisputingVouchId(vouch.id);
                                    setDisputeNote("");
                                  }}
                                  className="flex-1 md:flex-none h-8 px-4 border border-[rgba(255,255,255,0.05)] hover:bg-[rgba(255,255,255,0.02)] text-white rounded-button text-xs font-semibold transition-all duration-300 cursor-pointer"
                                >
                                  Dispute
                                </button>
                              </div>
                            )}
                          </div>

                          {isDisputing && (
                            <div className="border-t border-[rgba(255,255,255,0.03)] pt-4 space-y-3 animate-in slide-in-from-top-2 duration-200">
                              <div className="flex flex-col gap-1.5">
                                <label htmlFor={`dispute_note_${vouch.id}`} className="text-xs font-semibold text-white/80">
                                  Reason for disagreement <span className="text-[rgba(255,255,255,0.2)] font-light">(optional explainer for the admin)</span>
                                </label>
                                <textarea
                                  id={`dispute_note_${vouch.id}`}
                                  rows={2}
                                  placeholder="Explain why this backing is incorrect or disputed..."
                                  value={disputeNote}
                                  onChange={(e) => setDisputeNote(e.target.value)}
                                  className="w-full border border-[rgba(255,255,255,0.05)] bg-[rgba(10,10,18,0.4)] text-white rounded-button p-2.5 text-xs placeholder:text-[rgba(255,255,255,0.2)] focus:outline-hidden focus:ring-1 focus:ring-[#00E5FF] focus:border-[#00E5FF] transition-all duration-300 hover:border-[rgba(255,255,255,0.1)] resize-none font-sans"
                                />
                              </div>
                              <div className="flex justify-end gap-2 text-xs">
                                <button
                                  type="button"
                                  disabled={isBusy}
                                  onClick={() => {
                                    setDisputingVouchId(null);
                                    setDisputeNote("");
                                  }}
                                  className="h-8 px-3 border border-[rgba(255,255,255,0.05)] hover:bg-[rgba(255,255,255,0.02)] text-white rounded-button font-medium transition-all duration-300 cursor-pointer"
                                >
                                  Cancel
                                </button>
                                <button
                                  type="button"
                                  disabled={isBusy}
                                  onClick={() => handleDisputeVouchSubmit(vouch.id)}
                                  className="h-8 px-3 bg-gradient-to-r from-[#FF4444] to-[#FF6B6B] text-white rounded-button font-medium transition-all duration-300 hover:shadow-[0_0_30px_rgba(255,68,68,0.15)] cursor-pointer flex items-center justify-center gap-1 disabled:opacity-50"
                                >
                                  {isBusy && actionSubmitting === vouch.id ? (
                                    <div className="w-3.5 h-3.5 border border-white border-t-transparent rounded-full animate-spin"></div>
                                  ) : null}
                                  Confirm Dispute
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      </AnimatedCard>
                    );
                  })}
                </div>
              </div>
            )}

            {resolvedVouches.length > 0 && (
              <div className="space-y-4">
                <h2 className="text-xl font-medium tracking-tight text-white">
                  Resolved Backings
                </h2>
                <div className="grid grid-cols-1 gap-4">
                  {resolvedVouches.map((vouch, index) => (
                    <AnimatedCard key={vouch.id} delay={index * 0.03}>
                      <div className="w-full bg-[rgba(10,10,18,0.4)] backdrop-blur-xl border border-[rgba(255,255,255,0.03)] rounded-card p-5 space-y-3 hover:border-[rgba(255,255,255,0.05)] transition-all duration-500 text-left">
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                          <div className="space-y-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="text-base font-semibold text-white">
                                {vouch.investor_name}
                              </span>
                              <span className="text-xs text-[rgba(255,255,255,0.2)] font-light">backed</span>
                              <span className="text-sm font-semibold text-white">
                                {vouch.company_name}
                              </span>
                            </div>
                            <p className="text-xs text-[rgba(255,255,255,0.3)]">
                              Round: {vouch.round} &bull; Amount:{" "}
                              {vouch.amount !== null
                                ? `${vouch.amount.toLocaleString()} ${vouch.currency.toUpperCase()}`
                                : `N/A ${vouch.currency.toUpperCase()}`}
                            </p>
                          </div>
                          <div>
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getVouchStatusStyles(
                                vouch.status
                              )}`}
                            >
                              {getVouchStatusLabel(vouch.status)}
                            </span>
                          </div>
                        </div>

                        {vouch.founder_note && (
                          <div className="bg-[rgba(200,164,81,0.03)] p-3 rounded-button border border-[rgba(200,164,81,0.05)] text-xs text-[#C8A451]">
                            <p className="font-semibold mb-0.5">Dispute Note</p>
                            <p className="italic">"{vouch.founder_note}"</p>
                          </div>
                        )}
                      </div>
                    </AnimatedCard>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-4">
              <h2 className="text-xl font-medium tracking-tight text-white">
                Your Startups
              </h2>

              {companies.length === 0 ? (
                <AnimatedCard>
                  <div className="max-w-md mx-auto w-full bg-[rgba(10,10,18,0.4)] backdrop-blur-xl border border-[rgba(255,255,255,0.03)] rounded-card p-6 shadow-[0_8px_40px_rgba(0,0,0,0.4)] text-center space-y-6 mt-4 hover:border-[rgba(255,255,255,0.05)] transition-all duration-500">
                    <div className="space-y-2">
                      <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-[rgba(0,229,255,0.05)] border border-[rgba(0,229,255,0.08)] mb-2 text-[#00E5FF]">
                        <IconBook className="w-7 h-7" />
                      </div>
                      <h3 className="text-lg font-medium text-white">
                        No startups onboarded yet
                      </h3>
                      <p className="text-sm text-[rgba(255,255,255,0.4)] leading-relaxed">
                        To start building your startup credibility profile and calculate your TrustScore, register your first startup's details.
                      </p>
                    </div>

                    <div className="pt-2">
                      <Link
                        href="/register"
                        className="block w-full text-center bg-gradient-to-r from-[#00E5FF] to-[#7000FF] text-white py-2.5 text-sm font-medium rounded-button hover:shadow-[0_0_30px_rgba(0,229,255,0.15)] active:scale-98 transition-all duration-300 cursor-pointer focus:outline-hidden"
                      >
                        Onboard your startup
                      </Link>
                    </div>
                  </div>
                </AnimatedCard>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 gap-4">
                    {companies.map((company, index) => (
                      <AnimatedCard key={company.id} delay={index * 0.03}>
                        <div className="w-full bg-[rgba(10,10,18,0.4)] backdrop-blur-xl border border-[rgba(255,255,255,0.03)] rounded-card p-5 space-y-4 hover:border-[rgba(0,229,255,0.08)] transition-all duration-500 text-left">
                          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                            <div className="space-y-1">
                              <h3 className="text-lg font-medium text-white">
                                {company.name}
                              </h3>
                              <p className="text-xs text-[rgba(255,255,255,0.3)]">
                                Submitted on{" "}
                                {new Date(company.created_at).toLocaleDateString(
                                  undefined,
                                  { year: "numeric", month: "long", day: "numeric" }
                                )}
                              </p>
                            </div>

                            <div className="flex flex-wrap items-center gap-3">
                              <span
                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusStyles(
                                  company.status
                                )}`}
                              >
                                {getStatusLabel(company.status)}
                              </span>

                              {company.status === "approved" &&
                                company.trust_score !== null && (
                                  <div className="flex items-center gap-1.5 bg-[rgba(0,255,163,0.05)] border border-[rgba(0,255,163,0.08)] px-2.5 py-0.5 rounded-full">
                                    <span className="w-1.5 h-1.5 rounded-full bg-[#00FFA3]"></span>
                                    <span className="text-xs font-semibold text-[#00FFA3]">
                                      TrustScore: {Math.round(company.trust_score * 100)}/100
                                    </span>
                                  </div>
                                )}
                            </div>
                          </div>

                          <div className="border-t border-[rgba(255,255,255,0.03)] pt-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            <p className="text-xs text-[rgba(255,255,255,0.3)] italic">
                              {getStatusMessage(company.status)}
                            </p>
                            <Link
                              href={`/startup/${company.id}`}
                              className="inline-flex items-center gap-1 text-xs font-medium text-[#00E5FF] hover:text-[#00E5FF]/80 transition-colors duration-300"
                            >
                              View profile
                              <IconArrowRight className="w-3.5 h-3.5" />
                            </Link>
                          </div>
                        </div>
                      </AnimatedCard>
                    ))}
                  </div>

                  <div className="pt-2 flex justify-start">
                    <Link
                      href="/register"
                      className="bg-gradient-to-r from-[#00E5FF] to-[#7000FF] text-white px-4 py-2 text-sm font-medium rounded-button hover:shadow-[0_0_30px_rgba(0,229,255,0.15)] active:scale-98 transition-all duration-300 focus:outline-hidden"
                    >
                      Add another startup
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}