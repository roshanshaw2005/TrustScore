"use client";

import React, { useState, useEffect, Suspense, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { createClient } from "@/lib/supabase/client";
import { User } from "@supabase/supabase-js";
import { InvestorType } from "@/types/investor";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { PerspectiveCamera, Float, Sphere, Ring, Torus, MeshDistortMaterial, Sparkles } from "@react-three/drei";
import * as THREE from "three";
import { motion } from "framer-motion";

const InvestorScene = () => {
  const meshRef = useRef<THREE.Mesh>(null!);
  const { mouse } = useThree();

  useFrame((state) => {
    if (meshRef.current) {
      const x = (mouse.x - 0) * 0.2;
      const y = (mouse.y - 0) * 0.15;
      meshRef.current.rotation.x += (y - meshRef.current.rotation.x) * 0.02;
      meshRef.current.rotation.y += (x - meshRef.current.rotation.y) * 0.02;
      const time = state.clock.getElapsedTime();
      meshRef.current.position.y = Math.sin(time * 0.3) * 0.1;
    }
  });

  return (
    <group>
      <Float speed={1.2} rotationIntensity={0.15} floatIntensity={0.3}>
        <mesh ref={meshRef} scale={1.6}>
          <octahedronGeometry args={[1, 0]} />
          <MeshDistortMaterial
            color="#7000FF"
            metalness={0.9}
            roughness={0.05}
            clearcoat={1}
            clearcoatRoughness={0.05}
            transparent
            opacity={0.3}
            distort={0.25}
            speed={0.4}
            emissive="#7000FF"
            emissiveIntensity={0.1}
          />
        </mesh>
      </Float>
      <Ring args={[2.2, 2.4, 64]} rotation={[Math.PI / 2, 0, 0]}>
        <meshPhysicalMaterial color="#00E5FF" emissive="#00E5FF" emissiveIntensity={0.05} transparent opacity={0.12} metalness={0.8} roughness={0.2} />
      </Ring>
      <Ring args={[2.6, 2.8, 64]} rotation={[Math.PI / 3, 0.2, 0]}>
        <meshPhysicalMaterial color="#00FFA3" emissive="#00FFA3" emissiveIntensity={0.04} transparent opacity={0.08} metalness={0.8} roughness={0.2} />
      </Ring>
      <Sparkles count={60} scale={[6, 6, 6]} size={0.015} speed={0.2} color="#7000FF" opacity={0.25} />
      <Sparkles count={30} scale={[6, 6, 6]} size={0.01} speed={0.15} color="#00E5FF" opacity={0.15} />
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
       <bufferAttribute 
   attach="attributes-position" 
   count={count} 
   array={positions} 
   itemSize={3} 
   args={[positions, 3]}  
/>
      </bufferGeometry>
      <pointsMaterial size={0.015} transparent opacity={0.15} color="#7000FF" sizeAttenuation />
    </points>
  );
};

const InvestorBackground = () => {
  return (
    <div className="fixed inset-0 -z-10 pointer-events-none">
      <Canvas style={{ background: "#030305" }} dpr={[1, 2]}>
        <PerspectiveCamera makeDefault position={[0, 0, 7]} fov={45} />
        <ambientLight intensity={0.2} color="#7000FF" />
        <directionalLight position={[5, 5, 5]} intensity={0.5} color="#00E5FF" />
        <directionalLight position={[-5, -2, 5]} intensity={0.3} color="#7000FF" />
        <pointLight position={[0, 0, 3]} intensity={0.4} color="#00FFA3" />
        <BackgroundParticles />
        <InvestorScene />
      </Canvas>
    </div>
  );
};

const IconUser = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.59 14.37a6 6 0 0 1-5.84 0M8 21.75h8M12 18v3.75m0-16.5c-3.17 0-5.75 2.58-5.75 5.75S9.12 16.5 12 16.5s5.75-2.58 5.75-5.75-2.58-5.75-5.75-5.75Z" />
  </svg>
);

const IconMail = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
  </svg>
);

const IconBuilding = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 21V6.75a.75.75 0 0 1 .75-.75h13.5a.75.75 0 0 1 .75.75V21m-6.75-15v15m-3-15v15m-3-15v15m6.75-15v15" />
  </svg>
);

const IconGlobe = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18ZM2.25 12h19.5M12 2.25a15.75 15.75 0 0 1 6.25 12 15.75 15.75 0 0 1-6.25 12 15.75 15.75 0 0 1-6.25-12 15.75 15.75 0 0 1 6.25-12Z" />
  </svg>
);

const IconLinkedIn = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const IconCheck = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="2.5 6 4.5 8 9.5 3.5" />
  </svg>
);

const IconAlert = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
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
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: [0.23, 1, 0.32, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

function InvestorRegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [dbError, setDbError] = useState("");
  const [isEdit, setIsEdit] = useState(false);

  const [investorType, setInvestorType] = useState<InvestorType | "">("");
  const [firmName, setFirmName] = useState("");
  const [firmWebsite, setFirmWebsite] = useState("");
  const [linkedinUrl, setLinkedinUrl] = useState("");

  const [errors, setErrors] = useState({
    investorType: "",
    firmName: "",
    linkedinUrl: "",
    firmWebsite: "",
  });

  const noticeKey = searchParams.get("notice");
  let noticeMessage = "";
  if (noticeKey === "profile_required") {
    noticeMessage = "Complete your profile before recording a backing.";
  }

  useEffect(() => {
    async function checkAuthAndPrefill() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          router.push("/auth");
          return;
        }

        const userRole = user.user_metadata?.role || user.user_metadata?.user_type;
        if (userRole !== "investor") {
          router.push("/dashboard");
          return;
        }

        setUser(user);

        const { data, error } = await supabase
          .from("investor_profiles")
          .select("investor_type, firm_name, firm_website, linkedin_url")
          .eq("user_id", user.id)
          .maybeSingle();

        if (error) {
          setDbError("Failed to check for an existing profile. Please refresh.");
        } else if (data) {
          setInvestorType(data.investor_type || "");
          setFirmName(data.firm_name || "");
          setFirmWebsite(data.firm_website || "");
          setLinkedinUrl(data.linkedin_url || "");
          setIsEdit(true);
        }
      } catch (err: any) {
        setDbError(err.message || "An unexpected error occurred during initialization.");
      } finally {
        setLoading(false);
      }
    }

    checkAuthAndPrefill();
  }, [router, supabase]);

  const handleInvestorTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value as InvestorType | "";
    setInvestorType(val);
    if (val === "angel") {
      setFirmName("");
      setErrors((prev) => ({ ...prev, firmName: "" }));
    }
    setErrors((prev) => ({ ...prev, investorType: "" }));
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      investorType: "",
      firmName: "",
      linkedinUrl: "",
      firmWebsite: "",
    };

    if (!investorType) {
      newErrors.investorType = "Investor type is required.";
      isValid = false;
    }

    if (investorType && investorType !== "angel" && !firmName.trim()) {
      newErrors.firmName = "Firm name is required.";
      isValid = false;
    }

    const trimmedLinkedin = linkedinUrl.trim();
    if (!trimmedLinkedin) {
      newErrors.linkedinUrl = "LinkedIn URL is required.";
      isValid = false;
    } else if (
      !trimmedLinkedin.includes("linkedin.com/in/") &&
      !trimmedLinkedin.includes("linkedin.com/company/")
    ) {
      newErrors.linkedinUrl =
        "LinkedIn URL must contain linkedin.com/in/ or linkedin.com/company/.";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) return;
    if (!validateForm()) return;

    setSubmitLoading(true);
    setDbError("");

    const payload = {
      user_id: user.id,
      investor_type: investorType,
      firm_name: investorType === "angel" ? null : firmName.trim(),
      firm_website: firmWebsite.trim() || null,
      linkedin_url: linkedinUrl.trim(),
      updated_at: new Date().toISOString(),
    };

    try {
      const { error } = await supabase
        .from("investor_profiles")
        .upsert(payload, { onConflict: "user_id" });

      if (error) {
        setDbError(error.message);
      } else {
        router.push("/dashboard");
      }
    } catch (err: any) {
      setDbError(err.message || "Failed to save profile. Please try again.");
    } finally {
      setSubmitLoading(false);
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

  const displayName = user.user_metadata?.display_name || user.email || "";

  return (
    <div className="min-h-screen flex flex-col bg-[#030305] text-white overflow-x-hidden">
      <InvestorBackground />
      <div className="fixed inset-0 -z-5 bg-gradient-to-b from-[#030305]/60 via-transparent to-[#030305]/80 pointer-events-none" />

      <Navbar />

      <main className="relative z-10 flex-1 w-full max-w-[1200px] mx-auto px-4 md:px-6 py-12 flex flex-col items-center justify-center gap-8">
        <div className="w-full max-w-lg space-y-6">
          <AnimatedCard>
            <div className="text-center space-y-1">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[rgba(112,0,255,0.05)] border border-[rgba(112,0,255,0.1)] rounded-full text-[11px] font-medium text-[#7000FF] select-none tracking-tight mb-4"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#7000FF] animate-pulse" />
                Investor Profile
              </motion.div>
              <h1 className="text-3xl font-medium tracking-tight text-white">
                {isEdit ? "Edit Your Profile" : "Complete Your Profile"}
              </h1>
              <p className="text-sm text-[rgba(255,255,255,0.4)]">
                Update your investor profile credentials for validation.
              </p>
            </div>
          </AnimatedCard>

          {noticeMessage && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-full bg-[rgba(0,229,255,0.03)] border border-[rgba(0,229,255,0.08)] rounded-card p-4 text-[rgba(255,255,255,0.4)] text-sm text-center"
            >
              {noticeMessage}
            </motion.div>
          )}

          <AnimatedCard delay={0.1}>
            <div className="w-full bg-[rgba(10,10,18,0.6)] backdrop-blur-xl border border-[rgba(255,255,255,0.05)] rounded-card p-6 md:p-8 space-y-6 hover:border-[rgba(112,0,255,0.1)] transition-all duration-500">
              <div className="border-b border-[rgba(255,255,255,0.03)] pb-4 space-y-2">
                <span className="text-[10px] uppercase tracking-wider font-semibold text-[rgba(255,255,255,0.2)] block font-mono">
                  Account context
                </span>
                <div className="grid grid-cols-2 gap-4 text-sm bg-[rgba(255,255,255,0.02)] p-3 rounded-button border border-[rgba(255,255,255,0.03)]">
                  <div className="flex items-center gap-2">
                    <IconUser className="w-4 h-4 text-[rgba(255,255,255,0.15)]" />
                    <div>
                      <p className="text-[10px] text-[rgba(255,255,255,0.2)]">Full Name</p>
                      <p className="font-medium text-white truncate">{displayName}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <IconMail className="w-4 h-4 text-[rgba(255,255,255,0.15)]" />
                    <div>
                      <p className="text-[10px] text-[rgba(255,255,255,0.2)]">Email Address</p>
                      <p className="font-medium text-white truncate">{user.email}</p>
                    </div>
                  </div>
                </div>
              </div>

              {dbError && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="w-full p-4 rounded-lg bg-[rgba(255,68,68,0.05)] border border-[rgba(255,68,68,0.15)] text-[#FF4444] text-sm font-medium flex items-center gap-2"
                >
                  <IconAlert className="w-4 h-4" />
                  {dbError}
                </motion.div>
              )}

              <form onSubmit={handleSave} className="space-y-5">
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="investor_type" className="text-xs font-semibold text-white/80">
                    Investor type <span className="text-[#7000FF]">*</span>
                  </label>
                  <select
                    id="investor_type"
                    value={investorType}
                    onChange={handleInvestorTypeChange}
                    className="h-10 w-full border border-[rgba(255,255,255,0.05)] bg-[rgba(10,10,18,0.4)] text-white rounded-button px-3 text-sm focus:outline-hidden focus:ring-1 focus:ring-[#7000FF] focus:border-[#7000FF] transition-all duration-300 hover:border-[rgba(255,255,255,0.1)]"
                  >
                    <option value="" className="bg-[#030305]">Select type</option>
                    <option value="angel" className="bg-[#030305]">Angel</option>
                    <option value="vc" className="bg-[#030305]">VC</option>
                    <option value="family_office" className="bg-[#030305]">Family Office</option>
                    <option value="syndicate" className="bg-[#030305]">Syndicate</option>
                    <option value="corporate" className="bg-[#030305]">Corporate</option>
                  </select>
                  {errors.investorType && (
                    <span className="text-xs text-[#FF4444] mt-0.5">{errors.investorType}</span>
                  )}
                </div>

                {investorType && investorType !== "angel" && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col gap-1.5"
                  >
                    <label htmlFor="firm_name" className="text-xs font-semibold text-white/80">
                      Firm name <span className="text-[#7000FF]">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[rgba(255,255,255,0.15)]">
                        <IconBuilding className="w-4 h-4" />
                      </div>
                      <input
                        id="firm_name"
                        type="text"
                        placeholder="e.g. Ascent Capital Partners"
                        value={firmName}
                        onChange={(e) => {
                          setFirmName(e.target.value);
                          setErrors((prev) => ({ ...prev, firmName: "" }));
                        }}
                        className="h-10 w-full border border-[rgba(255,255,255,0.05)] bg-[rgba(10,10,18,0.4)] text-white rounded-button px-3 pl-9 text-sm placeholder:text-[rgba(255,255,255,0.2)] focus:outline-hidden focus:ring-1 focus:ring-[#7000FF] focus:border-[#7000FF] transition-all duration-300 hover:border-[rgba(255,255,255,0.1)]"
                      />
                    </div>
                    {errors.firmName && (
                      <span className="text-xs text-[#FF4444] mt-0.5">{errors.firmName}</span>
                    )}
                  </motion.div>
                )}

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="linkedin_url" className="text-xs font-semibold text-white/80">
                    LinkedIn URL <span className="text-[#7000FF]">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[rgba(255,255,255,0.15)]">
                      <IconLinkedIn className="w-4 h-4" />
                    </div>
                    <input
                      id="linkedin_url"
                      type="url"
                      placeholder="e.g. https://www.linkedin.com/in/username"
                      value={linkedinUrl}
                      onChange={(e) => {
                        setLinkedinUrl(e.target.value);
                        setErrors((prev) => ({ ...prev, linkedinUrl: "" }));
                      }}
                      className="h-10 w-full border border-[rgba(255,255,255,0.05)] bg-[rgba(10,10,18,0.4)] text-white rounded-button px-3 pl-9 text-sm placeholder:text-[rgba(255,255,255,0.2)] focus:outline-hidden focus:ring-1 focus:ring-[#7000FF] focus:border-[#7000FF] transition-all duration-300 hover:border-[rgba(255,255,255,0.1)]"
                    />
                  </div>
                  {errors.linkedinUrl && (
                    <span className="text-xs text-[#FF4444] mt-0.5">{errors.linkedinUrl}</span>
                  )}
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="firm_website" className="text-xs font-semibold text-white/80">
                    Firm website
                  </label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[rgba(255,255,255,0.15)]">
                      <IconGlobe className="w-4 h-4" />
                    </div>
                    <input
                      id="firm_website"
                      type="url"
                      placeholder="e.g. https://ascentcap.com"
                      value={firmWebsite}
                      onChange={(e) => {
                        setFirmWebsite(e.target.value);
                        setErrors((prev) => ({ ...prev, firmWebsite: "" }));
                      }}
                      className="h-10 w-full border border-[rgba(255,255,255,0.05)] bg-[rgba(10,10,18,0.4)] text-white rounded-button px-3 pl-9 text-sm placeholder:text-[rgba(255,255,255,0.2)] focus:outline-hidden focus:ring-1 focus:ring-[#7000FF] focus:border-[#7000FF] transition-all duration-300 hover:border-[rgba(255,255,255,0.1)]"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={submitLoading}
                    className="w-full h-10 bg-gradient-to-r from-[#7000FF] to-[#00E5FF] text-white rounded-button text-sm font-medium transition-all duration-300 hover:shadow-[0_0_40px_rgba(112,0,255,0.2)] cursor-pointer select-none flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {submitLoading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Saving Profile...</span>
                      </>
                    ) : (
                      <span>Save Profile</span>
                    )}
                  </motion.button>
                </div>
              </form>

              <p className="text-[10px] text-[rgba(255,255,255,0.15)] text-center font-mono">
                Your profile is private. It's shown only to TrustScore reviewers when you record a backing.
              </p>
            </div>
          </AnimatedCard>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function InvestorRegisterPage() {
  return (
    <Suspense
      fallback={
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
      }
    >
      <InvestorRegisterForm />
    </Suspense>
  );
}