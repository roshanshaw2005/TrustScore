"use client";

import React, { useState, useRef, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { PerspectiveCamera, Float, Sparkles, Torus, MeshDistortMaterial } from "@react-three/drei";
import * as THREE from "three";
import { motion } from "framer-motion";

const ContactScene = () => {
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
  const count = 80;
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
      <Torus args={[2.2, 0.015, 16, 100]} rotation={[Math.PI / 2, 0, 0]}>
        <meshPhysicalMaterial color="#7000FF" emissive="#7000FF" emissiveIntensity={0.08} transparent opacity={0.08} metalness={0.8} roughness={0.2} />
      </Torus>
      <Torus args={[2.6, 0.01, 16, 100]} rotation={[Math.PI / 3, 0.15, 0]}>
        <meshPhysicalMaterial color="#00FFA3" emissive="#00FFA3" emissiveIntensity={0.06} transparent opacity={0.05} metalness={0.8} roughness={0.2} />
      </Torus>
    </group>
  );
};

const ContactBackground = () => {
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
        <ContactScene />
        <Sparkles count={60} scale={[8, 8, 8]} size={0.015} speed={0.2} color="#00E5FF" opacity={0.15} />
        <Sparkles count={30} scale={[8, 8, 8]} size={0.01} speed={0.15} color="#7000FF" opacity={0.1} />
      </Canvas>
    </div>
  );
};

const IconMail = ({ className = "w-5.5 h-5.5" }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L4.12 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
  </svg>
);

const IconPhone = ({ className = "w-5.5 h-5.5" }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />
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

export default function Contact() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [productsOpen, setProductsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-[#030305] overflow-x-hidden">
      <ContactBackground />
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

      <main className="relative z-10 flex-1 w-full max-w-[1200px] mx-auto px-4 md:px-6 py-16 md:py-24 flex flex-col items-center justify-center gap-10">
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl flex flex-col gap-4"
        >
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[rgba(0,229,255,0.05)] border border-[rgba(0,229,255,0.1)] rounded-full text-[11px] font-medium text-[#00E5FF] select-none tracking-tight w-fit mx-auto">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00E5FF] animate-pulse" />
            Contact Us
          </div>
          <h1 className="text-4xl md:text-5xl font-medium tracking-tight text-white leading-tight">
            Get in Touch
          </h1>
          <p className="text-base md:text-lg text-[rgba(255,255,255,0.4)] leading-relaxed">
            We're here to help you navigate the startup validation ecosystem.
          </p>
        </motion.div>

        <AnimatedCard>
          <div className="w-full max-w-[600px] bg-[rgba(10,10,18,0.6)] backdrop-blur-xl border border-[rgba(255,255,255,0.05)] rounded-card p-8 md:p-12 flex flex-col items-center gap-8 md:gap-10 hover:border-[rgba(0,229,255,0.08)] transition-all duration-500">
            
            <div className="flex flex-col items-center text-center gap-3 w-full group">
              <div className="w-14 h-14 rounded-full bg-[rgba(0,229,255,0.05)] border border-[rgba(0,229,255,0.08)] flex items-center justify-center text-[#00E5FF] group-hover:shadow-[0_0_30px_rgba(0,229,255,0.05)] transition-all duration-500">
                <IconMail className="w-6 h-6" />
              </div>
              <div className="flex flex-col gap-1.5">
                <span className="text-[10px] tracking-wider font-semibold text-[rgba(255,255,255,0.2)] uppercase font-mono">
                  Email Us
                </span>
                <a
                  href="mailto:contact@trustscore.ai"
                  className="text-lg md:text-xl font-medium text-white hover:text-[#00E5FF] hover:underline underline-offset-4 transition-all duration-300"
                >
                  contact@trustscore.ai
                </a>
              </div>
            </div>

            <div className="w-full border-t border-[rgba(255,255,255,0.03)]"></div>

            <div className="flex flex-col items-center text-center gap-3 w-full group">
              <div className="w-14 h-14 rounded-full bg-[rgba(112,0,255,0.05)] border border-[rgba(112,0,255,0.08)] flex items-center justify-center text-[#7000FF] group-hover:shadow-[0_0_30px_rgba(112,0,255,0.05)] transition-all duration-500">
                <IconPhone className="w-6 h-6" />
              </div>
              <div className="flex flex-col gap-1.5">
                <span className="text-[10px] tracking-wider font-semibold text-[rgba(255,255,255,0.2)] uppercase font-mono">
                  Call Us
                </span>
                <a
                  href="tel:+15550000000"
                  className="text-lg md:text-xl font-medium text-white hover:text-[#00E5FF] hover:underline underline-offset-4 transition-all duration-300"
                >
                  +1 (555) 000-0000
                </a>
              </div>
            </div>

          </div>
        </AnimatedCard>

      </main>

      <Footer />
    </div>
  );
}