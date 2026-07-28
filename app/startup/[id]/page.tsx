"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import VerificationBadge from "@/components/VerificationBadge";
import { createClient } from "@/lib/supabase/client";
import { User } from "@supabase/supabase-js";
import { BadgeTier } from "@/types/startup";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { PerspectiveCamera, Float, Sparkles, Torus, MeshDistortMaterial } from "@react-three/drei";
import * as THREE from "three";
import { motion, AnimatePresence } from "framer-motion";

const StartupScene = ({ score }: { score: number | null }) => {
  const meshRef = useRef<THREE.Mesh>(null!);
  const { mouse } = useThree();
  const scoreValue = score || 0;

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

  const getColor = () => {
    if (scoreValue >= 0.8) return "#00FFA3";
    if (scoreValue >= 0.6) return "#00E5FF";
    if (scoreValue >= 0.4) return "#C8A451";
    return "#7000FF";
  };

  const color = getColor();

  return (
    <group>
      <Float speed={1.2} rotationIntensity={0.15} floatIntensity={0.3}>
        <mesh ref={meshRef} scale={1.6}>
          <icosahedronGeometry args={[1, 1]} />
          <MeshDistortMaterial
            color={color}
            metalness={0.9}
            roughness={0.05}
            clearcoat={1}
            clearcoatRoughness={0.05}
            transparent
            opacity={0.1}
            distort={0.2}
            speed={0.3}
            emissive={color}
            emissiveIntensity={0.05}
          />
        </mesh>
      </Float>
      <Torus args={[2.0, 0.015, 16, 100]} rotation={[Math.PI / 2, 0, 0]}>
        <meshPhysicalMaterial color="#7000FF" emissive="#7000FF" emissiveIntensity={0.08} transparent opacity={0.1} metalness={0.8} roughness={0.2} />
      </Torus>
      <Torus args={[2.4, 0.01, 16, 100]} rotation={[Math.PI / 3, 0.15, 0]}>
        <meshPhysicalMaterial color="#00FFA3" emissive="#00FFA3" emissiveIntensity={0.06} transparent opacity={0.06} metalness={0.8} roughness={0.2} />
      </Torus>
      <Sparkles count={60} scale={[8, 8, 8]} size={0.015} speed={0.2} color={color} opacity={0.15} />
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
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.015} transparent opacity={0.1} color="#00E5FF" sizeAttenuation />
    </points>
  );
};

const StartupBackground = ({ score }: { score: number | null }) => {
  return (
    <div className="fixed inset-0 -z-10 pointer-events-none">
      <Canvas style={{ background: "#030305" }} dpr={[1, 2]}>
        <PerspectiveCamera makeDefault position={[0, 0, 7]} fov={45} />
        <ambientLight intensity={0.2} color="#00E5FF" />
        <directionalLight position={[5, 5, 5]} intensity={0.4} color="#7000FF" />
        <directionalLight position={[-5, -2, 5]} intensity={0.2} color="#00E5FF" />
        <pointLight position={[0, 0, 3]} intensity={0.3} color="#00FFA3" />
        <BackgroundParticles />
        <StartupScene score={score} />
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

const IconLock = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 14 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2.5" y="6" width="9" height="6" rx="1.5" />
    <path d="M 4.5,6 V 3.5 A 2.5,2.5 0 0,1 9.5,3.5 V 6" />
  </svg>
);

const IconSettings = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const IconInfo = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
  </svg>
);

const IconLinkedIn = ({ className = "w-3.5 h-3.5" }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const IconHash = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 8.25h15m-16.5 7.5h15m-1.8-13.5l-3.9 19.5m-2.1-19.5l-3.9 19.5" />
  </svg>
);

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
  status: "pending" | "under_review" | "approved" | "rejected";
  created_at: string;
  trust_score: number | null;
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
  verification?: Record<string, string> | null;
}

interface PageProps {
  params: Promise<{ id: string }>;
}

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
      transition={{ duration: 0.5, delay, ease: [0.23, 1, 0.32, 1] }}
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

export default function StartupProfilePage({ params }: PageProps) {
  const { id } = React.use(params);
  const router = useRouter();
  const supabase = createClient();

  const [user, setUser] = useState<User | null>(null);
  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState("");
  const [savingSharing, setSavingSharing] = useState(false);

  const [showVouchModal, setShowVouchModal] = useState(false);
  const [vouchSuccess, setVouchSuccess] = useState(false);
  const [vouchRound, setVouchRound] = useState("");
  const [vouchAmount, setVouchAmount] = useState("");
  const [vouchCurrency, setVouchCurrency] = useState("INR");
  const [vouchInvestedOn, setVouchInvestedOn] = useState("");
  const [vouchInvestorNote, setVouchInvestorNote] = useState("");
  const [vouchProofFilename, setVouchProofFilename] = useState<string | null>(null);

  const [vouchErrors, setVouchErrors] = useState({
    round: "",
    general: "",
  });
  const [vouchSubmitting, setVouchSubmitting] = useState(false);
  const [confirmedVouches, setConfirmedVouches] = useState<any[]>([]);
  const [timelineEvents, setTimelineEvents] = useState<any[]>([]);
  const [expandedHashEventId, setExpandedHashEventId] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCompanyAndUser() {
      try {
        setLoading(true);
        setFetchError("");

        const { data: { user: currentUser } } = await supabase.auth.getUser();
        setUser(currentUser);

        const { data: companyData, error: companyError } = await supabase
          .from("companies")
          .select("*")
          .eq("id", id)
          .single();

        if (companyError || !companyData) {
          setFetchError("Profile not found or is unavailable.");
          setLoading(false);
          return;
        }

        const isProfileOwner = currentUser !== null && currentUser.id === companyData.owner_id;

        if (!isProfileOwner && companyData.status !== "approved") {
          setFetchError("Profile not available.");
          setLoading(false);
          return;
        }

        setCompany(companyData as Company);

        const { data: vouchesData, error: vouchesError } = await supabase
          .from("vouches")
          .select("id, round, investor_id")
          .eq("company_id", id)
          .eq("status", "confirmed");

        const { data: eventsData, error: eventsError } = await supabase
          .from("verification_events")
          .select("seq, id, event_type, created_at, payload, source_actor_id, hash")
          .eq("company_id", id)
          .in("event_type", ["company_status_changed", "claim_tier_changed", "vouch_admin_confirmed"])
          .order("seq", { ascending: true });

        const uniqueInvestorIds = new Set<string>();
        if (vouchesData) {
          vouchesData.forEach((v) => uniqueInvestorIds.add(v.investor_id));
        }
        if (eventsData) {
          eventsData.forEach((e) => {
            if (e.source_actor_id) {
              uniqueInvestorIds.add(e.source_actor_id);
            }
          });
        }

        let profilesMap = new Map<string, string | null>();
        if (uniqueInvestorIds.size > 0) {
          const { data: profiles } = await supabase
            .from("confirmed_investors_public")
            .select("user_id, firm_name")
            .in("user_id", Array.from(uniqueInvestorIds));
          if (profiles) {
            profiles.forEach((p) => {
              profilesMap.set(p.user_id, p.firm_name);
            });
          }
        }

        if (!vouchesError && vouchesData) {
          const joinedVouches = vouchesData.map((v) => ({
            ...v,
            firm_name: profilesMap.get(v.investor_id) || "Angel Investor"
          }));
          setConfirmedVouches(joinedVouches);
        } else {
          setConfirmedVouches([]);
        }

        if (!eventsError && eventsData) {
          const filtered = eventsData.filter((e) => {
            if (e.event_type === "claim_tier_changed") {
              const newTier = e.payload?.new_tier;
              return newTier && newTier !== "self-reported";
            }
            return true;
          });

          const mappedEvents = filtered.map((e) => {
            let label = "";
            if (e.event_type === "company_status_changed" && e.payload?.new_status === "approved") {
              label = "Registration approved";
            } else if (e.event_type === "claim_tier_changed") {
              const key = e.payload?.key;
              const newTier = e.payload?.new_tier;
              const keyLabels: Record<string, string> = {
                cin: "Corporate identity (CIN)",
                revenue: "Revenue",
                founders: "Founders",
                funding: "Funding",
                incubator: "Incubator",
              };
              const keyLabel = keyLabels[key] || key;
              label = `${keyLabel} claim verified as ${newTier}`;
            } else if (e.event_type === "vouch_admin_confirmed") {
              const firmName = e.source_actor_id ? (profilesMap.get(e.source_actor_id) || "Angel Investor") : "Angel Investor";
              label = `Backing confirmed from ${firmName}`;
            }
            return {
              ...e,
              formatted_label: label,
            };
          }).filter((e) => e.formatted_label !== "");

          setTimelineEvents(mappedEvents);
        } else {
          setTimelineEvents([]);
        }
      } catch (err: any) {
        setFetchError(err.message || "An error occurred while loading this profile.");
      } finally {
        setLoading(false);
      }
    }

    fetchCompanyAndUser();
  }, [id, supabase]);

  const handleToggleSharing = async () => {
    if (!company) return;
    setSavingSharing(true);
    try {
      const nextShowScore = !company.show_score;
      const { error } = await supabase
        .from("companies")
        .update({ show_score: nextShowScore })
        .eq("id", company.id);

      if (error) {
        alert("Failed to update sharing settings: " + error.message);
      } else {
        setCompany({ ...company, show_score: nextShowScore });
      }
    } catch (err: any) {
      alert("Error: " + err.message);
    } finally {
      setSavingSharing(false);
    }
  };

  const handleVouchClick = async () => {
    if (!user) return;
    
    try {
      const { data: profile, error } = await supabase
        .from("investor_profiles")
        .select("user_id")
        .eq("user_id", user.id)
        .maybeSingle();

      if (error) {
        setVouchErrors((prev) => ({ ...prev, general: "Failed to verify investor status: " + error.message }));
        return;
      }

      if (!profile) {
        router.push("/investor/register?notice=profile_required");
        return;
      }

      setShowVouchModal(true);
      setVouchSuccess(false);
      setVouchRound("");
      setVouchAmount("");
      setVouchCurrency("INR");
      setVouchInvestedOn("");
      setVouchInvestorNote("");
      setVouchProofFilename(null);
      setVouchErrors({ round: "", general: "" });
    } catch (err: any) {
      setVouchErrors((prev) => ({ ...prev, general: err.message || "An unexpected error occurred." }));
    }
  };

  const handleVouchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !company) return;

    setVouchErrors({ round: "", general: "" });

    const trimmedRound = vouchRound.trim();
    if (!trimmedRound) {
      setVouchErrors((prev) => ({ ...prev, round: "Round name is required." }));
      return;
    }

    setVouchSubmitting(true);

    const normalisedRound = trimmedRound.toLowerCase();

    const payload = {
      investor_id: user.id,
      company_id: company.id,
      round: normalisedRound,
      amount: vouchAmount ? parseFloat(vouchAmount) : null,
      currency: vouchCurrency,
      invested_on: vouchInvestedOn || null,
      investor_note: vouchInvestorNote.trim() || null,
      proof_filename: vouchProofFilename || null,
    };

    try {
      const { error } = await supabase.from("vouches").insert(payload);

      if (error) {
        if (error.code === "23505") {
          setVouchErrors((prev) => ({
            ...prev,
            round: "You've already recorded a backing for this round.",
          }));
        } else {
          setVouchErrors((prev) => ({ ...prev, general: error.message }));
        }
      } else {
        setVouchSuccess(true);
      }
    } catch (err: any) {
      setVouchErrors((prev) => ({ ...prev, general: err.message || "Failed to record vouch." }));
    } finally {
      setVouchSubmitting(false);
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

  if (fetchError || !company) {
    return (
      <div className="min-h-screen flex flex-col bg-[#030305] text-white">
        <Navbar />
        <main className="flex-1 w-full max-w-[1100px] mx-auto px-4 md:px-6 py-16 flex flex-col items-center justify-center text-center gap-4">
          <div className="w-14 h-14 bg-[rgba(255,68,68,0.05)] border border-[rgba(255,68,68,0.1)] rounded-full flex items-center justify-center text-[#FF4444]">
            <IconX className="w-7 h-7" />
          </div>
          <h2 className="text-xl font-medium text-white">Profile Unavailable</h2>
          <p className="text-sm text-[rgba(255,255,255,0.4)] max-w-md">
            {fetchError || "The requested startup profile could not be loaded."}
          </p>
          <div className="pt-2">
            <Link
              href="/directory"
              className="bg-gradient-to-r from-[#00E5FF] to-[#7000FF] text-white px-4 py-2 text-sm font-medium rounded-button hover:shadow-[0_0_30px_rgba(0,229,255,0.15)] active:scale-98 transition-all duration-300 focus:outline-hidden"
            >
              Back to Directory
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const isOwner = user !== null && user.id === company.owner_id;
  const userRole = user?.user_metadata?.role || user?.user_metadata?.user_type || "";
  const isInvestor = userRole === "investor";
  const foundedYear = company.founded_date ? new Date(company.founded_date).getFullYear() : "N/A";

  const dbVerification = company.verification || {};
  const claims = {
    basics: (dbVerification.cin || "self-reported") as BadgeTier,
    founders: (dbVerification.founders || "self-reported") as BadgeTier,
    traction: (dbVerification.revenue || "self-reported") as BadgeTier,
    endorsements: (dbVerification.incubator || "self-reported") as BadgeTier,
    funding: (dbVerification.funding || "self-reported") as BadgeTier,
  };

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
      maximumFractionDigits: 0,
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

  const getStatusBg = (status: string) => {
    switch(status) {
      case "approved": return "bg-[rgba(0,255,163,0.05)] border-[rgba(0,255,163,0.1)]";
      case "rejected": return "bg-[rgba(255,68,68,0.05)] border-[rgba(255,68,68,0.1)]";
      case "under_review": return "bg-[rgba(200,164,81,0.05)] border-[rgba(200,164,81,0.1)]";
      default: return "bg-[rgba(255,255,255,0.02)] border-[rgba(255,255,255,0.03)]";
    }
  };

  const getScoreColor = (score: number | null) => {
    if (!score) return "text-[rgba(255,255,255,0.4)]";
    if (score >= 0.8) return "text-[#00FFA3]";
    if (score >= 0.6) return "text-[#00E5FF]";
    if (score >= 0.4) return "text-[#C8A451]";
    return "text-[#7000FF]";
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#030305] overflow-x-hidden">
      <StartupBackground score={company.trust_score} />
      <div className="fixed inset-0 -z-5 bg-gradient-to-b from-[#030305]/40 via-transparent to-[#030305]/80 pointer-events-none" />

      <Navbar />

      <main className="relative z-10 flex-1 w-full max-w-[1200px] mx-auto px-4 md:px-6 py-8 flex flex-col gap-6">
        
        <AnimatedSection className="flex items-center gap-3">
          <Link
            href="/directory"
            className="text-xs font-semibold text-[#00E5FF] hover:text-[#00E5FF]/80 transition-colors flex items-center gap-1 group"
          >
            <IconArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            Back to Directory
          </Link>
        </AnimatedSection>

        {isOwner && (
          <AnimatedSection>
            <div
              className={`border rounded-card p-4 flex items-start gap-3 text-xs leading-relaxed ${getStatusBg(company.status)}`}
            >
              <div className="mt-0.5 flex-shrink-0">
                {company.status === "approved" ? (
                  <IconCheck className="w-4 h-4 text-[#00FFA3]" />
                ) : (
                  <div className="w-4 h-4 rounded-full bg-[#C8A451] animate-pulse" />
                )}
              </div>
              <div>
                <p className={`font-semibold capitalize ${getStatusColor(company.status)}`}>
                  Status: {company.status.replace("_", " ")}
                </p>
                <p className="mt-1 font-normal text-[rgba(255,255,255,0.4)]">
                  {company.status === "pending" &&
                    "Your registration is pending. Review will begin shortly once our system aggregates baseline data."}
                  {company.status === "under_review" &&
                    "Under review, this usually takes 10 to 15 days."}
                  {company.status === "approved" &&
                    "Verified! Your profile is visible publicly in the investor directory list."}
                  {company.status === "rejected" &&
                    "Your registration did not pass guidelines. Please reach out to verification support."}
                </p>
              </div>
            </div>
          </AnimatedSection>
        )}

        <AnimatedCard delay={0.1} className="bg-[rgba(10,10,18,0.6)] backdrop-blur-xl border border-[rgba(255,255,255,0.05)] rounded-card p-6 flex flex-col md:flex-row justify-between gap-6 hover:border-[rgba(0,229,255,0.08)] transition-all duration-500 group">
          <div className="flex items-start gap-4 min-w-0 flex-1">
            <div className="relative w-16 h-16 rounded-xl overflow-hidden border border-[rgba(255,255,255,0.05)] bg-[rgba(255,255,255,0.02)] flex items-center justify-center flex-shrink-0 select-none group-hover:border-[rgba(0,229,255,0.1)] transition-all duration-500">
              <span className="text-[#00E5FF] font-medium text-lg">
                {company.name.slice(0, 2).toUpperCase()}
              </span>
              <div className="absolute inset-0 bg-gradient-to-br from-[#00E5FF]/5 to-[#7000FF]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl font-medium text-white tracking-tight truncate">
                  {company.name}
                </h1>
                {isOwner && (
                  <span className="text-[10px] text-[rgba(255,255,255,0.3)] px-2 py-0.5 bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.03)] rounded-full font-medium">
                    Owner profile
                  </span>
                )}
              </div>
              <p className="text-sm text-[rgba(255,255,255,0.4)] mt-1.5 leading-relaxed">
                {company.description}
              </p>
              <div className="flex flex-wrap gap-x-4 gap-y-1.5 mt-3 text-xs text-[rgba(255,255,255,0.3)]">
                <span className="flex items-center gap-1">
                  <strong className="font-semibold text-white/60">Sector:</strong> {company.sector}
                </span>
                <span className="text-[rgba(255,255,255,0.05)]">•</span>
                <span className="flex items-center gap-1">
                  <strong className="font-semibold text-white/60">Stage:</strong> {company.stage}
                </span>
                <span className="text-[rgba(255,255,255,0.05)]">•</span>
                <span className="flex items-center gap-1">
                  <strong className="font-semibold text-white/60">Founded:</strong> {foundedYear}
                </span>
              </div>
            </div>
          </div>

          <div className="flex-shrink-0 flex flex-col items-end gap-2 md:border-l md:border-[rgba(255,255,255,0.03)] md:pl-6">
            <div className="flex items-center gap-3">
              {isOwner ? (
                <div className="flex items-center gap-3">
                  <div className="flex flex-col items-end">
                    <span className="text-[10px] text-[rgba(255,255,255,0.2)] tracking-wider font-semibold font-mono uppercase">
                      Trustscore
                    </span>
                    <span className={`text-3xl font-medium tracking-tight mt-0.5 ${getScoreColor(company.trust_score)}`}>
                      {company.trust_score !== null ? Math.round(company.trust_score * 100) : "—"}
                    </span>
                  </div>
                  
                  <button
                    type="button"
                    onClick={handleToggleSharing}
                    disabled={savingSharing}
                    className="p-1.5 border border-[rgba(255,255,255,0.05)] hover:border-[rgba(0,229,255,0.2)] hover:bg-[rgba(255,255,255,0.02)] rounded-button transition-all duration-300 text-[rgba(255,255,255,0.2)] hover:text-[#00E5FF] focus:outline-hidden disabled:opacity-50"
                    title="Manage sharing settings"
                  >
                    <IconSettings className={`w-4 h-4 ${savingSharing ? "animate-spin" : ""}`} />
                  </button>
                </div>
              ) : (
                company.status === "approved" && company.show_score ? (
                  company.trust_score !== null ? (
                    <div className="flex items-center gap-3">
                      <div className="flex flex-col items-end">
                        <span className="text-[10px] text-[rgba(255,255,255,0.2)] tracking-wider font-semibold font-mono uppercase">
                          Trustscore
                        </span>
                        <span className={`text-3xl font-medium tracking-tight mt-0.5 ${getScoreColor(company.trust_score)}`}>
                          {Math.round(company.trust_score * 100)}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5 px-3 py-2 bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.03)] rounded-button text-[rgba(255,255,255,0.3)]">
                      <span className="text-xs font-medium leading-none">
                        Not yet scored
                      </span>
                    </div>
                  )
                ) : (
                  <div className="flex items-center gap-1.5 px-3 py-2 bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.03)] rounded-button text-[rgba(255,255,255,0.2)]">
                    <IconLock className="w-4 h-4" />
                    <span className="text-xs font-medium leading-none">
                      Score not shared
                    </span>
                  </div>
                )
              )}
            </div>
            
            {isOwner && (
              <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${
                company.show_score 
                  ? "bg-[rgba(0,255,163,0.05)] border-[rgba(0,255,163,0.1)] text-[#00FFA3]" 
                  : "bg-[rgba(255,255,255,0.02)] border-[rgba(255,255,255,0.03)] text-[rgba(255,255,255,0.2)]"
              }`}>
                {company.show_score ? "Score is public" : "Score is hidden"}
              </span>
            )}
          </div>
        </AnimatedCard>

        {isOwner && (
          <AnimatedCard delay={0.15} className="bg-[rgba(10,10,18,0.4)] backdrop-blur-xl border border-[rgba(255,255,255,0.03)] rounded-card p-5 space-y-3 hover:border-[rgba(255,255,255,0.05)] transition-all duration-500">
            <div className="flex justify-between items-center border-b border-[rgba(255,255,255,0.03)] pb-2.5">
              <h3 className="text-sm font-semibold text-white">
                Submitter contact details
              </h3>
              <button className="text-[11px] font-semibold text-[rgba(255,255,255,0.3)] border border-[rgba(255,255,255,0.03)] hover:border-[rgba(0,229,255,0.1)] hover:text-[#00E5FF] px-2 py-0.5 rounded-[6px] transition-all duration-300 cursor-pointer select-none">
                Edit
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <p className="text-[rgba(255,255,255,0.3)] font-medium">Full Name</p>
                <p className="text-white font-medium mt-0.5">{user?.user_metadata?.display_name || "Founder"}</p>
              </div>
              <div>
                <p className="text-[rgba(255,255,255,0.3)] font-medium">Email Address</p>
                <p className="text-white font-medium mt-0.5">{user?.email || ""}</p>
              </div>
            </div>
          </AnimatedCard>
        )}

        {!isOwner && (
          <AnimatedCard delay={0.15} className="bg-[rgba(10,10,18,0.4)] backdrop-blur-xl border border-[rgba(255,255,255,0.03)] rounded-card p-5 flex flex-col sm:flex-row justify-between items-center gap-4 hover:border-[rgba(255,255,255,0.05)] transition-all duration-500">
            <div>
              <h3 className="text-sm font-semibold text-white">
                Interested in this startup?
              </h3>
              <p className="text-xs text-[rgba(255,255,255,0.3)] mt-1">
                Request an introduction or contact the founders directly to discuss potential opportunities.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2.5 flex-shrink-0">
              {user && isInvestor && company.status === "approved" && (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  onClick={handleVouchClick}
                  className="h-9 px-4 border border-[rgba(255,255,255,0.05)] hover:bg-[rgba(255,255,255,0.02)] text-white rounded-button text-xs font-medium transition-all duration-300 cursor-pointer select-none whitespace-nowrap"
                >
                  I Invested Here
                </motion.button>
              )}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="button"
                onClick={() => alert("Contact request sent to the founder!")}
                className="h-9 px-4 bg-gradient-to-r from-[#00E5FF] to-[#7000FF] text-white rounded-button text-xs font-medium transition-all duration-300 hover:shadow-[0_0_30px_rgba(0,229,255,0.15)] cursor-pointer select-none whitespace-nowrap"
              >
                Contact founder
              </motion.button>
            </div>
          </AnimatedCard>
        )}

        <AnimatedCard delay={0.2} className="bg-[rgba(10,10,18,0.4)] backdrop-blur-xl border border-[rgba(255,255,255,0.03)] rounded-card p-6 space-y-4 hover:border-[rgba(255,255,255,0.05)] transition-all duration-500">
          <div className="flex justify-between items-center border-b border-[rgba(255,255,255,0.03)] pb-3">
            <div>
              <h2 className="text-base font-semibold text-white">
                Verification evidence details
              </h2>
              <p className="text-xs text-[rgba(255,255,255,0.3)] mt-0.5">
                This scorecard explains how each claims category influences the computed TrustScore.
              </p>
            </div>
            {isOwner && (
              <button className="text-[11px] font-semibold text-[rgba(255,255,255,0.3)] border border-[rgba(255,255,255,0.03)] hover:border-[rgba(0,229,255,0.1)] hover:text-[#00E5FF] px-2 py-0.5 rounded-[6px] transition-all duration-300 cursor-pointer select-none">
                Manage files
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-5 gap-4">
            <div className="border border-[rgba(255,255,255,0.03)] rounded-card p-4 bg-[rgba(255,255,255,0.01)] flex flex-col justify-between gap-3 text-xs hover:border-[rgba(0,229,255,0.08)] transition-all duration-500 group">
              <div>
                <p className="font-semibold text-white/80">Basics & CIN</p>
                <p className="text-[10px] text-[rgba(255,255,255,0.2)] mt-1">CIN structure and corporate identification.</p>
              </div>
              <div className="flex items-center gap-1">
                <VerificationBadge tier={claims.basics} className="!px-2 !py-0.5 text-[10px]" />
              </div>
            </div>

            <div className="border border-[rgba(255,255,255,0.03)] rounded-card p-4 bg-[rgba(255,255,255,0.01)] flex flex-col justify-between gap-3 text-xs hover:border-[rgba(112,0,255,0.08)] transition-all duration-500 group">
              <div>
                <p className="font-semibold text-white/80">Founders</p>
                <p className="text-[10px] text-[rgba(255,255,255,0.2)] mt-1">LinkedIn URLs and profile verification.</p>
              </div>
              <div className="flex items-center gap-1">
                <VerificationBadge tier={claims.founders} className="!px-2 !py-0.5 text-[10px]" />
              </div>
            </div>

            <div className="border border-[rgba(255,255,255,0.03)] rounded-card p-4 bg-[rgba(255,255,255,0.01)] flex flex-col justify-between gap-3 text-xs hover:border-[rgba(0,255,163,0.08)] transition-all duration-500 group">
              <div>
                <p className="font-semibold text-white/80">Traction</p>
                <p className="text-[10px] text-[rgba(255,255,255,0.2)] mt-1">MRR, active users, and growth reports.</p>
              </div>
              <div className="flex items-center gap-1">
                <VerificationBadge tier={claims.traction} className="!px-2 !py-0.5 text-[10px]" />
              </div>
            </div>

            <div className="border border-[rgba(255,255,255,0.03)] rounded-card p-4 bg-[rgba(255,255,255,0.01)] flex flex-col justify-between gap-3 text-xs hover:border-[rgba(200,164,81,0.08)] transition-all duration-500 group">
              <div>
                <p className="font-semibold text-white/80">Endorsements</p>
                <p className="text-[10px] text-[rgba(255,255,255,0.2)] mt-1">Accelerators and incubator checks.</p>
              </div>
              <div className="flex items-center gap-1">
                <VerificationBadge tier={claims.endorsements} className="!px-2 !py-0.5 text-[10px]" />
              </div>
            </div>

            <div className="border border-[rgba(255,255,255,0.03)] rounded-card p-4 bg-[rgba(255,255,255,0.01)] flex flex-col justify-between gap-3 text-xs hover:border-[rgba(0,229,255,0.08)] transition-all duration-500 group">
              <div>
                <p className="font-semibold text-white/80">Funding</p>
                <p className="text-[10px] text-[rgba(255,255,255,0.2)] mt-1">Investor details and round records.</p>
              </div>
              <div className="flex items-center gap-1">
                <VerificationBadge tier={claims.funding} className="!px-2 !py-0.5 text-[10px]" />
              </div>
            </div>
          </div>

          <div className="bg-[rgba(255,255,255,0.01)] border border-[rgba(255,255,255,0.03)] rounded-card p-4 space-y-2 mt-4 text-xs">
            <p className="font-semibold text-white/80">Evidence documents provided</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[rgba(255,255,255,0.3)] mt-2">
              <div className="flex items-center gap-2">
                <span className="font-medium text-white/60">Certificate of Incorporation:</span>
                <span>{company.coi_filename || "None provided"}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-medium text-white/60">Financials / Revenue Proof:</span>
                <span>{company.financials_filename || "None provided"}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-medium text-white/60">Pitch Deck:</span>
                <span>{company.pitch_deck_filename || "None provided"}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-medium text-white/60">Cap Table:</span>
                <span>{company.cap_table_filename || "None provided"}</span>
              </div>
            </div>
          </div>
        </AnimatedCard>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <div className="md:col-span-2 space-y-6">
            
            <AnimatedCard delay={0.25}>
              <div className="bg-[rgba(10,10,18,0.4)] backdrop-blur-xl border border-[rgba(255,255,255,0.03)] rounded-card p-5 space-y-4 hover:border-[rgba(255,255,255,0.05)] transition-all duration-500">
                <div className="flex justify-between items-center border-b border-[rgba(255,255,255,0.03)] pb-2.5">
                  <h3 className="text-sm font-semibold text-white">Founders</h3>
                  {isOwner && (
                    <button className="text-[11px] font-semibold text-[rgba(255,255,255,0.3)] border border-[rgba(255,255,255,0.03)] hover:border-[rgba(0,229,255,0.1)] hover:text-[#00E5FF] px-2 py-0.5 rounded-[6px] transition-all duration-300 cursor-pointer select-none">
                      Edit
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {company.founders && company.founders.length > 0 ? (
                    company.founders.map((founder, index) => (
                      <div
                        key={index}
                        className="bg-[rgba(255,255,255,0.01)] border border-[rgba(255,255,255,0.03)] rounded-card p-3 flex items-center justify-between gap-3 text-xs"
                      >
                        <div className="truncate">
                          <p className="font-medium text-white truncate">{founder.name}</p>
                        </div>
                        <a
                          href={founder.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-2.5 py-1 bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.03)] text-[rgba(255,255,255,0.3)] hover:text-[#00E5FF] rounded-button text-[10px] font-medium transition-all duration-300 flex items-center gap-1"
                        >
                          <IconLinkedIn className="w-3 h-3" />
                          LinkedIn
                        </a>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-[rgba(255,255,255,0.2)] italic">No founders registered.</p>
                  )}
                </div>
                {company.team_size !== null && (
                  <div className="text-xs text-[rgba(255,255,255,0.3)] flex gap-2 pt-2 border-t border-[rgba(255,255,255,0.03)]">
                    <span className="font-medium text-white/60">Total team size:</span>
                    <span>{company.team_size} members</span>
                  </div>
                )}
              </div>
            </AnimatedCard>

            <AnimatedCard delay={0.3}>
              <div className="bg-[rgba(10,10,18,0.4)] backdrop-blur-xl border border-[rgba(255,255,255,0.03)] rounded-card p-5 space-y-4 hover:border-[rgba(255,255,255,0.05)] transition-all duration-500">
                <div className="flex justify-between items-center border-b border-[rgba(255,255,255,0.03)] pb-2.5">
                  <h3 className="text-sm font-semibold text-white">Stage & traction</h3>
                  {isOwner && (
                    <button className="text-[11px] font-semibold text-[rgba(255,255,255,0.3)] border border-[rgba(255,255,255,0.03)] hover:border-[rgba(0,229,255,0.1)] hover:text-[#00E5FF] px-2 py-0.5 rounded-[6px] transition-all duration-300 cursor-pointer select-none">
                      Edit
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                  <div className="bg-[rgba(255,255,255,0.01)] border border-[rgba(255,255,255,0.03)] rounded-card p-3 text-center">
                    <p className="text-[rgba(255,255,255,0.3)]">Current Stage</p>
                    <p className="text-base font-semibold text-white mt-1 capitalize">{company.stage}</p>
                  </div>
                  <div className="bg-[rgba(255,255,255,0.01)] border border-[rgba(255,255,255,0.03)] rounded-card p-3 text-center">
                    <p className="text-[rgba(255,255,255,0.3)]">Revenue</p>
                    <p className="text-base font-semibold text-white mt-1">
                      {company.revenue !== null
                        ? formatCurrency(company.revenue, company.revenue_currency || "USD")
                        : "Not provided"}
                    </p>
                  </div>
                  <div className="bg-[rgba(255,255,255,0.01)] border border-[rgba(255,255,255,0.03)] rounded-card p-3 text-center">
                    <p className="text-[rgba(255,255,255,0.3)]">Active Users</p>
                    <p className="text-base font-semibold text-white mt-1">
                      {company.active_users !== null
                        ? company.active_users.toLocaleString()
                        : "Not provided"}
                    </p>
                  </div>
                </div>
                {company.growth_rate && (
                  <div className="text-xs text-[rgba(255,255,255,0.3)] flex gap-2 pt-2 border-t border-[rgba(255,255,255,0.03)]">
                    <span className="font-medium text-white/60">Growth rate:</span>
                    <span>{company.growth_rate}</span>
                  </div>
                )}
              </div>
            </AnimatedCard>

          </div>

          <div className="space-y-6">
            
            {confirmedVouches.length > 0 && (
              <AnimatedCard delay={0.2}>
                <div className="bg-[rgba(10,10,18,0.4)] backdrop-blur-xl border border-[rgba(255,255,255,0.03)] rounded-card p-5 space-y-4 hover:border-[rgba(255,255,255,0.05)] transition-all duration-500">
                  <div className="border-b border-[rgba(255,255,255,0.03)] pb-2.5">
                    <h3 className="text-sm font-semibold text-white">Backed by</h3>
                  </div>
                  <div className="space-y-3">
                    {confirmedVouches.map((vouch) => (
                      <div
                        key={vouch.id}
                        className="bg-[rgba(255,255,255,0.01)] border border-[rgba(255,255,255,0.03)] rounded-[6px] p-3 text-xs space-y-1 text-left"
                      >
                        <p className="font-semibold text-white">
                          {vouch.firm_name}
                        </p>
                        <p className="text-[10px] text-[rgba(255,255,255,0.3)] capitalize">
                          Backed round: {vouch.round}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </AnimatedCard>
            )}

            <AnimatedCard delay={0.35}>
              <div className="bg-[rgba(10,10,18,0.4)] backdrop-blur-xl border border-[rgba(255,255,255,0.03)] rounded-card p-5 space-y-4 hover:border-[rgba(255,255,255,0.05)] transition-all duration-500">
                <div className="flex justify-between items-center border-b border-[rgba(255,255,255,0.03)] pb-2.5">
                  <h3 className="text-sm font-semibold text-white">Endorsements</h3>
                  {isOwner && (
                    <button className="text-[11px] font-semibold text-[rgba(255,255,255,0.3)] border border-[rgba(255,255,255,0.03)] hover:border-[rgba(0,229,255,0.1)] hover:text-[#00E5FF] px-2 py-0.5 rounded-[6px] transition-all duration-300 cursor-pointer select-none">
                      Edit
                    </button>
                  )}
                </div>
                
                <div className="space-y-1.5 text-xs">
                  <p className="text-[rgba(255,255,255,0.3)] font-medium">Incubator / Accelerator history</p>
                  {company.incubator && company.incubators && company.incubators.length > 0 ? (
                    <div className="flex flex-wrap gap-2 mt-1">
                      {company.incubators.map((name) => (
                        <span
                          key={name}
                          className="px-2 py-1 bg-[rgba(255,255,255,0.01)] border border-[rgba(255,255,255,0.03)] rounded-[6px] text-white font-medium text-xs"
                        >
                          {name}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-[rgba(255,255,255,0.2)] mt-1 font-light italic">No incubator listings reported.</p>
                  )}
                </div>

                <div className="space-y-1 text-xs pt-3 border-t border-[rgba(255,255,255,0.03)]">
                  <p className="text-[rgba(255,255,255,0.3)] font-medium font-semibold">Currently raising funds?</p>
                  <p className="text-sm font-medium text-white mt-1 capitalize">
                    {company.currently_raising === "yes"
                      ? "Yes, actively raising capital"
                      : company.currently_raising === "planning"
                      ? "Planning a fundraising round soon"
                      : "No active fundraising plans"}
                  </p>
                </div>
              </div>
            </AnimatedCard>

            <AnimatedCard delay={0.4}>
              <div className="bg-[rgba(10,10,18,0.4)] backdrop-blur-xl border border-[rgba(255,255,255,0.03)] rounded-card p-5 space-y-4 hover:border-[rgba(255,255,255,0.05)] transition-all duration-500">
                <div className="flex justify-between items-center border-b border-[rgba(255,255,255,0.03)] pb-2.5">
                  <h3 className="text-sm font-semibold text-white">External funding</h3>
                  {isOwner && (
                    <button className="text-[11px] font-semibold text-[rgba(255,255,255,0.3)] border border-[rgba(255,255,255,0.03)] hover:border-[rgba(0,229,255,0.1)] hover:text-[#00E5FF] px-2 py-0.5 rounded-[6px] transition-all duration-300 cursor-pointer select-none">
                      Edit
                    </button>
                  )}
                </div>

                {company.externally_funded && company.investors && company.investors.length > 0 ? (
                  <div className="space-y-3">
                    {company.investors.map((round, index) => (
                      <div
                        key={index}
                        className="bg-[rgba(255,255,255,0.01)] border border-[rgba(255,255,255,0.03)] rounded-card p-3 text-xs space-y-1.5"
                      >
                        <div className="flex justify-between items-center font-medium">
                          <span className="text-white">{round.round}</span>
                          <span className="text-[#00E5FF]">
                            {formatCurrency(round.amount, round.currency)}
                          </span>
                        </div>
                        <div className="flex justify-between text-[10px] text-[rgba(255,255,255,0.3)]">
                          <span>{round.name}</span>
                          <span>{round.date}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-[rgba(255,255,255,0.2)] italic">No external investment rounds declared.</p>
                )}
              </div>
            </AnimatedCard>

          </div>

        </div>

        {timelineEvents.length > 0 && (
          <AnimatedCard delay={0.45} className="bg-[rgba(10,10,18,0.4)] backdrop-blur-xl border border-[rgba(255,255,255,0.03)] rounded-card p-6 space-y-4 hover:border-[rgba(255,255,255,0.05)] transition-all duration-500">
            <div>
              <h2 className="text-xl font-medium tracking-tight text-white">
                Verification Ledger
              </h2>
              <p className="text-xs text-[rgba(255,255,255,0.3)] mt-1.5 leading-relaxed max-w-3xl">
                Every verification event is recorded automatically by the database, not by application code. 
                Each entry is sealed with a SHA-256 hash that includes the previous entry's hash, so altering 
                any past record breaks every record after it. The ledger is append-only — no user, including 
                administrators, can edit or delete an entry. This cryptographic chaining protects against silent data corruption and unauthorized modifications, though it does not prevent an operator with direct table-write access from recalculating the chain.
              </p>
            </div>

            <div className="border border-[rgba(255,255,255,0.03)] rounded-card overflow-hidden">
              <div className="divide-y divide-[rgba(255,255,255,0.02)]">
                {timelineEvents.map((event) => {
                  const isHashExpanded = expandedHashEventId === event.id;
                  const rawHash = event.hash || "";
                  const displayHash = isHashExpanded ? rawHash : `${rawHash.substring(0, 10)}...`;

                  return (
                    <div
                      key={event.id}
                      className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[rgba(255,255,255,0.01)] hover:bg-[rgba(255,255,255,0.02)] transition-colors duration-300 text-left"
                    >
                      <div className="space-y-1">
                        <p className="font-semibold text-white text-sm">
                          {event.formatted_label}
                        </p>
                        <p className="text-[10px] text-[rgba(255,255,255,0.2)]">
                          {new Date(event.created_at).toLocaleString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                            hour: "numeric",
                            minute: "2-digit",
                            second: "2-digit",
                            hour12: true
                          })}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1.5 text-[10px] text-[rgba(255,255,255,0.2)] font-mono bg-[rgba(255,255,255,0.01)] border border-[rgba(255,255,255,0.03)] px-2 py-0.5 rounded">
                          <IconHash className="w-3 h-3" />
                          <span>{displayHash}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => setExpandedHashEventId(isHashExpanded ? null : event.id)}
                          className="text-[10px] font-semibold text-[rgba(255,255,255,0.3)] hover:text-[#00E5FF] transition-colors duration-300 cursor-pointer select-none"
                        >
                          {isHashExpanded ? "Collapse" : "Show full"}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </AnimatedCard>
        )}

        {isOwner && (
          <AnimatedCard delay={0.5} className="bg-[rgba(10,10,18,0.4)] backdrop-blur-xl border border-[rgba(255,255,255,0.03)] rounded-card p-6 space-y-3 hover:border-[rgba(255,255,255,0.05)] transition-all duration-500">
            <h3 className="text-base font-semibold text-white">
              Suggestions to build your credibility profile
            </h3>
            <p className="text-xs text-[rgba(255,255,255,0.3)] leading-relaxed max-w-2xl">
              Based on the credentials you submitted, here are some actionable recommendations to strengthen your profile verify tier.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-3">
              <div className="border border-[rgba(200,164,81,0.1)] rounded-card p-3 bg-[rgba(200,164,81,0.02)] flex gap-2.5 text-xs text-white">
                <div className="w-5 h-5 bg-[rgba(200,164,81,0.05)] border border-[rgba(200,164,81,0.1)] rounded-full flex items-center justify-center text-[#C8A451] flex-shrink-0 mt-0.5">
                  <IconInfo className="w-3 h-3" />
                </div>
                <div>
                  <p className="font-semibold text-[#C8A451]">Provide revenue verification proof</p>
                  <p className="text-[rgba(255,255,255,0.3)] mt-0.5 font-light">
                    Your Traction metrics are self-reported. Consider connecting official audit sheets or accounting platform tokens during review.
                  </p>
                </div>
              </div>

              <div className="border border-[rgba(200,164,81,0.1)] rounded-card p-3 bg-[rgba(200,164,81,0.02)] flex gap-2.5 text-xs text-white">
                <div className="w-5 h-5 bg-[rgba(200,164,81,0.05)] border border-[rgba(200,164,81,0.1)] rounded-full flex items-center justify-center text-[#C8A451] flex-shrink-0 mt-0.5">
                  <IconInfo className="w-3 h-3" />
                </div>
                <div>
                  <p className="font-semibold text-[#C8A451]">Validate founder identities</p>
                  <p className="text-[rgba(255,255,255,0.3)] mt-0.5 font-light">
                    Your founders claim is self-reported. The review team will verify LinkedIn profiles once your registration starts processing.
                  </p>
                </div>
              </div>
            </div>
          </AnimatedCard>
        )}
        
      </main>

      {showVouchModal && (
        <div className="fixed inset-0 bg-[#030305]/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-100">
          <div className="bg-[rgba(10,10,18,0.9)] backdrop-blur-xl border border-[rgba(255,255,255,0.05)] rounded-card p-6 md:p-8 shadow-[0_8px_60px_rgba(0,0,0,0.6)] max-w-md w-full max-h-[90vh] overflow-y-auto space-y-6 animate-in zoom-in-95 duration-150 text-left">
            {vouchSuccess ? (
              <div className="space-y-6 text-center animate-in fade-in duration-200">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-[rgba(0,255,163,0.05)] border border-[rgba(0,255,163,0.1)] text-[#00FFA3]">
                  <IconCheck className="w-7 h-7" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-medium text-white">Backing Recorded</h3>
                  <p className="text-sm text-[rgba(255,255,255,0.4)] leading-relaxed">
                    Recorded. The founder will be asked to confirm this backing.
                  </p>
                </div>
                <div className="pt-2 flex flex-col gap-2">
                  <Link
                    href="/dashboard"
                    className="w-full h-9 bg-gradient-to-r from-[#00E5FF] to-[#7000FF] text-white rounded-button text-sm font-medium transition-all duration-300 hover:shadow-[0_0_30px_rgba(0,229,255,0.15)] cursor-pointer select-none flex items-center justify-center"
                  >
                    Go to Dashboard
                  </Link>
                  <button
                    type="button"
                    onClick={() => {
                      setShowVouchModal(false);
                      setVouchSuccess(false);
                    }}
                    className="w-full h-9 border border-[rgba(255,255,255,0.05)] hover:bg-[rgba(255,255,255,0.02)] text-white rounded-button text-sm font-medium transition-all duration-300 cursor-pointer select-none"
                  >
                    Close
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="border-b border-[rgba(255,255,255,0.03)] pb-3">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-medium text-white">Record Your Backing</h3>
                    <button
                      type="button"
                      onClick={() => setShowVouchModal(false)}
                      className="text-[rgba(255,255,255,0.2)] hover:text-white transition-colors duration-300 cursor-pointer"
                      aria-label="Close modal"
                    >
                      <IconX className="w-5 h-5" />
                    </button>
                  </div>
                  <p className="text-[11px] text-[rgba(255,255,255,0.3)] mt-1.5 leading-relaxed font-light">
                    Note: Your firm name (or profile type if angel) will appear publicly on the company profile once this backing is confirmed by the founder and reviewed.
                  </p>
                </div>

                {vouchErrors.general && (
                  <div className="p-3 rounded-lg bg-[rgba(255,68,68,0.05)] border border-[rgba(255,68,68,0.15)] text-[#FF4444] text-xs font-medium">
                    {vouchErrors.general}
                  </div>
                )}

                <form onSubmit={handleVouchSubmit} className="space-y-4">
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="vouch_round" className="text-xs font-semibold text-white/80">
                      Round <span className="text-[#00E5FF]">*</span>
                    </label>
                    <input
                      id="vouch_round"
                      type="text"
                      placeholder="e.g. Seed, Pre-Series A"
                      value={vouchRound}
                      onChange={(e) => {
                        setVouchRound(e.target.value);
                        setVouchErrors((prev) => ({ ...prev, round: "" }));
                      }}
                      className="h-9 w-full border border-[rgba(255,255,255,0.05)] bg-[rgba(10,10,18,0.4)] text-white rounded-button px-3 text-sm placeholder:text-[rgba(255,255,255,0.2)] focus:outline-hidden focus:ring-1 focus:ring-[#00E5FF] focus:border-[#00E5FF] transition-all duration-300 hover:border-[rgba(255,255,255,0.1)]"
                    />
                    {vouchErrors.round && (
                      <span className="text-xs text-[#FF4444] mt-0.5">{vouchErrors.round}</span>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="vouch_amount" className="text-xs font-semibold text-white/80">
                        Amount
                      </label>
                      <input
                        id="vouch_amount"
                        type="number"
                        placeholder="e.g. 500000"
                        value={vouchAmount}
                        onChange={(e) => setVouchAmount(e.target.value)}
                        className="h-9 w-full border border-[rgba(255,255,255,0.05)] bg-[rgba(10,10,18,0.4)] text-white rounded-button px-3 text-sm placeholder:text-[rgba(255,255,255,0.2)] focus:outline-hidden focus:ring-1 focus:ring-[#00E5FF] focus:border-[#00E5FF] transition-all duration-300 hover:border-[rgba(255,255,255,0.1)]"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="vouch_currency" className="text-xs font-semibold text-white/80">
                        Currency
                      </label>
                      <select
                        id="vouch_currency"
                        value={vouchCurrency}
                        onChange={(e) => setVouchCurrency(e.target.value)}
                        className="h-9 w-full border border-[rgba(255,255,255,0.05)] bg-[rgba(10,10,18,0.4)] text-white rounded-button px-3 text-sm focus:outline-hidden focus:ring-1 focus:ring-[#00E5FF] focus:border-[#00E5FF] transition-all duration-300 hover:border-[rgba(255,255,255,0.1)]"
                      >
                        <option value="INR" className="bg-[#030305]">INR</option>
                        <option value="USD" className="bg-[#030305]">USD</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="vouch_date" className="text-xs font-semibold text-white/80">
                      Date invested
                    </label>
                    <input
                      id="vouch_date"
                      type="date"
                      value={vouchInvestedOn}
                      onChange={(e) => setVouchInvestedOn(e.target.value)}
                      className="h-9 w-full border border-[rgba(255,255,255,0.05)] bg-[rgba(10,10,18,0.4)] text-white rounded-button px-3 text-sm focus:outline-hidden focus:ring-1 focus:ring-[#00E5FF] focus:border-[#00E5FF] transition-all duration-300 hover:border-[rgba(255,255,255,0.1)]"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="vouch_note" className="text-xs font-semibold text-white/80">
                      Investor note
                    </label>
                    <textarea
                      id="vouch_note"
                      placeholder="Anything the founder or reviewer should know."
                      maxLength={300}
                      rows={3}
                      value={vouchInvestorNote}
                      onChange={(e) => setVouchInvestorNote(e.target.value)}
                      className="w-full border border-[rgba(255,255,255,0.05)] bg-[rgba(10,10,18,0.4)] text-white rounded-button p-3 text-sm placeholder:text-[rgba(255,255,255,0.2)] focus:outline-hidden focus:ring-1 focus:ring-[#00E5FF] focus:border-[#00E5FF] transition-all duration-300 hover:border-[rgba(255,255,255,0.1)] resize-none font-sans"
                    />
                    <span className="text-[10px] text-[rgba(255,255,255,0.15)] text-right">
                      {vouchInvestorNote.length}/300 chars
                    </span>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-white/80">
                      Proof document
                    </label>
                    
                    {vouchProofFilename ? (
                      <div className="flex items-center justify-between border border-[rgba(255,255,255,0.05)] rounded-button bg-[rgba(10,10,18,0.4)] p-3 text-sm text-white">
                        <span className="truncate font-medium text-xs">{vouchProofFilename}</span>
                        <button
                          type="button"
                          onClick={() => setVouchProofFilename(null)}
                          className="text-xs text-[rgba(255,255,255,0.2)] hover:text-[#00E5FF] font-medium cursor-pointer transition-colors"
                        >
                          Remove
                        </button>
                      </div>
                    ) : (
                      <label className="flex flex-col items-center justify-center border border-dashed border-[rgba(255,255,255,0.05)] hover:border-[rgba(0,229,255,0.2)] rounded-button bg-[rgba(255,255,255,0.01)] p-4 text-center cursor-pointer group transition-all duration-300">
                        <svg className="w-5 h-5 text-[rgba(255,255,255,0.15)] group-hover:text-[#00E5FF] transition-colors duration-300 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                        <span className="text-xs text-white/60 font-medium group-hover:text-white transition-colors duration-300">Select proof file</span>
                        <span className="text-[10px] text-[rgba(255,255,255,0.15)] mt-0.5">Filename will be stored locally</span>
                        <input
                          type="file"
                          className="hidden"
                          onChange={(e) => {
                            if (e.target.files && e.target.files[0]) {
                              setVouchProofFilename(e.target.files[0].name);
                            }
                          }}
                        />
                      </label>
                    )}
                  </div>

                  <div className="pt-2 flex gap-3">
                    <button
                      type="button"
                      onClick={() => setShowVouchModal(false)}
                      className="flex-1 h-9 border border-[rgba(255,255,255,0.05)] hover:bg-[rgba(255,255,255,0.02)] text-white rounded-button text-sm font-medium transition-all duration-300 cursor-pointer select-none text-center"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={vouchSubmitting}
                      className="flex-1 h-9 bg-gradient-to-r from-[#00E5FF] to-[#7000FF] text-white rounded-button text-sm font-medium transition-all duration-300 hover:shadow-[0_0_30px_rgba(0,229,255,0.15)] cursor-pointer select-none flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {vouchSubmitting ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span>Recording...</span>
                        </>
                      ) : (
                        <span>Record Backing</span>
                      )}
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}