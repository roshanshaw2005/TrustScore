"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { PerspectiveCamera, Float, Sparkles, Torus } from "@react-three/drei";
import * as THREE from "three";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

const TrustCore = () => {
  const meshRef = useRef<THREE.Mesh>(null!);
  const { mouse } = useThree();
  
  useFrame((state) => {
    if (meshRef.current) {
      const x = (mouse.x - 0) * 0.3;
      const y = (mouse.y - 0) * 0.2;
      meshRef.current.rotation.x += (y - meshRef.current.rotation.x) * 0.02;
      meshRef.current.rotation.y += (x - meshRef.current.rotation.y) * 0.02;
      const time = state.clock.getElapsedTime();
      meshRef.current.position.y = Math.sin(time * 0.5) * 0.15;
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5}>
      <mesh ref={meshRef} scale={2.2}>
        <icosahedronGeometry args={[1, 2]} />
        <meshPhysicalMaterial
          color="#00E5FF"
          metalness={0.9}
          roughness={0.1}
          clearcoat={1}
          clearcoatRoughness={0.05}
          transmission={0.85}
          thickness={0.5}
          envMapIntensity={1.5}
          emissive="#00E5FF"
          emissiveIntensity={0.3}
          transparent
          opacity={0.92}
        />
      </mesh>
    </Float>
  );
};

const ParticleSystem = () => {
  const particlesRef = useRef<THREE.Points>(null!);
  const count = 200;
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  
  useEffect(() => {
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 8;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 8;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 8;
      colors[i * 3] = 0;
      colors[i * 3 + 1] = 0.9 + Math.random() * 0.1;
      colors[i * 3 + 2] = 1;
    }
  }, []);

  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y = state.clock.getElapsedTime() * 0.02;
      particlesRef.current.rotation.x = Math.sin(state.clock.getElapsedTime() * 0.01) * 0.05;
    }
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.03}
        transparent
        opacity={0.6}
        blending={THREE.AdditiveBlending}
        vertexColors
        sizeAttenuation
      />
    </points>
  );
};

const RingSystem = () => {
  const ringRef = useRef<THREE.Mesh>(null!);
  
  useFrame((state) => {
    if (ringRef.current) {
      ringRef.current.rotation.x = Math.sin(state.clock.getElapsedTime() * 0.1) * 0.3;
      ringRef.current.rotation.z = Math.cos(state.clock.getElapsedTime() * 0.08) * 0.2;
    }
  });

  return (
    <group ref={ringRef}>
      <Torus args={[1.8, 0.02, 16, 100]} rotation={[Math.PI / 2, 0, 0]}>
        <meshPhysicalMaterial
          color="#7000FF"
          emissive="#7000FF"
          emissiveIntensity={0.3}
          transparent
          opacity={0.3}
          metalness={0.8}
          roughness={0.2}
        />
      </Torus>
      <Torus args={[2.1, 0.015, 16, 100]} rotation={[Math.PI / 3, 0.2, 0]}>
        <meshPhysicalMaterial
          color="#00FFA3"
          emissive="#00FFA3"
          emissiveIntensity={0.2}
          transparent
          opacity={0.2}
          metalness={0.8}
          roughness={0.2}
        />
      </Torus>
    </group>
  );
};

const FloatingOrb = ({ position, color, delay }: { position: [number, number, number]; color: string; delay: number }) => {
  const orbRef = useRef<THREE.Mesh>(null!);
  
  useFrame((state) => {
    if (orbRef.current) {
      const time = state.clock.getElapsedTime() + delay;
      orbRef.current.position.y += Math.sin(time * 0.5) * 0.001;
      orbRef.current.rotation.x += 0.01;
      orbRef.current.rotation.y += 0.02;
    }
  });

  return (
    <Float speed={1} rotationIntensity={0.1} floatIntensity={0.3}>
      <mesh ref={orbRef} position={position}>
        <sphereGeometry args={[0.15, 16, 16]} />
        <meshPhysicalMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.5}
          transparent
          opacity={0.6}
          metalness={0.9}
          roughness={0.1}
        />
      </mesh>
    </Float>
  );
};

const AboutScene = () => {
  return (
    <div className="fixed inset-0 w-full h-full -z-10 pointer-events-none">
      <Canvas style={{ background: "#030305" }} dpr={[1, 2]}>
        <PerspectiveCamera makeDefault position={[0, 0, 5]} fov={45} />
        <ambientLight intensity={0.3} color="#00E5FF" />
        <directionalLight position={[5, 5, 5]} intensity={0.8} color="#7000FF" />
        <directionalLight position={[-5, -2, 5]} intensity={0.5} color="#00E5FF" />
        <pointLight position={[0, 0, 3]} intensity={1} color="#00FFA3" />
        <ParticleSystem />
        <RingSystem />
        <TrustCore />
        <FloatingOrb position={[2.5, 1.5, -1]} color="#00E5FF" delay={0} />
        <FloatingOrb position={[-2.3, -1.2, -1.5]} color="#7000FF" delay={1} />
        <FloatingOrb position={[1.8, -2, -2]} color="#00FFA3" delay={2} />
        <FloatingOrb position={[-2.8, 1.8, -2.5]} color="#C8A451" delay={0.5} />
        <Sparkles count={100} scale={[8, 8, 8]} size={0.02} speed={0.3} color="#00E5FF" opacity={0.4} />
        <Sparkles count={50} scale={[8, 8, 8]} size={0.015} speed={0.2} color="#7000FF" opacity={0.3} />
      </Canvas>
    </div>
  );
};

const IconCheck = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const IconDatabase = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 5.625c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125" />
  </svg>
);

const IconShield = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12Z" />
  </svg>
);

const IconTrending = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18 9 11.25l4.306 4.307a11.95 11.95 0 0 1 5.814-5.518l2.74-1.22m0 0-3.75-1.002m3.75 1.003-1.002 3.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
  </svg>
);

const IconGlobe = ({ className = "w-48 h-48" }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18ZM2.25 12h19.5M12 2.25a15.75 15.75 0 0 1 6.25 12 15.75 15.75 0 0 1-6.25 12 15.75 15.75 0 0 1-6.25-12 15.75 15.75 0 0 1 6.25-12Z" />
  </svg>
);

const IconArrowRight = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12h15m0 0-6.75-6.75M19.5 12l-6.75 6.75" />
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
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{ duration: 0.7, delay, ease: [0.23, 1, 0.32, 1] }}
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
      transition={{ duration: 0.6, delay, ease: [0.23, 1, 0.32, 1] }}
      className={className}
      whileHover={{ 
        y: -4,
        boxShadow: "0 8px 40px rgba(0, 229, 255, 0.08), 0 0 80px rgba(0, 229, 255, 0.02)"
      }}
    >
      {children}
    </motion.div>
  );
};

export default function About() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [productsOpen, setProductsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-[#030305] overflow-x-hidden">
      <AboutScene />
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

      <main className="relative z-10 flex-1 w-full max-w-[1100px] mx-auto px-4 md:px-6 py-12 flex flex-col gap-24">
        
        <AnimatedSection className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center w-full mt-6">
          <div className="flex flex-col gap-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 bg-[rgba(0,229,255,0.05)] border border-[rgba(0,229,255,0.1)] rounded-full w-fit"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#00E5FF] animate-pulse" />
              <span className="text-[10px] font-mono tracking-wider text-[#00E5FF] uppercase">Trust Intelligence</span>
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-4xl md:text-5xl lg:text-6xl font-medium tracking-tight text-white leading-[1.1]"
            >
              Our Mission Is to Build the
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00E5FF] via-[#7000FF] to-[#00FFA3]"> World's Most Trusted</span>
              <br />
              Startup Directory.
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-base md:text-lg text-[rgba(255,255,255,0.6)] leading-relaxed max-w-xl"
            >
              We believe transparency accelerates innovation and reduces friction for both founders and investors.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="flex items-center gap-4"
            >
              <Link
                href="/register"
                className="px-8 py-3.5 bg-gradient-to-r from-[#00E5FF] to-[#7000FF] text-white text-sm font-medium rounded-button hover:shadow-[0_0_40px_rgba(0,229,255,0.3)] active:scale-98 transition-all duration-300 inline-flex items-center gap-2"
              >
                Get Started
                <IconArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/demo"
                className="px-8 py-3.5 border border-[rgba(255,255,255,0.08)] text-white/80 text-sm font-medium rounded-button hover:border-[rgba(0,229,255,0.3)] hover:text-white transition-all duration-300"
              >
                View Demo
              </Link>
            </motion.div>
          </div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="w-full flex justify-center"
          >
            <div className="relative w-full max-w-[500px] aspect-square">
              <div className="absolute inset-0 bg-gradient-to-br from-[#00E5FF]/5 via-[#7000FF]/5 to-[#00FFA3]/5 rounded-2xl border border-[rgba(255,255,255,0.05)] blur-2xl" />
              <div className="relative w-full h-full bg-[rgba(10,10,18,0.4)] backdrop-blur-sm rounded-2xl border border-[rgba(255,255,255,0.05)] p-8 flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-[#00E5FF]/10 via-transparent to-[#7000FF]/10" />
                <div className="relative z-10 flex flex-col items-center gap-6">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#00E5FF] to-[#7000FF] p-0.5">
                    <div className="w-full h-full rounded-full bg-[#030305] flex items-center justify-center">
                      <span className="text-3xl font-bold text-white">AI</span>
                    </div>
                  </div>
                  <div className="text-center">
                    <p className="text-[rgba(255,255,255,0.4)] font-mono text-xs tracking-wider uppercase">TrustScore Engine</p>
                    <p className="text-2xl font-bold text-white">98.4%</p>
                    <p className="text-[rgba(255,255,255,0.4)] text-sm">Extraction Accuracy</p>
                  </div>
                  <div className="flex gap-4">
                    <div className="text-center">
                      <p className="text-[#00FFA3] text-xl font-bold">$1M+</p>
                      <p className="text-[rgba(255,255,255,0.3)] text-xs font-mono">Verified Pipeline</p>
                    </div>
                    <div className="w-px bg-[rgba(255,255,255,0.05)]" />
                    <div className="text-center">
                      <p className="text-[#00E5FF] text-xl font-bold">50+</p>
                      <p className="text-[rgba(255,255,255,0.3)] text-xs font-mono">Startups Verified</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatedSection>

        <AnimatedSection delay={0.1} className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full border-t border-[rgba(255,255,255,0.05)] pt-16">
          <div className="md:col-span-1 flex flex-col gap-2">
            <h2 className="text-2xl font-medium text-white tracking-tight">
              Bridging the Trust Gap.
            </h2>
            <div className="w-12 h-1 bg-gradient-to-r from-[#00E5FF] to-[#7000FF] rounded-full mt-1" />
            <p className="text-sm text-[rgba(255,255,255,0.3)] font-mono mt-2">01 — Core Thesis</p>
          </div>
          
          <div className="md:col-span-2 flex flex-col gap-6">
            <p className="text-sm md:text-base text-[rgba(255,255,255,0.6)] leading-relaxed">
              Startup validation is often opaque and manual. Founders spend countless hours repeating the same due diligence processes, while investors navigate fragmented data that is difficult to verify at scale.
            </p>
            <p className="text-sm md:text-base text-[rgba(255,255,255,0.6)] leading-relaxed">
              TrustScore AI was built to provide a standardized, evidence-backed layer of credibility to the ecosystem. By centralizing verification, we empower stakeholders to focus on building rather than auditing.
            </p>
          </div>
        </AnimatedSection>

        <AnimatedSection delay={0.2} className="w-full flex flex-col items-center border-t border-[rgba(255,255,255,0.05)] pt-16">
          <h2 className="text-2xl md:text-3xl font-medium text-white text-center tracking-tight mb-4">
            Scaling Credibility.
          </h2>
          <p className="text-sm md:text-base text-[rgba(255,255,255,0.6)] text-center leading-relaxed max-w-2xl mb-12">
            We combine automated data extraction with human-in-the-loop verification to create a verifiable score.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
            <AnimatedCard delay={0.1}>
              <div className="bg-[rgba(10,10,18,0.6)] backdrop-blur-xl border border-[rgba(255,255,255,0.05)] rounded-card p-6 flex flex-col gap-4 hover:border-[rgba(0,229,255,0.2)] transition-all duration-500 group">
                <div className="w-12 h-12 rounded-full bg-[rgba(0,229,255,0.05)] border border-[rgba(0,229,255,0.1)] flex items-center justify-center text-[#00E5FF] group-hover:shadow-[0_0_30px_rgba(0,229,255,0.1)] transition-all duration-500">
                  <IconDatabase className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-medium text-white">Automated Validation</h3>
                <p className="text-xs md:text-sm text-[rgba(255,255,255,0.6)] leading-relaxed">
                  We pull data directly from connected SaaS tools to ensure accuracy and real-time validity.
                </p>
                <div className="mt-2 flex items-center gap-2 text-xs font-mono text-[rgba(255,255,255,0.2)] group-hover:text-[rgba(0,229,255,0.4)] transition-colors duration-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00E5FF] animate-pulse" />
                  <span>AI-Powered</span>
                </div>
              </div>
            </AnimatedCard>

            <AnimatedCard delay={0.2}>
              <div className="bg-[rgba(10,10,18,0.6)] backdrop-blur-xl border border-[rgba(255,255,255,0.05)] rounded-card p-6 flex flex-col gap-4 hover:border-[rgba(112,0,255,0.2)] transition-all duration-500 group">
                <div className="w-12 h-12 rounded-full bg-[rgba(112,0,255,0.05)] border border-[rgba(112,0,255,0.1)] flex items-center justify-center text-[#7000FF] group-hover:shadow-[0_0_30px_rgba(112,0,255,0.1)] transition-all duration-500">
                  <IconShield className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-medium text-white">Human Review</h3>
                <p className="text-xs md:text-sm text-[rgba(255,255,255,0.6)] leading-relaxed">
                  Expert analysts verify sensitive claims that machines can't catch, adding a layer of nuanced judgment.
                </p>
                <div className="mt-2 flex items-center gap-2 text-xs font-mono text-[rgba(255,255,255,0.2)] group-hover:text-[rgba(112,0,255,0.4)] transition-colors duration-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#7000FF] animate-pulse" />
                  <span>Human Verified</span>
                </div>
              </div>
            </AnimatedCard>

            <AnimatedCard delay={0.3}>
              <div className="bg-[rgba(10,10,18,0.6)] backdrop-blur-xl border border-[rgba(255,255,255,0.05)] rounded-card p-6 flex flex-col gap-4 hover:border-[rgba(0,255,163,0.2)] transition-all duration-500 group">
                <div className="w-12 h-12 rounded-full bg-[rgba(0,255,163,0.05)] border border-[rgba(0,255,163,0.1)] flex items-center justify-center text-[#00FFA3] group-hover:shadow-[0_0_30px_rgba(0,255,163,0.1)] transition-all duration-500">
                  <IconTrending className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-medium text-white">Dynamic Score</h3>
                <p className="text-xs md:text-sm text-[rgba(255,255,255,0.6)] leading-relaxed">
                  Profiles stay updated in real-time as a startup grows and scales, reflecting their current health.
                </p>
                <div className="mt-2 flex items-center gap-2 text-xs font-mono text-[rgba(255,255,255,0.2)] group-hover:text-[rgba(0,255,163,0.4)] transition-colors duration-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00FFA3] animate-pulse" />
                  <span>Real-time</span>
                </div>
              </div>
            </AnimatedCard>
          </div>
        </AnimatedSection>

        <AnimatedSection delay={0.3} className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
          <motion.div 
            className="bg-[rgba(10,10,18,0.6)] backdrop-blur-xl border border-[rgba(255,255,255,0.05)] rounded-card p-8 flex flex-col gap-6 hover:border-[rgba(0,229,255,0.15)] transition-all duration-500 group"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
            viewport={{ once: true }}
          >
            <h3 className="text-xl font-medium text-white">Our Core Principles.</h3>
            <ul className="flex flex-col gap-4 mt-2">
              {[
                "Transparency is the default.",
                "Evidence over assertions.",
                "Privacy is a right, not an option."
              ].map((principle, index) => (
                <motion.li 
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="flex items-start gap-3 text-sm text-[rgba(255,255,255,0.6)] leading-relaxed"
                >
                  <div className="w-5 h-5 rounded-full bg-[rgba(0,255,163,0.05)] border border-[rgba(0,255,163,0.1)] flex items-center justify-center text-[#00FFA3] flex-shrink-0 mt-0.5 group-hover:border-[rgba(0,255,163,0.3)] transition-all duration-300">
                    <IconCheck className="w-3 h-3" />
                  </div>
                  <span>{principle}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          <motion.div 
            className="bg-gradient-to-br from-[rgba(0,229,255,0.05)] via-[rgba(112,0,255,0.02)] to-[rgba(0,255,163,0.02)] border border-[rgba(255,255,255,0.05)] rounded-card p-8 flex flex-col justify-between hover:border-[rgba(0,229,255,0.2)] transition-all duration-500 group gap-8"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
            viewport={{ once: true }}
          >
            <div className="flex flex-col gap-4">
              <h3 className="text-xl font-medium text-white">The Future of Venture.</h3>
              <p className="text-sm text-[rgba(255,255,255,0.6)] leading-relaxed">
                We're building a future where founders spend less time in due diligence and more time building, and where investors can deploy capital with instant, data-backed confidence.
              </p>
            </div>
            <div className="w-full flex justify-center">
              <div className="relative w-48 h-48">
                <div className="absolute inset-0 bg-gradient-to-br from-[#00E5FF]/10 via-[#7000FF]/10 to-[#00FFA3]/10 rounded-full blur-2xl group-hover:blur-3xl transition-all duration-500" />
                <div className="relative w-full h-full bg-[rgba(10,10,18,0.4)] backdrop-blur-sm rounded-full border border-[rgba(255,255,255,0.05)] flex items-center justify-center group-hover:border-[rgba(0,229,255,0.2)] transition-all duration-500">
                  <IconGlobe className="w-32 h-32 text-[rgba(255,255,255,0.1)] group-hover:text-[rgba(0,229,255,0.3)] transition-all duration-500" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#00E5FF] to-[#7000FF] opacity-10 group-hover:opacity-20 transition-all duration-500" />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatedSection>

        <AnimatedSection delay={0.4} className="w-full mb-20">
          <div className="relative bg-[rgba(10,10,18,0.6)] backdrop-blur-xl border border-[rgba(255,255,255,0.05)] rounded-card p-8 md:p-12 text-center flex flex-col items-center gap-6 overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-[#00E5FF]/5 via-[#7000FF]/2 to-[#00FFA3]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#00E5FF]/5 rounded-full blur-3xl group-hover:bg-[#00E5FF]/10 transition-all duration-700" />
            <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-[#7000FF]/5 rounded-full blur-3xl group-hover:bg-[#7000FF]/10 transition-all duration-700" />
            
            <div className="relative z-10 flex flex-col items-center gap-6">
              <motion.div
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                transition={{ duration: 0.5, type: "spring" }}
                viewport={{ once: true }}
                className="w-16 h-16 rounded-full bg-gradient-to-br from-[#00E5FF] to-[#7000FF] p-0.5"
              >
                <div className="w-full h-full rounded-full bg-[#030305] flex items-center justify-center">
                  <span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#00E5FF] to-[#7000FF]">AI</span>
                </div>
              </motion.div>
              
              <h2 className="text-2xl md:text-3xl font-medium tracking-tight text-white">
                Join the Network.
              </h2>
              <p className="text-sm md:text-base text-[rgba(255,255,255,0.6)] max-w-lg leading-relaxed">
                Start building your credibility profile today.
              </p>
              <Link
                href="/register"
                className="px-10 py-4 bg-gradient-to-r from-[#00E5FF] to-[#7000FF] text-white text-sm font-medium rounded-button hover:shadow-[0_0_60px_rgba(0,229,255,0.3)] active:scale-98 transition-all duration-300 inline-flex items-center gap-2 group-hover:shadow-[0_0_40px_rgba(0,229,255,0.15)]"
              >
                Get Started
                <IconArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </AnimatedSection>

      </main>

      <Footer />
    </div>
  );
}