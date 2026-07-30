"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { createClient } from "@/lib/supabase/client";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { PerspectiveCamera, Float, Sparkles, Torus, MeshDistortMaterial } from "@react-three/drei";
import * as THREE from "three";
import { motion } from "framer-motion";

const RegisterScene = () => {
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
      <mesh ref={meshRef} scale={1.6}>
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
      <Torus args={[2.2, 0.015, 16, 100]} rotation={[Math.PI / 2, 0, 0]}>
        <meshPhysicalMaterial color="#7000FF" emissive="#7000FF" emissiveIntensity={0.08} transparent opacity={0.1} metalness={0.8} roughness={0.2} />
      </Torus>
      <Torus args={[2.6, 0.01, 16, 100]} rotation={[Math.PI / 3, 0.15, 0]}>
        <meshPhysicalMaterial color="#00FFA3" emissive="#00FFA3" emissiveIntensity={0.06} transparent opacity={0.06} metalness={0.8} roughness={0.2} />
      </Torus>
    </group>
  );
};

const RegisterBackground = () => {
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
        <RegisterScene />
        <Sparkles count={60} scale={[8, 8, 8]} size={0.015} speed={0.2} color="#00E5FF" opacity={0.2} />
        <Sparkles count={30} scale={[8, 8, 8]} size={0.01} speed={0.15} color="#7000FF" opacity={0.15} />
      </Canvas>
    </div>
  );
};

const IconCheck = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const IconFile = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);

const IconUpload = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
  </svg>
);

const IconCheckSmall = ({ className = "w-3 h-3" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="2.5 6 4.5 8 9.5 3.5" />
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

interface FormStep {
  title: string;
  description: string;
}

const STEPS: FormStep[] = [
  { title: "Basics", description: "Enter your startup's core registration details." },
  { title: "Founders", description: "Who is building this company?" },
  { title: "Stage & traction", description: "Where are you on the startup path?" },
  { title: "Endorsements", description: "Incubators, external funding, and raising plans." },
  { title: "Evidence", description: "Upload supporting documents to verify claims." },
  { title: "Consent", description: "Configure visibility for your computed TrustScore." },
];

interface FounderEntry {
  name: string;
  linkedin: string;
}

interface FundingEntry {
  investorName: string;
  amount: string;
  currency: string;
  round: string;
  date: string;
}

export default function RegisterPage() {
  const router = useRouter();
  const supabase = createClient();

  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [dbError, setDbError] = useState("");
  const [ownerId, setOwnerId] = useState("");

  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    async function checkAuth() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/auth?mode=signin");
      } else {
        const userRole = user.user_metadata?.role || user.user_metadata?.user_type;
        if (userRole !== "founder") {
          router.push("/dashboard");
        } else {
          setOwnerId(user.id);
          setLoading(false);
        }
      }
    }
    checkAuth();
  }, [router, supabase]);

  const renderFileInput = (
    label: string,
    file: File | null,
    setFile: (f: File | null) => void,
    id: string
  ) => {
    return (
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-semibold text-white/80">
          {label}
        </label>
        
        {file ? (
          <div className="flex items-center justify-between border border-[rgba(255,255,255,0.05)] rounded-button bg-[rgba(255,255,255,0.02)] p-3 text-sm text-white animate-in fade-in duration-100">
            <div className="flex items-center gap-2 truncate">
              <IconFile className="w-4 h-4 text-[rgba(255,255,255,0.2)] flex-shrink-0" />
              <span className="truncate font-medium">{file.name}</span>
              <span className="text-[10px] text-[rgba(255,255,255,0.2)]">({(file.size / 1024).toFixed(1)} KB)</span>
            </div>
            <button
              type="button"
              onClick={() => setFile(null)}
              className="text-xs text-[rgba(255,255,255,0.2)] hover:text-[#00E5FF] font-medium cursor-pointer transition-colors"
            >
              Remove
            </button>
          </div>
        ) : (
          <label className="flex flex-col items-center justify-center border border-dashed border-[rgba(255,255,255,0.05)] hover:border-[rgba(0,229,255,0.2)] rounded-button bg-[rgba(255,255,255,0.01)] p-6 text-center cursor-pointer group transition-all duration-300">
            <IconUpload className="w-6 h-6 text-[rgba(255,255,255,0.15)] group-hover:text-[#00E5FF] transition-colors duration-300 mb-2" />
            <span className="text-xs text-white/60 font-medium group-hover:text-white transition-colors duration-300">
              Click to select or drag file here
            </span>
            <span className="text-[10px] text-[rgba(255,255,255,0.15)] mt-1">
              Supports PDF, PNG, JPG, Word, Excel, PowerPoint
            </span>
            <input
              type="file"
              id={id}
              className="hidden"
              accept=".pdf,.png,.jpg,.jpeg,.doc,.docx,.xls,.xlsx,.ppt,.pptx"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  setFile(e.target.files[0]);
                }
              }}
            />
          </label>
        )}
      </div>
    );
  };

  const [startupName, setStartupName] = useState("");
  const [cin, setCin] = useState("");
  const [legalStatus, setLegalStatus] = useState("");
  const [foundedDate, setFoundedDate] = useState("");
  const [sector, setSector] = useState("");
  const [description, setDescription] = useState("");
  const [website, setWebsite] = useState("");

  const [founders, setFounders] = useState<FounderEntry[]>([{ name: "", linkedin: "" }]);
  const [teamSize, setTeamSize] = useState("");

  const [stage, setStage] = useState("");
  const [revenueAmount, setRevenueAmount] = useState("");
  const [revenueCurrency, setRevenueCurrency] = useState("USD");
  const [activeUsers, setActiveUsers] = useState("");
  const [growthRate, setGrowthRate] = useState("");

  const [isIncubated, setIsIncubated] = useState<"yes" | "no" | "">("");
  const [incubatorNames, setIncubatorNames] = useState<string[]>([""]);
  const [isFunded, setIsFunded] = useState<"yes" | "no" | "">("");
  const [fundingDetails, setFundingDetails] = useState<FundingEntry[]>([
    { investorName: "", amount: "", currency: "USD", round: "Seed", date: "" },
  ]);
  const [isRaising, setIsRaising] = useState("");

  const [coiFile, setCoiFile] = useState<File | null>(null);
  const [financialsFile, setFinancialsFile] = useState<File | null>(null);
  const [pitchDeckFile, setPitchDeckFile] = useState<File | null>(null);
  const [capTableFile, setCapTableFile] = useState<File | null>(null);

  const [consentPublic, setConsentPublic] = useState(false);

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

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

  const validateUrl = (url: string) => {
    if (!url) return true;
    return url.startsWith("http://") || url.startsWith("https://") || url.includes(".");
  };

  const validateLinkedIn = (url: string) => {
    if (!url) return false;
    return (url.startsWith("http://") || url.startsWith("https://")) && url.includes("linkedin.com");
  };

  const validateCurrentStep = (): boolean => {
    const stepErrors: { [key: string]: string } = {};

    if (currentStep === 0) {
      if (!startupName.trim()) stepErrors.startupName = "Registered start-up name is required.";
      if (!cin.trim()) stepErrors.cin = "Corporate Identification Number (CIN) is required.";
      if (!legalStatus) stepErrors.legalStatus = "Legal status is required.";
      if (!foundedDate) stepErrors.foundedDate = "Founded date is required.";
      if (!sector) stepErrors.sector = "Sector is required.";
      if (!description.trim()) {
        stepErrors.description = "One-line description is required.";
      } else if (description.length > 300) {
        stepErrors.description = "Description cannot exceed 300 characters.";
      }
      if (website && !validateUrl(website)) {
        stepErrors.website = "Website must be a valid URL (e.g., https://example.com).";
      }
    } else if (currentStep === 1) {
      founders.forEach((founder, idx) => {
        if (!founder.name.trim()) {
          stepErrors[`founderName_${idx}`] = "Founder name is required.";
        }
        if (!founder.linkedin.trim()) {
          stepErrors[`founderLinkedin_${idx}`] = "LinkedIn URL is required.";
        } else if (!validateLinkedIn(founder.linkedin)) {
          stepErrors[`founderLinkedin_${idx}`] = "Must be a valid LinkedIn URL (e.g., https://linkedin.com/in/username).";
        }
      });
    } else if (currentStep === 2) {
      if (!stage) stepErrors.stage = "Stage selection is required.";
    } else if (currentStep === 3) {
      if (!isIncubated) {
        stepErrors.isIncubated = "Please select whether you are part of an incubator or accelerator.";
      } else if (isIncubated === "yes") {
        incubatorNames.forEach((name, idx) => {
          if (!name.trim()) {
            stepErrors[`incubator_${idx}`] = "Incubator or accelerator name is required.";
          }
        });
      }

      if (!isFunded) {
        stepErrors.isFunded = "Please select whether you are externally funded.";
      } else if (isFunded === "yes") {
        fundingDetails.forEach((funding, idx) => {
          if (!funding.investorName.trim()) {
            stepErrors[`investorName_${idx}`] = "Investor name is required.";
          }
          if (!funding.amount.trim() || isNaN(Number(funding.amount)) || Number(funding.amount) <= 0) {
            stepErrors[`fundingAmount_${idx}`] = "Valid funding amount is required.";
          }
          if (!funding.date) {
            stepErrors[`fundingDate_${idx}`] = "Funding date is required.";
          }
        });
      }

      if (!isRaising) {
        stepErrors.isRaising = "Raising plans selection is required.";
      }
    }

    setErrors(stepErrors);
    return Object.keys(stepErrors).length === 0;
  };

  const handleContinue = async () => {
    if (validateCurrentStep()) {
      if (currentStep < STEPS.length - 1) {
        setCurrentStep((prev) => prev + 1);
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        setSubmitLoading(true);
        setDbError("");

        try {
          const companyData = {
            owner_id: ownerId,
            status: "pending",
            trust_score: null,
            name: startupName,
            cin: cin,
            legal_status: legalStatus,
            founded_date: foundedDate,
            sector: sector,
            description: description,
            website: website || null,
            stage: stage,
            revenue: revenueAmount ? parseFloat(revenueAmount) : null,
            revenue_currency: revenueCurrency,
            active_users: activeUsers ? parseInt(activeUsers) : null,
            growth_rate: growthRate || null,
            currently_raising: isRaising,
            externally_funded: isFunded === "yes",
            incubator: isIncubated === "yes",
            team_size: teamSize ? parseInt(teamSize) : null,
            show_score: consentPublic,
            founders: founders.map(f => ({ name: f.name, linkedin: f.linkedin })),
            incubators: isIncubated === "yes" ? incubatorNames.filter(name => name.trim() !== "") : [],
            investors: isFunded === "yes" ? fundingDetails.map(f => ({
              name: f.investorName,
              amount: f.amount ? parseFloat(f.amount) : 0,
              currency: f.currency,
              round: f.round,
              date: f.date
            })) : [],
            coi_filename: coiFile ? coiFile.name : null,
            financials_filename: financialsFile ? financialsFile.name : null,
            pitch_deck_filename: pitchDeckFile ? pitchDeckFile.name : null,
            cap_table_filename: capTableFile ? capTableFile.name : null
          };

          const { error } = await supabase.from("companies").insert([companyData]);

          if (error) {
            setDbError(error.message || "Failed to save company details to database.");
            window.scrollTo({ top: 0, behavior: "smooth" });
          } else {
            setIsSubmitted(true);
            window.scrollTo({ top: 0, behavior: "smooth" });
          }
        } catch (err: any) {
          setDbError(err.message || "An unexpected error occurred while saving.");
          window.scrollTo({ top: 0, behavior: "smooth" });
        } finally {
          setSubmitLoading(false);
        }
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
      setErrors({});
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const addFounder = () => {
    setFounders([...founders, { name: "", linkedin: "" }]);
  };

  const removeFounder = (idx: number) => {
    if (founders.length > 1) {
      setFounders(founders.filter((_, i) => i !== idx));
    }
  };

  const updateFounder = (idx: number, field: keyof FounderEntry, val: string) => {
    const updated = [...founders];
    updated[idx][field] = val;
    setFounders(updated);
  };

  const addIncubator = () => {
    setIncubatorNames([...incubatorNames, ""]);
  };

  const removeIncubator = (idx: number) => {
    if (incubatorNames.length > 1) {
      setIncubatorNames(incubatorNames.filter((_, i) => i !== idx));
    }
  };

  const updateIncubator = (idx: number, val: string) => {
    const updated = [...incubatorNames];
    updated[idx] = val;
    setIncubatorNames(updated);
  };

  const addFunding = () => {
    setFundingDetails([
      ...fundingDetails,
      { investorName: "", amount: "", currency: "USD", round: "Seed", date: "" },
    ]);
  };

  const removeFunding = (idx: number) => {
    if (fundingDetails.length > 1) {
      setFundingDetails(fundingDetails.filter((_, i) => i !== idx));
    }
  };

  const updateFunding = (idx: number, field: keyof FundingEntry, val: string) => {
    const updated = [...fundingDetails];
    updated[idx][field] = val;
    setFundingDetails(updated);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#030305] overflow-x-hidden">
      <RegisterBackground />
      <div className="fixed inset-0 -z-5 bg-gradient-to-b from-[#030305]/40 via-transparent to-[#030305]/80 pointer-events-none" />

      <Navbar />

      <main className="relative z-10 flex-1 w-full max-w-[1200px] mx-auto px-4 md:px-6 py-12 flex flex-col gap-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col gap-2"
        >
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[rgba(0,229,255,0.05)] border border-[rgba(0,229,255,0.1)] rounded-full text-[11px] font-medium text-[#00E5FF] select-none tracking-tight w-fit">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00E5FF] animate-pulse" />
            Founder Registration
          </div>
          <h1 className="text-3xl font-medium tracking-tight text-white">
            Founder Registration
          </h1>
          <p className="text-sm text-[rgba(255,255,255,0.4)] max-w-2xl leading-relaxed">
            Register your startup to build your TrustScore profile. Please fill out all required fields truthfully.
          </p>
        </motion.div>

        {!isSubmitted && dbError && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full p-4 rounded-lg bg-[rgba(255,68,68,0.05)] border border-[rgba(255,68,68,0.15)] text-[#FF4444] text-sm font-medium"
          >
            {dbError}
          </motion.div>
        )}

        {isSubmitted ? (
          <AnimatedCard>
            <div className="bg-[rgba(10,10,18,0.6)] backdrop-blur-xl border border-[rgba(255,255,255,0.05)] rounded-card p-8 flex flex-col items-center justify-center text-center gap-6 shadow-sm max-w-2xl mx-auto w-full mt-4 hover:border-[rgba(0,229,255,0.08)] transition-all duration-500">
              <div className="w-14 h-14 bg-[rgba(0,255,163,0.05)] border border-[rgba(0,255,163,0.1)] rounded-full flex items-center justify-center text-[#00FFA3]">
                <IconCheck className="w-7 h-7" />
              </div>
              <div>
                <h2 className="text-2xl font-medium text-white">Registration submitted!</h2>
                <p className="text-sm text-[rgba(255,255,255,0.4)] mt-2 max-w-md mx-auto">
                  Thank you for registering. Our system is computing your baseline TrustScore from your verified credentials.
                </p>
              </div>

              <div className="w-full text-left bg-[rgba(255,255,255,0.01)] border border-[rgba(255,255,255,0.03)] rounded-card p-5 mt-4 space-y-4">
                <h3 className="text-sm font-medium text-white border-b border-[rgba(255,255,255,0.03)] pb-2">
                  Startup Summary
                </h3>
                <div className="grid grid-cols-2 gap-y-3 gap-x-4 text-xs">
                  <div>
                    <p className="text-[rgba(255,255,255,0.3)]">Company Name</p>
                    <p className="font-medium text-white mt-0.5">{startupName}</p>
                  </div>
                  <div>
                    <p className="text-[rgba(255,255,255,0.3)]">CIN</p>
                    <p className="font-medium text-white mt-0.5">{cin}</p>
                  </div>
                  <div>
                    <p className="text-[rgba(255,255,255,0.3)]">Legal Status</p>
                    <p className="font-medium text-white mt-0.5">{legalStatus}</p>
                  </div>
                  <div>
                    <p className="text-[rgba(255,255,255,0.3)]">Founded Date</p>
                    <p className="font-medium text-white mt-0.5">{foundedDate}</p>
                  </div>
                  <div>
                    <p className="text-[rgba(255,255,255,0.3)]">Sector</p>
                    <p className="font-medium text-white mt-0.5">{sector}</p>
                  </div>
                  <div>
                    <p className="text-[rgba(255,255,255,0.3)]">Stage</p>
                    <p className="font-medium text-white mt-0.5">{stage}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-[rgba(255,255,255,0.3)]">Website</p>
                    <p className="font-medium text-white mt-0.5">{website || "None listed"}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-[rgba(255,255,255,0.3)]">Score Public Consent</p>
                    <p className="font-medium text-white mt-0.5">
                      {consentPublic ? "Yes, display computed TrustScore publicly" : "No, keep TrustScore locked"}
                    </p>
                  </div>
                  <div className="col-span-2 border-t border-[rgba(255,255,255,0.03)] pt-2 mt-1">
                    <p className="text-[rgba(255,255,255,0.3)] font-medium mb-1">Uploaded Evidence</p>
                    <ul className="list-disc pl-4 space-y-1 text-white/60">
                      <li>Certificate of Incorporation: {coiFile ? coiFile.name : "Not provided"}</li>
                      <li>Financials / Revenue Proof: {financialsFile ? financialsFile.name : "Not provided"}</li>
                      <li>Pitch Deck: {pitchDeckFile ? pitchDeckFile.name : "Not provided"}</li>
                      <li>Cap Table: {capTableFile ? capTableFile.name : "Not provided"}</li>
                    </ul>
                  </div>
                </div>
              </div>

              <button
                onClick={() => {
                  setStartupName("");
                  setCin("");
                  setLegalStatus("");
                  setFoundedDate("");
                  setSector("");
                  setDescription("");
                  setWebsite("");
                  setFounders([{ name: "", linkedin: "" }]);
                  setTeamSize("");
                  setStage("");
                  setRevenueAmount("");
                  setRevenueCurrency("USD");
                  setActiveUsers("");
                  setGrowthRate("");
                  setIsIncubated("");
                  setIncubatorNames([""]);
                  setIsFunded("");
                  setFundingDetails([{ investorName: "", amount: "", currency: "USD", round: "Seed", date: "" }]);
                  setIsRaising("");
                  setCoiFile(null);
                  setFinancialsFile(null);
                  setPitchDeckFile(null);
                  setCapTableFile(null);
                  setConsentPublic(false);
                  setCurrentStep(0);
                  setIsSubmitted(false);
                }}
                className="h-9 px-5 bg-gradient-to-r from-[#00E5FF] to-[#7000FF] text-white rounded-button text-sm font-medium transition-all duration-300 hover:shadow-[0_0_30px_rgba(0,229,255,0.15)] cursor-pointer"
              >
                Register another startup
              </button>
            </div>
          </AnimatedCard>
        ) : (
          <div className="flex flex-col md:flex-row gap-8 items-start">
            <div className="w-full md:w-64 flex-shrink-0 bg-[rgba(10,10,18,0.4)] backdrop-blur-xl border border-[rgba(255,255,255,0.03)] rounded-card p-4 hover:border-[rgba(255,255,255,0.05)] transition-all duration-500">
              <div className="flex flex-row md:flex-col gap-2 md:gap-1 overflow-x-auto md:overflow-x-visible pb-2 md:pb-0 scrollbar-none">
                {STEPS.map((step, idx) => {
                  const isActive = idx === currentStep;
                  const isCompleted = idx < currentStep;
                  return (
                    <div
                      key={step.title}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-button text-sm font-medium transition-all duration-300 select-none ${
                        isActive
                          ? "bg-[rgba(0,229,255,0.05)] text-[#00E5FF] border border-[rgba(0,229,255,0.1)]"
                          : "text-[rgba(255,255,255,0.3)] border border-transparent hover:text-white hover:bg-[rgba(255,255,255,0.02)]"
                      }`}
                    >
                      <div
                        className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-semibold flex-shrink-0 transition-all duration-300 ${
                          isCompleted
                            ? "bg-[#00FFA3] text-[#030305]"
                            : isActive
                            ? "bg-[#00E5FF] text-[#030305]"
                            : "bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.05)] text-[rgba(255,255,255,0.2)]"
                        }`}
                      >
                        {isCompleted ? <IconCheckSmall className="w-3 h-3" /> : idx + 1}
                      </div>
                      <span className="whitespace-nowrap">{step.title}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="flex-1 w-full bg-[rgba(10,10,18,0.4)] backdrop-blur-xl border border-[rgba(255,255,255,0.03)] rounded-card p-6 flex flex-col justify-between min-h-[460px] hover:border-[rgba(255,255,255,0.05)] transition-all duration-500">
              <div className="flex flex-col gap-6">
                <div className="border-b border-[rgba(255,255,255,0.03)] pb-4">
                  <span className="text-[10px] text-[rgba(255,255,255,0.2)] tracking-wider font-semibold uppercase font-mono">
                    Step {currentStep + 1} of {STEPS.length}
                  </span>
                  <h2 className="text-xl font-medium text-white mt-1">
                    {STEPS[currentStep].title}
                  </h2>
                  <p className="text-xs text-[rgba(255,255,255,0.3)] mt-1">
                    {STEPS[currentStep].description}
                  </p>
                </div>

                <div className="space-y-5">
                  {currentStep === 0 && (
                    <>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-semibold text-white/80">
                          Registered startup name <span className="text-[#00E5FF]">*</span>
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Apex Biosensors Pvt Ltd"
                          value={startupName}
                          onChange={(e) => setStartupName(e.target.value)}
                          className="h-9 w-full border border-[rgba(255,255,255,0.05)] bg-[rgba(10,10,18,0.4)] text-white rounded-button px-3 text-sm placeholder:text-[rgba(255,255,255,0.2)] focus:outline-hidden focus:ring-1 focus:ring-[#00E5FF] focus:border-[#00E5FF] transition-all duration-300 hover:border-[rgba(255,255,255,0.1)]"
                        />
                        {errors.startupName && <span className="text-xs text-[#FF4444] mt-0.5">{errors.startupName}</span>}
                      </div>

                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-semibold text-white/80">
                          Corporate Identification Number (CIN) <span className="text-[#00E5FF]">*</span>
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. U72900KA2021PTC145678"
                          value={cin}
                          onChange={(e) => setCin(e.target.value)}
                          className="h-9 w-full border border-[rgba(255,255,255,0.05)] bg-[rgba(10,10,18,0.4)] text-white rounded-button px-3 text-sm placeholder:text-[rgba(255,255,255,0.2)] focus:outline-hidden focus:ring-1 focus:ring-[#00E5FF] focus:border-[#00E5FF] transition-all duration-300 hover:border-[rgba(255,255,255,0.1)]"
                        />
                        {errors.cin && <span className="text-xs text-[#FF4444] mt-0.5">{errors.cin}</span>}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1.5">
                          <label className="text-xs font-semibold text-white/80">
                            Legal status <span className="text-[#00E5FF]">*</span>
                          </label>
                          <select
                            value={legalStatus}
                            onChange={(e) => setLegalStatus(e.target.value)}
                            className="h-9 w-full border border-[rgba(255,255,255,0.05)] bg-[rgba(10,10,18,0.4)] text-white rounded-button px-3 text-sm focus:outline-hidden focus:ring-1 focus:ring-[#00E5FF] focus:border-[#00E5FF] transition-all duration-300 hover:border-[rgba(255,255,255,0.1)]"
                          >
                            <option value="" className="bg-[#030305]">Select status</option>
                            <option value="proprietorship" className="bg-[#030305]">Proprietorship</option>
                            <option value="pvt ltd" className="bg-[#030305]">Pvt Ltd</option>
                            <option value="llp" className="bg-[#030305]">LLP</option>
                            <option value="other" className="bg-[#030305]">Other</option>
                          </select>
                          {errors.legalStatus && <span className="text-xs text-[#FF4444] mt-0.5">{errors.legalStatus}</span>}
                        </div>

                        <div className="flex flex-col gap-1.5">
                          <label className="text-xs font-semibold text-white/80">
                            Founded date <span className="text-[#00E5FF]">*</span>
                          </label>
                          <input
                            type="date"
                            value={foundedDate}
                            onChange={(e) => setFoundedDate(e.target.value)}
                            className="h-9 w-full border border-[rgba(255,255,255,0.05)] bg-[rgba(10,10,18,0.4)] text-white rounded-button px-3 text-sm focus:outline-hidden focus:ring-1 focus:ring-[#00E5FF] focus:border-[#00E5FF] transition-all duration-300 hover:border-[rgba(255,255,255,0.1)]"
                          />
                          {errors.foundedDate && <span className="text-xs text-[#FF4444] mt-0.5">{errors.foundedDate}</span>}
                        </div>
                      </div>

                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-semibold text-white/80">
                          Sector <span className="text-[#00E5FF]">*</span>
                        </label>
                        <select
                          value={sector}
                          onChange={(e) => setSector(e.target.value)}
                          className="h-9 w-full border border-[rgba(255,255,255,0.05)] bg-[rgba(10,10,18,0.4)] text-white rounded-button px-3 text-sm focus:outline-hidden focus:ring-1 focus:ring-[#00E5FF] focus:border-[#00E5FF] transition-all duration-300 hover:border-[rgba(255,255,255,0.1)]"
                        >
                          <option value="" className="bg-[#030305]">Select sector</option>
                          <option value="Healthtech" className="bg-[#030305]">Healthtech</option>
                          <option value="Logistics" className="bg-[#030305]">Logistics</option>
                          <option value="Climate" className="bg-[#030305]">Climate</option>
                          <option value="Energy" className="bg-[#030305]">Energy</option>
                          <option value="Cybersecurity" className="bg-[#030305]">Cybersecurity</option>
                          <option value="Agtech" className="bg-[#030305]">Agtech</option>
                          <option value="Fintech" className="bg-[#030305]">Fintech</option>
                          <option value="Deeptech" className="bg-[#030305]">Deeptech</option>
                          <option value="AI" className="bg-[#030305]">AI</option>
                          <option value="Other" className="bg-[#030305]">Other</option>
                        </select>
                        {errors.sector && <span className="text-xs text-[#FF4444] mt-0.5">{errors.sector}</span>}
                      </div>

                      <div className="flex flex-col gap-1.5">
                        <div className="flex items-center justify-between">
                          <label className="text-xs font-semibold text-white/80">
                            One-line description <span className="text-[#00E5FF]">*</span>
                          </label>
                          <span className="text-[10px] text-[rgba(255,255,255,0.15)]">
                            {description.length}/300
                          </span>
                        </div>
                        <input
                          type="text"
                          maxLength={300}
                          placeholder="e.g. Non-invasive glucose tracking using infrared sensors."
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                          className="h-9 w-full border border-[rgba(255,255,255,0.05)] bg-[rgba(10,10,18,0.4)] text-white rounded-button px-3 text-sm placeholder:text-[rgba(255,255,255,0.2)] focus:outline-hidden focus:ring-1 focus:ring-[#00E5FF] focus:border-[#00E5FF] transition-all duration-300 hover:border-[rgba(255,255,255,0.1)]"
                        />
                        {errors.description && <span className="text-xs text-[#FF4444] mt-0.5">{errors.description}</span>}
                      </div>

                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-semibold text-white/80">
                          Website
                        </label>
                        <input
                          type="url"
                          placeholder="e.g. https://apexbio.com"
                          value={website}
                          onChange={(e) => setWebsite(e.target.value)}
                          className="h-9 w-full border border-[rgba(255,255,255,0.05)] bg-[rgba(10,10,18,0.4)] text-white rounded-button px-3 text-sm placeholder:text-[rgba(255,255,255,0.2)] focus:outline-hidden focus:ring-1 focus:ring-[#00E5FF] focus:border-[#00E5FF] transition-all duration-300 hover:border-[rgba(255,255,255,0.1)]"
                        />
                        {errors.website && <span className="text-xs text-[#FF4444] mt-0.5">{errors.website}</span>}
                      </div>
                    </>
                  )}

                  {currentStep === 1 && (
                    <>
                      <div className="space-y-4">
                        <label className="text-xs font-semibold text-white/80">
                          Founder details <span className="text-[#00E5FF]">*</span>
                        </label>

                        {founders.map((founder, idx) => (
                          <div
                            key={idx}
                            className="bg-[rgba(255,255,255,0.01)] border border-[rgba(255,255,255,0.03)] rounded-card p-4 space-y-3 relative animate-in fade-in duration-150"
                          >
                            {founders.length > 1 && (
                              <button
                                type="button"
                                onClick={() => removeFounder(idx)}
                                className="absolute top-3 right-3 text-xs text-[rgba(255,255,255,0.2)] hover:text-[#00E5FF] font-medium cursor-pointer transition-colors"
                              >
                                Remove
                              </button>
                            )}

                            <h4 className="text-xs font-semibold text-white/60">
                              Founder #{idx + 1}
                            </h4>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="flex flex-col gap-1">
                                <label className="text-[11px] font-semibold text-[rgba(255,255,255,0.3)]">
                                  Full name
                                </label>
                                <input
                                  type="text"
                                  placeholder="e.g. Alex Rivera"
                                  value={founder.name}
                                  onChange={(e) => updateFounder(idx, "name", e.target.value)}
                                  className="h-9 w-full border border-[rgba(255,255,255,0.05)] bg-[rgba(10,10,18,0.4)] text-white rounded-button px-3 text-sm placeholder:text-[rgba(255,255,255,0.2)] focus:outline-hidden focus:ring-1 focus:ring-[#00E5FF] focus:border-[#00E5FF] transition-all duration-300 hover:border-[rgba(255,255,255,0.1)]"
                                />
                                {errors[`founderName_${idx}`] && (
                                  <span className="text-xs text-[#FF4444] mt-0.5">{errors[`founderName_${idx}`]}</span>
                                )}
                              </div>

                              <div className="flex flex-col gap-1">
                                <label className="text-[11px] font-semibold text-[rgba(255,255,255,0.3)]">
                                  LinkedIn URL
                                </label>
                                <input
                                  type="url"
                                  placeholder="e.g. https://linkedin.com/in/alex-rivera"
                                  value={founder.linkedin}
                                  onChange={(e) => updateFounder(idx, "linkedin", e.target.value)}
                                  className="h-9 w-full border border-[rgba(255,255,255,0.05)] bg-[rgba(10,10,18,0.4)] text-white rounded-button px-3 text-sm placeholder:text-[rgba(255,255,255,0.2)] focus:outline-hidden focus:ring-1 focus:ring-[#00E5FF] focus:border-[#00E5FF] transition-all duration-300 hover:border-[rgba(255,255,255,0.1)]"
                                />
                                {errors[`founderLinkedin_${idx}`] && (
                                  <span className="text-xs text-[#FF4444] mt-0.5">{errors[`founderLinkedin_${idx}`]}</span>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}

                        <button
                          type="button"
                          onClick={addFounder}
                          className="text-xs font-semibold text-[#00E5FF] hover:text-[#00E5FF]/80 flex items-center gap-1 cursor-pointer py-1 transition-colors"
                        >
                          + Add another founder
                        </button>
                      </div>

                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-semibold text-white/80">
                          Total team size
                        </label>
                        <input
                          type="number"
                          min="1"
                          placeholder="e.g. 5"
                          value={teamSize}
                          onChange={(e) => setTeamSize(e.target.value)}
                          className="h-9 w-full border border-[rgba(255,255,255,0.05)] bg-[rgba(10,10,18,0.4)] text-white rounded-button px-3 text-sm placeholder:text-[rgba(255,255,255,0.2)] focus:outline-hidden focus:ring-1 focus:ring-[#00E5FF] focus:border-[#00E5FF] transition-all duration-300 hover:border-[rgba(255,255,255,0.1)]"
                        />
                      </div>
                    </>
                  )}

                  {currentStep === 2 && (
                    <>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-semibold text-white/80">
                          Current startup stage <span className="text-[#00E5FF]">*</span>
                        </label>
                        <select
                          value={stage}
                          onChange={(e) => setStage(e.target.value)}
                          className="h-9 w-full border border-[rgba(255,255,255,0.05)] bg-[rgba(10,10,18,0.4)] text-white rounded-button px-3 text-sm focus:outline-hidden focus:ring-1 focus:ring-[#00E5FF] focus:border-[#00E5FF] transition-all duration-300 hover:border-[rgba(255,255,255,0.1)]"
                        >
                          <option value="" className="bg-[#030305]">Select stage</option>
                          <option value="idea" className="bg-[#030305]">Idea</option>
                          <option value="mvp" className="bg-[#030305]">MVP</option>
                          <option value="revenue" className="bg-[#030305]">Revenue</option>
                          <option value="scaling" className="bg-[#030305]">Scaling</option>
                        </select>
                        {errors.stage && <span className="text-xs text-[#FF4444] mt-0.5">{errors.stage}</span>}
                      </div>

                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-semibold text-white/80">
                          Revenue (MRR or ARR)
                        </label>
                        <div className="flex gap-2">
                          <select
                            value={revenueCurrency}
                            onChange={(e) => setRevenueCurrency(e.target.value)}
                            className="h-9 w-24 border border-[rgba(255,255,255,0.05)] bg-[rgba(10,10,18,0.4)] text-white rounded-button px-2 text-sm focus:outline-hidden focus:ring-1 focus:ring-[#00E5FF] focus:border-[#00E5FF] transition-all duration-300 hover:border-[rgba(255,255,255,0.1)] flex-shrink-0"
                          >
                            <option value="USD" className="bg-[#030305]">USD ($)</option>
                            <option value="INR" className="bg-[#030305]">INR (₹)</option>
                            <option value="EUR" className="bg-[#030305]">EUR (€)</option>
                          </select>
                          <input
                            type="number"
                            min="0"
                            placeholder="e.g. 50000"
                            value={revenueAmount}
                            onChange={(e) => setRevenueAmount(e.target.value)}
                            className="h-9 flex-1 border border-[rgba(255,255,255,0.05)] bg-[rgba(10,10,18,0.4)] text-white rounded-button px-3 text-sm placeholder:text-[rgba(255,255,255,0.2)] focus:outline-hidden focus:ring-1 focus:ring-[#00E5FF] focus:border-[#00E5FF] transition-all duration-300 hover:border-[rgba(255,255,255,0.1)]"
                          />
                        </div>
                      </div>

                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-semibold text-white/80">
                          Active users / customers
                        </label>
                        <input
                          type="number"
                          min="0"
                          placeholder="e.g. 1200"
                          value={activeUsers}
                          onChange={(e) => setActiveUsers(e.target.value)}
                          className="h-9 w-full border border-[rgba(255,255,255,0.05)] bg-[rgba(10,10,18,0.4)] text-white rounded-button px-3 text-sm placeholder:text-[rgba(255,255,255,0.2)] focus:outline-hidden focus:ring-1 focus:ring-[#00E5FF] focus:border-[#00E5FF] transition-all duration-300 hover:border-[rgba(255,255,255,0.1)]"
                        />
                      </div>

                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-semibold text-white/80">
                          Growth rate
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. 15% month-on-month"
                          value={growthRate}
                          onChange={(e) => setGrowthRate(e.target.value)}
                          className="h-9 w-full border border-[rgba(255,255,255,0.05)] bg-[rgba(10,10,18,0.4)] text-white rounded-button px-3 text-sm placeholder:text-[rgba(255,255,255,0.2)] focus:outline-hidden focus:ring-1 focus:ring-[#00E5FF] focus:border-[#00E5FF] transition-all duration-300 hover:border-[rgba(255,255,255,0.1)]"
                        />
                      </div>
                    </>
                  )}

                  {currentStep === 3 && (
                    <>
                      <div className="flex flex-col gap-2">
                        <label className="text-xs font-semibold text-white/80">
                          Part of any incubator or accelerator? <span className="text-[#00E5FF]">*</span>
                        </label>
                        <div className="flex gap-4">
                          <label className="inline-flex items-center gap-2 text-sm text-white cursor-pointer select-none">
                            <input
                              type="radio"
                              name="isIncubated"
                              checked={isIncubated === "yes"}
                              onChange={() => setIsIncubated("yes")}
                              className="w-4 h-4 text-[#00E5FF] border-[rgba(255,255,255,0.1)] bg-[rgba(10,10,18,0.4)] focus:ring-[#00E5FF] focus:outline-hidden"
                            />
                            <span>Yes</span>
                          </label>
                          <label className="inline-flex items-center gap-2 text-sm text-white cursor-pointer select-none">
                            <input
                              type="radio"
                              name="isIncubated"
                              checked={isIncubated === "no"}
                              onChange={() => {
                                setIsIncubated("no");
                                setIncubatorNames([""]);
                              }}
                              className="w-4 h-4 text-[#00E5FF] border-[rgba(255,255,255,0.1)] bg-[rgba(10,10,18,0.4)] focus:ring-[#00E5FF] focus:outline-hidden"
                            />
                            <span>No</span>
                          </label>
                        </div>
                        {errors.isIncubated && <span className="text-xs text-[#FF4444] mt-0.5">{errors.isIncubated}</span>}

                        {isIncubated === "yes" && (
                          <div className="pl-4 border-l border-[rgba(255,255,255,0.05)] mt-2 space-y-3 animate-in fade-in duration-150">
                            <label className="text-[11px] font-semibold text-[rgba(255,255,255,0.3)]">
                              Incubator/accelerator name(s)
                            </label>
                            {incubatorNames.map((name, idx) => (
                              <div key={idx} className="flex gap-2 items-center">
                                <div className="flex-1">
                                  <input
                                    type="text"
                                    placeholder="e.g. Y Combinator"
                                    value={name}
                                    onChange={(e) => updateIncubator(idx, e.target.value)}
                                    className="h-9 w-full border border-[rgba(255,255,255,0.05)] bg-[rgba(10,10,18,0.4)] text-white rounded-button px-3 text-sm placeholder:text-[rgba(255,255,255,0.2)] focus:outline-hidden focus:ring-1 focus:ring-[#00E5FF] focus:border-[#00E5FF] transition-all duration-300 hover:border-[rgba(255,255,255,0.1)]"
                                  />
                                  {errors[`incubator_${idx}`] && (
                                    <span className="text-xs text-[#FF4444] mt-0.5">{errors[`incubator_${idx}`]}</span>
                                  )}
                                </div>
                                {incubatorNames.length > 1 && (
                                  <button
                                    type="button"
                                    onClick={() => removeIncubator(idx)}
                                    className="text-xs text-[rgba(255,255,255,0.2)] hover:text-[#00E5FF] font-medium cursor-pointer flex-shrink-0 transition-colors"
                                  >
                                    Remove
                                  </button>
                                )}
                              </div>
                            ))}
                            <button
                              type="button"
                              onClick={addIncubator}
                              className="text-xs font-semibold text-[#00E5FF] hover:text-[#00E5FF]/80 flex items-center gap-1 cursor-pointer py-1 transition-colors"
                            >
                              + Add another incubator
                            </button>
                          </div>
                        )}
                      </div>

                      <div className="flex flex-col gap-2 pt-2">
                        <label className="text-xs font-semibold text-white/80">
                          Are you externally funded? <span className="text-[#00E5FF]">*</span>
                        </label>
                        <div className="flex gap-4">
                          <label className="inline-flex items-center gap-2 text-sm text-white cursor-pointer select-none">
                            <input
                              type="radio"
                              name="isFunded"
                              checked={isFunded === "yes"}
                              onChange={() => setIsFunded("yes")}
                              className="w-4 h-4 text-[#00E5FF] border-[rgba(255,255,255,0.1)] bg-[rgba(10,10,18,0.4)] focus:ring-[#00E5FF] focus:outline-hidden"
                            />
                            <span>Yes</span>
                          </label>
                          <label className="inline-flex items-center gap-2 text-sm text-white cursor-pointer select-none">
                            <input
                              type="radio"
                              name="isFunded"
                              checked={isFunded === "no"}
                              onChange={() => {
                                setIsFunded("no");
                                setFundingDetails([{ investorName: "", amount: "", currency: "USD", round: "Seed", date: "" }]);
                              }}
                              className="w-4 h-4 text-[#00E5FF] border-[rgba(255,255,255,0.1)] bg-[rgba(10,10,18,0.4)] focus:ring-[#00E5FF] focus:outline-hidden"
                            />
                            <span>No</span>
                          </label>
                        </div>
                        {errors.isFunded && <span className="text-xs text-[#FF4444] mt-0.5">{errors.isFunded}</span>}

                        {isFunded === "yes" && (
                          <div className="pl-4 border-l border-[rgba(255,255,255,0.05)] mt-2 space-y-4 animate-in fade-in duration-150">
                            <label className="text-[11px] font-semibold text-[rgba(255,255,255,0.3)]">
                              Investor details
                            </label>

                            {fundingDetails.map((funding, idx) => (
                              <div
                                key={idx}
                                className="bg-[rgba(255,255,255,0.01)] border border-[rgba(255,255,255,0.03)] rounded-card p-4 space-y-3 relative"
                              >
                                {fundingDetails.length > 1 && (
                                  <button
                                    type="button"
                                    onClick={() => removeFunding(idx)}
                                    className="absolute top-3 right-3 text-xs text-[rgba(255,255,255,0.2)] hover:text-[#00E5FF] font-medium cursor-pointer transition-colors"
                                  >
                                    Remove
                                  </button>
                                )}

                                <h5 className="text-[11px] font-semibold text-white/60">
                                  Funding entry #{idx + 1}
                                </h5>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <div className="flex flex-col gap-1">
                                    <label className="text-[10px] font-semibold text-[rgba(255,255,255,0.3)]">
                                      Investor name
                                    </label>
                                    <input
                                      type="text"
                                      placeholder="e.g. Sequoia Capital"
                                      value={funding.investorName}
                                      onChange={(e) => updateFunding(idx, "investorName", e.target.value)}
                                      className="h-9 w-full border border-[rgba(255,255,255,0.05)] bg-[rgba(10,10,18,0.4)] text-white rounded-button px-3 text-sm placeholder:text-[rgba(255,255,255,0.2)] focus:outline-hidden focus:ring-1 focus:ring-[#00E5FF] focus:border-[#00E5FF] transition-all duration-300 hover:border-[rgba(255,255,255,0.1)]"
                                    />
                                    {errors[`investorName_${idx}`] && (
                                      <span className="text-xs text-[#FF4444] mt-0.5">{errors[`investorName_${idx}`]}</span>
                                    )}
                                  </div>

                                  <div className="flex flex-col gap-1">
                                    <label className="text-[10px] font-semibold text-[rgba(255,255,255,0.3)]">
                                      Funding amount
                                    </label>
                                    <div className="flex gap-2">
                                      <select
                                        value={funding.currency}
                                        onChange={(e) => updateFunding(idx, "currency", e.target.value)}
                                        className="h-9 w-20 border border-[rgba(255,255,255,0.05)] bg-[rgba(10,10,18,0.4)] text-white rounded-button px-1 text-xs focus:outline-hidden focus:ring-1 focus:ring-[#00E5FF] focus:border-[#00E5FF] transition-all duration-300 hover:border-[rgba(255,255,255,0.1)] flex-shrink-0"
                                      >
                                        <option value="USD" className="bg-[#030305]">USD ($)</option>
                                        <option value="INR" className="bg-[#030305]">INR (₹)</option>
                                        <option value="EUR" className="bg-[#030305]">EUR (€)</option>
                                      </select>
                                      <input
                                        type="number"
                                        min="1"
                                        placeholder="e.g. 250000"
                                        value={funding.amount}
                                        onChange={(e) => updateFunding(idx, "amount", e.target.value)}
                                        className="h-9 flex-1 border border-[rgba(255,255,255,0.05)] bg-[rgba(10,10,18,0.4)] text-white rounded-button px-3 text-sm placeholder:text-[rgba(255,255,255,0.2)] focus:outline-hidden focus:ring-1 focus:ring-[#00E5FF] focus:border-[#00E5FF] transition-all duration-300 hover:border-[rgba(255,255,255,0.1)]"
                                      />
                                    </div>
                                    {errors[`fundingAmount_${idx}`] && (
                                      <span className="text-xs text-[#FF4444] mt-0.5">{errors[`fundingAmount_${idx}`]}</span>
                                    )}
                                  </div>

                                  <div className="flex flex-col gap-1">
                                    <label className="text-[10px] font-semibold text-[rgba(255,255,255,0.3)]">
                                      Funding round
                                    </label>
                                    <select
                                      value={funding.round}
                                      onChange={(e) => updateFunding(idx, "round", e.target.value)}
                                      className="h-9 w-full border border-[rgba(255,255,255,0.05)] bg-[rgba(10,10,18,0.4)] text-white rounded-button px-3 text-sm focus:outline-hidden focus:ring-1 focus:ring-[#00E5FF] focus:border-[#00E5FF] transition-all duration-300 hover:border-[rgba(255,255,255,0.1)]"
                                    >
                                      <option value="Pre-Seed" className="bg-[#030305]">Pre-Seed</option>
                                      <option value="Seed" className="bg-[#030305]">Seed</option>
                                      <option value="Series A" className="bg-[#030305]">Series A</option>
                                      <option value="Series B" className="bg-[#030305]">Series B</option>
                                    </select>
                                  </div>

                                  <div className="flex flex-col gap-1">
                                    <label className="text-[10px] font-semibold text-[rgba(255,255,255,0.3)]">
                                      Funding date
                                    </label>
                                    <input
                                      type="date"
                                      value={funding.date}
                                      onChange={(e) => updateFunding(idx, "date", e.target.value)}
                                      className="h-9 w-full border border-[rgba(255,255,255,0.05)] bg-[rgba(10,10,18,0.4)] text-white rounded-button px-3 text-sm focus:outline-hidden focus:ring-1 focus:ring-[#00E5FF] focus:border-[#00E5FF] transition-all duration-300 hover:border-[rgba(255,255,255,0.1)]"
                                    />
                                    {errors[`fundingDate_${idx}`] && (
                                      <span className="text-xs text-[#FF4444] mt-0.5">{errors[`fundingDate_${idx}`]}</span>
                                    )}
                                  </div>
                                </div>
                              </div>
                            ))}
                            <button
                              type="button"
                              onClick={addFunding}
                              className="text-xs font-semibold text-[#00E5FF] hover:text-[#00E5FF]/80 flex items-center gap-1 cursor-pointer py-1 transition-colors"
                            >
                              + Add another funding entry
                            </button>
                          </div>
                        )}
                      </div>

                      <div className="flex flex-col gap-1.5 pt-2">
                        <label className="text-xs font-semibold text-white/80">
                          Currently raising? <span className="text-[#00E5FF]">*</span>
                        </label>
                        <select
                          value={isRaising}
                          onChange={(e) => setIsRaising(e.target.value)}
                          className="h-9 w-full border border-[rgba(255,255,255,0.05)] bg-[rgba(10,10,18,0.4)] text-white rounded-button px-3 text-sm focus:outline-hidden focus:ring-1 focus:ring-[#00E5FF] focus:border-[#00E5FF] transition-all duration-300 hover:border-[rgba(255,255,255,0.1)]"
                        >
                          <option value="" className="bg-[#030305]">Select raising plans</option>
                          <option value="yes" className="bg-[#030305]">Yes</option>
                          <option value="no" className="bg-[#030305]">No</option>
                          <option value="planning" className="bg-[#030305]">Planning</option>
                        </select>
                        {errors.isRaising && <span className="text-xs text-[#FF4444] mt-0.5">{errors.isRaising}</span>}
                      </div>
                    </>
                  )}

                  {currentStep === 4 && (
                    <>
                      <div className="space-y-5">
                        <p className="text-xs text-[rgba(255,255,255,0.3)] leading-relaxed bg-[rgba(255,255,255,0.01)] border border-[rgba(255,255,255,0.03)] rounded-card p-3">
                          Uploading evidence helps verify your claims and raises your Trustscore, but all uploads are optional. You can upload files now or complete this later.
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                          {renderFileInput(
                            "Certificate of incorporation",
                            coiFile,
                            setCoiFile,
                            "coi-file-input"
                          )}

                          {renderFileInput(
                            "Financials / revenue proof",
                            financialsFile,
                            setFinancialsFile,
                            "financials-file-input"
                          )}

                          {renderFileInput(
                            "Pitch deck",
                            pitchDeckFile,
                            setPitchDeckFile,
                            "pitchdeck-file-input"
                          )}

                          {renderFileInput(
                            "Cap table",
                            capTableFile,
                            setCapTableFile,
                            "captable-file-input"
                          )}
                        </div>
                      </div>
                    </>
                  )}

                  {currentStep === 5 && (
                    <>
                      <div className="bg-[rgba(255,255,255,0.01)] border border-[rgba(255,255,255,0.03)] rounded-card p-5 space-y-4">
                        <h3 className="text-sm font-semibold text-white">
                          Computed score display settings
                        </h3>
                        <p className="text-xs text-[rgba(255,255,255,0.3)] leading-relaxed">
                          Your startup TrustScore is computed programmatically based on verified registry records (CIN), document backups, and endorsement checks. You have full control over whether this baseline score is visible on the investor directory directory list.
                        </p>

                        <div className="flex items-start gap-3 pt-2">
                          <input
                            type="checkbox"
                            id="consentPublic"
                            checked={consentPublic}
                            onChange={(e) => setConsentPublic(e.target.checked)}
                            className="mt-1 w-4.5 h-4.5 text-[#00E5FF] border-[rgba(255,255,255,0.1)] bg-[rgba(10,10,18,0.4)] rounded-[4px] focus:ring-[#00E5FF] cursor-pointer transition-all duration-300"
                          />
                          <label
                            htmlFor="consentPublic"
                            className="text-xs font-medium text-white/80 leading-normal cursor-pointer select-none"
                          >
                            Show my TrustScore publicly on my directory card. 
                            <span className="block text-[11px] text-[rgba(255,255,255,0.3)] font-normal mt-0.5">
                              If unselected, your startup appears in the directory under a locked state showing &quot;Score not shared&quot;.
                            </span>
                          </label>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>

              <div className="flex justify-between items-center mt-8 pt-4 border-t border-[rgba(255,255,255,0.03)]">
                <button
                  type="button"
                  onClick={handleBack}
                  disabled={currentStep === 0}
                  className={`h-9 px-4 rounded-button text-sm font-medium transition-all duration-300 select-none ${
                    currentStep === 0
                      ? "text-[rgba(255,255,255,0.1)] border border-[rgba(255,255,255,0.02)] bg-transparent cursor-not-allowed"
                      : "text-white border border-[rgba(255,255,255,0.05)] hover:bg-[rgba(255,255,255,0.02)] cursor-pointer"
                  }`}
                >
                  Back
                </button>

                <button
                  type="button"
                  onClick={handleContinue}
                  disabled={submitLoading}
                  className="h-9 px-5 bg-gradient-to-r from-[#00E5FF] to-[#7000FF] text-white rounded-button text-sm font-medium transition-all duration-300 hover:shadow-[0_0_30px_rgba(0,229,255,0.15)] cursor-pointer select-none flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitLoading ? (
                    <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  ) : null}
                  {currentStep === STEPS.length - 1 ? "Submit" : "Continue"}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}