"use client";

import React, { useState, useEffect, Suspense, useRef } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAuth } from "@/components/AuthProvider";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { PerspectiveCamera, Float, Sparkles, Torus, MeshDistortMaterial } from "@react-three/drei";
import * as THREE from "three";
import { motion } from "framer-motion";

const AuthScene = () => {
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
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
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

const AuthBackground = () => {
  return (
    <div className="fixed inset-0 -z-10 pointer-events-none">
      <Canvas style={{ background: "#0B0F17" }} dpr={[1, 2]}>
        <PerspectiveCamera makeDefault position={[0, 0, 7]} fov={45} />
        <ambientLight intensity={0.2} color="#00E5FF" />
        <directionalLight position={[5, 5, 5]} intensity={0.4} color="#7000FF" />
        <directionalLight position={[-5, -2, 5]} intensity={0.2} color="#00E5FF" />
        <pointLight position={[0, 0, 3]} intensity={0.3} color="#00FFA3" />
        <BackgroundParticles />
        <RingSystem />
        <AuthScene />
        <Sparkles count={60} scale={[8, 8, 8]} size={0.015} speed={0.2} color="#00E5FF" opacity={0.15} />
        <Sparkles count={30} scale={[8, 8, 8]} size={0.01} speed={0.15} color="#7000FF" opacity={0.1} />
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

const IconLock = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
  </svg>
);

const IconGoogle = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);

const IconCheck = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const IconX = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const IconArrowLeft = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
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

function AuthForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { signInWithGoogle, signUpWithEmail, signInWithEmail, isLoading: authLoading } = useAuth();

  const initialMode = searchParams.get("mode") === "signup" ? "signup" : "signin";
  const [mode, setMode] = useState<"signin" | "signup" | "forgot" | "confirm_sent">(initialMode);
  
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"founder" | "investor">("founder");

  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const queryMode = searchParams.get("mode");
    if (queryMode === "signup" || queryMode === "signin") {
      setMode(queryMode);
    }
    
    const errorParam = searchParams.get("error");
    if (errorParam === "verification_failed") {
      setErrorMsg("Email verification link could not be verified or has expired. Please try again.");
    }
  }, [searchParams]);

  const handleModeChange = (newMode: "signin" | "signup" | "forgot") => {
    setMode(newMode);
    setErrorMsg("");
    setSuccessMsg("");
    setPassword("");
    setFullName("");
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setErrorMsg("");
    await signInWithGoogle();
    setLoading(false);
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMsg("Please enter both email and password.");
      return;
    }

    setLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    const { error } = await signInWithEmail(email, password);

    if (error) {
      if (error.message.toLowerCase().includes("confirm") || error.message.toLowerCase().includes("verified")) {
        setErrorMsg("Please check your email to confirm your account before signing in.");
      } else {
        setErrorMsg(error.message);
      }
      setLoading(false);
    } else {
      router.push("/dashboard");
      router.refresh();
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) {
      setErrorMsg("Please enter your full name.");
      return;
    }
    if (!email || !password) {
      setErrorMsg("Please enter both email and password.");
      return;
    }
    if (password.length < 8) {
      setErrorMsg("Password must be at least 8 characters long.");
      return;
    }

    setLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    const { error } = await signUpWithEmail(email, password);

    if (error) {
      setErrorMsg(error.message);
      setLoading(false);
    } else {
      setMode("confirm_sent");
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setErrorMsg("Please enter your email address.");
      return;
    }

    setLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      const supabase = (await import("@/lib/supabase/client")).createClient();
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        setErrorMsg(error.message);
      } else {
        setSuccessMsg("Check your email for password reset instructions.");
      }
    } catch (err: any) {
      setErrorMsg(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md w-full bg-[rgba(16,20,28,0.6)] backdrop-blur-xl border border-[rgba(255,255,255,0.05)] rounded-xl p-6 shadow-[0_8px_60px_rgba(0,0,0,0.5)] hover:border-[rgba(0,229,255,0.08)] transition-all duration-500">
      {(mode === "signin" || mode === "signup") && (
        <div className="flex bg-[rgba(255,255,255,0.02)] p-1 rounded-lg border border-[rgba(255,255,255,0.03)] mb-6">
          <button
            type="button"
            onClick={() => handleModeChange("signin")}
            className={`flex-1 text-center text-sm font-medium py-2 rounded-md transition-all duration-300 cursor-pointer ${
              mode === "signin"
                ? "bg-gradient-to-r from-[#00E5FF] to-[#7000FF] text-white shadow-xs"
                : "text-[rgba(255,255,255,0.3)] hover:text-white"
            }`}
          >
            Sign in
          </button>
          <button
            type="button"
            onClick={() => handleModeChange("signup")}
            className={`flex-1 text-center text-sm font-medium py-2 rounded-md transition-all duration-300 cursor-pointer ${
              mode === "signup"
                ? "bg-gradient-to-r from-[#00E5FF] to-[#7000FF] text-white shadow-xs"
                : "text-[rgba(255,255,255,0.3)] hover:text-white"
            }`}
          >
            Sign up
          </button>
        </div>
      )}

      <div className="space-y-1.5 mb-6 text-left">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[rgba(0,229,255,0.05)] border border-[rgba(0,229,255,0.1)] rounded-full text-[11px] font-medium text-[#00E5FF] select-none tracking-tight mb-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[#00E5FF] animate-pulse" />
          {mode === "confirm_sent" ? "Confirm Email" : "Authentication"}
        </div>
        <h2 className="text-xl font-medium text-white">
          {mode === "signin" && "Welcome back"}
          {mode === "signup" && "Create account"}
          {mode === "forgot" && "Reset password"}
          {mode === "confirm_sent" && "Verify your email"}
        </h2>
        <p className="text-sm text-[rgba(255,255,255,0.4)]">
          {mode === "signin" && "Enter your credentials to access your dashboard."}
          {mode === "signup" && "Select your role and enter details to get started."}
          {mode === "forgot" && "Enter your email address to receive a password reset link."}
          {mode === "confirm_sent" && "We have sent a verification link to your email address."}
        </p>
      </div>

      {errorMsg && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-3 mb-4 rounded-lg bg-[rgba(255,68,68,0.05)] border border-[rgba(255,68,68,0.15)] text-[#FF4444] text-sm font-medium flex items-center gap-2"
        >
          <IconX className="w-4 h-4" />
          {errorMsg}
        </motion.div>
      )}
      {successMsg && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-3 mb-4 rounded-lg bg-[rgba(0,255,163,0.05)] border border-[rgba(0,255,163,0.15)] text-[#00FFA3] text-sm font-medium flex items-center gap-2"
        >
          <IconCheck className="w-4 h-4" />
          {successMsg}
        </motion.div>
      )}

      {(mode === "signin" || mode === "signup") && (
        <>
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full h-[44px] flex items-center justify-center gap-3 border border-[rgba(255,255,255,0.08)] bg-white/[0.03] text-white text-sm font-medium rounded-xl hover:bg-white/[0.06] transition-all duration-300 cursor-pointer disabled:opacity-50"
          >
            <IconGoogle className="w-5 h-5" />
            Continue with Google
          </button>

          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[rgba(255,255,255,0.05)]" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-3 bg-[rgba(16,20,28,0.8)] text-[rgba(255,255,255,0.2)]">or continue with email</span>
            </div>
          </div>
        </>
      )}

      {mode === "confirm_sent" ? (
        <div className="space-y-4 text-center">
          <div className="p-4 bg-[rgba(0,255,163,0.02)] border border-[rgba(0,255,163,0.05)] rounded-xl text-left space-y-2">
            <p className="text-sm text-white font-medium">Next steps:</p>
            <ol className="text-xs text-[rgba(255,255,255,0.4)] list-decimal list-inside space-y-1.5 leading-relaxed">
              <li>Open your email inbox for <strong className="text-white font-medium">{email}</strong>.</li>
              <li>Click the confirmation link sent to you.</li>
              <li>You will be redirected automatically to your workspace.</li>
            </ol>
          </div>
          <button
            type="button"
            onClick={() => handleModeChange("signin")}
            className="w-full text-center text-sm font-medium text-[#00E5FF] hover:text-[#00E5FF]/80 transition-colors duration-300 mt-4 cursor-pointer"
          >
            Back to sign in
          </button>
        </div>
      ) : (
        <form
          onSubmit={
            mode === "signin"
              ? handleSignIn
              : mode === "signup"
              ? handleSignUp
              : handleForgotPassword
          }
          className="space-y-4 text-left"
        >
          {mode === "signup" && (
            <div className="space-y-2">
              <label className="text-xs font-medium text-[rgba(255,255,255,0.4)]">I am a</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setRole("founder")}
                  className={`py-2 px-3 border rounded-lg text-sm font-medium text-center transition-all duration-300 cursor-pointer ${
                    role === "founder"
                      ? "border-[#00E5FF] bg-[rgba(0,229,255,0.05)] text-[#00E5FF]"
                      : "border-[rgba(255,255,255,0.05)] text-[rgba(255,255,255,0.3)] hover:text-white bg-[rgba(10,10,18,0.4)]"
                  }`}
                >
                  Founder
                </button>
                <button
                  type="button"
                  onClick={() => setRole("investor")}
                  className={`py-2 px-3 border rounded-lg text-sm font-medium text-center transition-all duration-300 cursor-pointer ${
                    role === "investor"
                      ? "border-[#7000FF] bg-[rgba(112,0,255,0.05)] text-[#7000FF]"
                      : "border-[rgba(255,255,255,0.05)] text-[rgba(255,255,255,0.3)] hover:text-white bg-[rgba(10,10,18,0.4)]"
                  }`}
                >
                  Investor
                </button>
              </div>
            </div>
          )}

          {mode === "signup" && (
            <div className="space-y-1.5 animate-in fade-in duration-100">
              <label htmlFor="fullName" className="text-xs font-medium text-[rgba(255,255,255,0.4)]">
                Full name
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[rgba(255,255,255,0.15)]">
                  <IconUser className="w-4 h-4" />
                </div>
                <input
                  id="fullName"
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Alex Rivera"
                  className="w-full h-[40px] pl-9 pr-3 border border-[rgba(255,255,255,0.05)] bg-[rgba(10,10,18,0.4)] text-white rounded-xl text-sm placeholder:text-[rgba(255,255,255,0.2)] focus:outline-hidden focus:border-[#00E5FF] focus:ring-1 focus:ring-[#00E5FF] transition-all duration-300 hover:border-[rgba(255,255,255,0.1)]"
                />
              </div>
            </div>
          )}

          <div className="space-y-1.5">
            <label htmlFor="email" className="text-xs font-medium text-[rgba(255,255,255,0.4)]">
              Email address
            </label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[rgba(255,255,255,0.15)]">
                <IconMail className="w-4 h-4" />
              </div>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@company.com"
                className="w-full h-[40px] pl-9 pr-3 border border-[rgba(255,255,255,0.05)] bg-[rgba(10,10,18,0.4)] text-white rounded-xl text-sm placeholder:text-[rgba(255,255,255,0.2)] focus:outline-hidden focus:border-[#00E5FF] focus:ring-1 focus:ring-[#00E5FF] transition-all duration-300 hover:border-[rgba(255,255,255,0.1)]"
              />
            </div>
          </div>

          {mode !== "forgot" && (
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="text-xs font-medium text-[rgba(255,255,255,0.4)]">
                  Password
                </label>
                {mode === "signin" && (
                  <button
                    type="button"
                    onClick={() => handleModeChange("forgot")}
                    className="text-xs font-medium text-[#00E5FF] hover:text-[#00E5FF]/80 transition-colors duration-300 cursor-pointer"
                  >
                    Forgot password?
                  </button>
                )}
              </div>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[rgba(255,255,255,0.15)]">
                  <IconLock className="w-4 h-4" />
                </div>
                <input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full h-[40px] pl-9 pr-3 border border-[rgba(255,255,255,0.05)] bg-[rgba(10,10,18,0.4)] text-white rounded-xl text-sm placeholder:text-[rgba(255,255,255,0.2)] focus:outline-hidden focus:border-[#00E5FF] focus:ring-1 focus:ring-[#00E5FF] transition-all duration-300 hover:border-[rgba(255,255,255,0.1)]"
                />
              </div>
            </div>
          )}

          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading}
            className="w-full h-[40px] mt-2 bg-gradient-to-r from-[#00E5FF] to-[#7000FF] text-white text-sm font-medium rounded-xl hover:shadow-[0_0_40px_rgba(0,229,255,0.2)] active:scale-98 transition-all duration-300 flex items-center justify-center cursor-pointer focus:outline-hidden disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            ) : mode === "signin" ? (
              "Sign in"
            ) : mode === "signup" ? (
              "Create account"
            ) : (
              "Reset password"
            )}
          </motion.button>

          {mode === "forgot" && (
            <button
              type="button"
              onClick={() => handleModeChange("signin")}
              className="w-full text-center text-sm font-medium text-[rgba(255,255,255,0.3)] hover:text-white transition-colors duration-300 mt-4 cursor-pointer flex items-center justify-center gap-1"
            >
              <IconArrowLeft className="w-4 h-4" />
              Back to sign in
            </button>
          )}
        </form>
      )}
    </div>
  );
}

export default function AuthPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#0B0F17] overflow-x-hidden">
      <AuthBackground />
      <div className="fixed inset-0 -z-5 bg-gradient-to-b from-[#0B0F17]/60 via-transparent to-[#0B0F17]/90 pointer-events-none" />

      <Navbar />

      <main className="relative z-10 flex-1 flex items-center justify-center p-6 py-16">
        <Suspense
          fallback={
            <div className="max-w-md w-full bg-[rgba(16,20,28,0.6)] backdrop-blur-xl border border-[rgba(255,255,255,0.05)] rounded-xl p-6 shadow-[0_8px_60px_rgba(0,0,0,0.5)] text-center">
              <div className="relative w-8 h-8 border-2 border-[#00E5FF] border-t-transparent rounded-full animate-spin mx-auto mb-2" />
              <p className="text-sm text-[rgba(255,255,255,0.3)]">Loading authentication...</p>
            </div>
          }
        >
          <AuthForm />
        </Suspense>
      </main>

      <Footer />
    </div>
  );
}