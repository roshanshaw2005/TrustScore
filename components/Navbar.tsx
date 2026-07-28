"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { User } from "@supabase/supabase-js";
import { motion, AnimatePresence } from "framer-motion";

interface NavItem {
  label: string;
  href: string;
}

export interface NavbarProps {
  isLoggedIn?: boolean;
  onAuthToggle?: () => void;
  productsOpenOverride?: boolean;
  profileOpenOverride?: boolean;
  onProductsOpenChange?: (open: boolean) => void;
  onProfileOpenChange?: (open: boolean) => void;
}

const LogoIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <path d="m9 11 2 2 4-4" />
  </svg>
);

const IconClose = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const IconMenu = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
  </svg>
);

export default function Navbar({
  productsOpenOverride,
  profileOpenOverride,
  onProductsOpenChange,
  onProfileOpenChange,
}: NavbarProps) {
  const router = useRouter();
  const supabase = createClient();

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasCompanies, setHasCompanies] = useState<boolean>(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  const [internalProductsOpen, setInternalProductsOpen] = useState(false);
  const isProductsOpen = productsOpenOverride !== undefined ? productsOpenOverride : internalProductsOpen;
  
  const setProductsOpen = useCallback((open: boolean) => {
    if (onProductsOpenChange) {
      onProductsOpenChange(open);
    } else {
      setInternalProductsOpen(open);
    }
  }, [onProductsOpenChange]);

  const [internalProfileOpen, setInternalProfileOpen] = useState(false);
  const isProfileOpen = profileOpenOverride !== undefined ? profileOpenOverride : internalProfileOpen;
  
  const setProfileOpen = useCallback((open: boolean) => {
    if (onProfileOpenChange) {
      onProfileOpenChange(open);
    } else {
      setInternalProfileOpen(open);
    }
  }, [onProfileOpenChange]);

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase]);

  useEffect(() => {
    if (!user) {
      setHasCompanies(false);
      return;
    }

    const userId = user.id;

    async function checkCompanies() {
      try {
        const { count, error } = await supabase
          .from("companies")
          .select("id", { count: "exact", head: true })
          .eq("owner_id", userId);

        if (!error && count !== null && count > 0) {
          setHasCompanies(true);
        } else {
          setHasCompanies(false);
        }
      } catch (err) {
        console.error("Error checking companies in Navbar:", err);
      }
    }

    const userRole = user.user_metadata?.role || user.user_metadata?.user_type || "";
    if (userRole === "founder") {
      checkCompanies();
    } else {
      setHasCompanies(false);
    }
  }, [user, supabase]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as HTMLElement;
      if (target && target.closest && target.closest(".preview-control")) {
        return;
      }
      if (profileMenuRef.current && profileMenuRef.current.contains(target)) {
        return;
      }
      setProductsOpen(false);
      setProfileOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [setProductsOpen, setProfileOpen]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setProfileOpen(false);
    setMobileMenuOpen(false);
    router.push("/");
    router.refresh();
  };

  const isLoggedIn = user !== null;
  const userRole = user?.user_metadata?.role || user?.user_metadata?.user_type || "";
  const displayName = user?.user_metadata?.display_name || user?.email || "";
  const userInitials = displayName
    ? displayName.split(/\s+/).map((n: string) => n[0]).join("").slice(0, 2).toUpperCase()
    : "US";

  const getNavLinks = (): NavItem[] => {
    if (!isLoggedIn) {
      return [
        { label: "About", href: "/about" },
        { label: "How it works", href: "/how-it-works" },
      ];
    }
    if (userRole === "founder") {
      return [
        { label: "About", href: "/about" },
        { label: "How it works", href: "/how-it-works" },
      ];
    }
    if (userRole === "investor") {
      return [
        { label: "Directory", href: "/directory" },
        { label: "About", href: "/about" },
        { label: "How it works", href: "/how-it-works" },
      ];
    }
    return [
      { label: "About", href: "/about" },
      { label: "How it works", href: "/how-it-works" },
    ];
  };

  const navLinks = getNavLinks();

  return (
    <nav className="w-full bg-[rgba(10,10,18,0.6)] backdrop-blur-xl border-b border-[rgba(255,255,255,0.03)] sticky top-0 z-50 transition-all duration-300">
      <div className="max-w-[1200px] mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2 group focus:outline-hidden">
            <div className="relative">
              <div className="absolute inset-0 bg-[#00E5FF] blur-md opacity-20 group-hover:opacity-40 transition-opacity duration-300 rounded-full" />
              <LogoIcon className="w-6 h-6 text-[#00E5FF] relative z-10 transition-transform duration-300 group-hover:scale-105" />
            </div>
            <span className="font-medium text-white text-lg tracking-tight bg-gradient-to-r from-white to-[rgba(255,255,255,0.6)] bg-clip-text text-transparent hover:from-[#00E5FF] hover:to-[#7000FF] transition-all duration-300">
              TrustScore AI
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((item) => {
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className="relative px-3 py-1.5 text-sm font-medium text-[rgba(255,255,255,0.4)] hover:text-white transition-colors duration-300 group">
                  {item.label}
                  <span className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-gradient-to-r from-[#00E5FF] to-[#7000FF] transition-all duration-300 group-hover:w-full group-hover:left-0" />
                </Link>
              );
            })}
          </div>
        </div>

        <div className="hidden md:flex items-center gap-4">
          {loading ? (
            <div className="h-9 w-24 bg-[rgba(255,255,255,0.02)] animate-pulse rounded-button border border-[rgba(255,255,255,0.03)]" />
          ) : !isLoggedIn ? (
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Link
                href="/auth?mode=signup"
                className="relative overflow-hidden bg-gradient-to-r from-[#00E5FF] to-[#7000FF] text-white px-5 py-2 text-sm font-medium rounded-button transition-all duration-300 hover:shadow-[0_0_40px_rgba(0,229,255,0.2)] active:scale-98 group"
              >
                <span className="relative z-10">Get started</span>
                <div className="absolute inset-0 bg-gradient-to-r from-[#7000FF] to-[#00E5FF] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </Link>
            </motion.div>
          ) : (
            <div className="relative" ref={profileMenuRef}>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onMouseDown={(e) => e.stopPropagation()}
                onClick={() => {
                  setProfileOpen(!isProfileOpen);
                  setProductsOpen(false);
                }}
                className="relative w-9 h-9 rounded-full bg-gradient-to-br from-[rgba(0,229,255,0.1)] to-[rgba(112,0,255,0.1)] border border-[rgba(255,255,255,0.05)] flex items-center justify-center hover:border-[rgba(0,229,255,0.2)] transition-all duration-300 cursor-pointer focus:outline-hidden select-none group"
                aria-expanded={isProfileOpen}
                aria-haspopup="true"
              >
                <span className="text-sm font-medium text-[#00E5FF] group-hover:text-white transition-colors duration-300">{userInitials}</span>
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#00E5FF]/5 to-[#7000FF]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </motion.button>

              <AnimatePresence>
                {isProfileOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ duration: 0.15, ease: [0.23, 1, 0.32, 1] }}
                    onMouseDown={(e) => e.stopPropagation()}
                    className="absolute right-0 mt-2 w-64 bg-[rgba(10,10,18,0.8)] backdrop-blur-xl border border-[rgba(255,255,255,0.05)] rounded-card p-3 shadow-[0_8px_40px_rgba(0,0,0,0.4)] z-50"
                  >
                    <div className="px-2 pb-2.5 mb-2 border-b border-[rgba(255,255,255,0.03)]">
                      {user?.user_metadata?.display_name ? (
                        <>
                          <p className="text-sm font-medium text-white truncate">{user.user_metadata.display_name}</p>
                          <p className="text-xs text-[rgba(255,255,255,0.3)] truncate mt-0.5">{user.email}</p>
                        </>
                      ) : (
                        <p className="text-sm font-medium text-white truncate">{user.email}</p>
                      )}
                      <p className="text-xs text-[rgba(255,255,255,0.2)] capitalize mt-0.5 font-mono">{userRole}</p>
                    </div>
                    
                    <div className="space-y-0.5">
                      {(userRole === "founder" || userRole === "investor") && (
                        <Link
                          href="/dashboard"
                          onClick={() => setProfileOpen(false)}
                          className="block px-2 py-1.5 text-sm text-[rgba(255,255,255,0.6)] hover:text-white hover:bg-[rgba(255,255,255,0.02)] rounded-button transition-all duration-200"
                        >
                          Dashboard
                        </Link>
                      )}
                      {userRole === "founder" && !hasCompanies && (
                        <Link
                          href="/register"
                          onClick={() => setProfileOpen(false)}
                          className="block px-2 py-1.5 text-sm text-[rgba(255,255,255,0.6)] hover:text-white hover:bg-[rgba(255,255,255,0.02)] rounded-button transition-all duration-200"
                        >
                          Onboard your startup
                        </Link>
                      )}
                      {userRole === "investor" && (
                        <Link
                          href="/investor/register"
                          onClick={() => setProfileOpen(false)}
                          className="block px-2 py-1.5 text-sm text-[rgba(255,255,255,0.6)] hover:text-white hover:bg-[rgba(255,255,255,0.02)] rounded-button transition-all duration-200"
                        >
                          My Profile
                        </Link>
                      )}
                      <Link
                        href="/reset-password"
                        onClick={() => setProfileOpen(false)}
                        className="block px-2 py-1.5 text-sm text-[rgba(255,255,255,0.6)] hover:text-white hover:bg-[rgba(255,255,255,0.02)] rounded-button transition-all duration-200"
                      >
                        Reset password
                      </Link>
                      <button
                        onClick={handleSignOut}
                        className="w-full text-left px-2 py-1.5 text-sm text-[rgba(255,68,68,0.6)] hover:text-[#FF4444] hover:bg-[rgba(255,68,68,0.02)] rounded-button transition-all duration-200 cursor-pointer focus:outline-hidden"
                      >
                        Sign out
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>

        <div className="flex md:hidden items-center gap-3">
          {isLoggedIn && !loading && (
            <button
              onClick={() => {
                setMobileMenuOpen(true);
                setProfileOpen(true);
              }}
              className="w-8 h-8 rounded-full bg-gradient-to-br from-[rgba(0,229,255,0.1)] to-[rgba(112,0,255,0.1)] border border-[rgba(255,255,255,0.05)] flex items-center justify-center focus:outline-hidden"
            >
              <span className="text-xs font-medium text-[#00E5FF]">{userInitials}</span>
            </button>
          )}

          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1.5 -mr-1.5 text-[rgba(255,255,255,0.3)] hover:text-white transition-colors duration-300 cursor-pointer focus:outline-hidden"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <IconClose className="w-6 h-6" /> : <IconMenu className="w-6 h-6" />}
          </motion.button>
        </div>
      </div>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
            className="md:hidden border-t border-[rgba(255,255,255,0.03)] bg-[rgba(10,10,18,0.8)] backdrop-blur-xl px-4 py-4 space-y-4 overflow-hidden"
          >
            <div className="space-y-2">
              {navLinks.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-2 px-2 text-sm font-medium text-[rgba(255,255,255,0.4)] hover:text-white hover:bg-[rgba(255,255,255,0.02)] rounded-button transition-all duration-200"
                >
                  {item.label}
                </Link>
              ))}
            </div>

            <div className="border-t border-[rgba(255,255,255,0.03)] pt-4 space-y-3">
              {loading ? (
                <div className="h-9 w-full bg-[rgba(255,255,255,0.02)] animate-pulse rounded-button border border-[rgba(255,255,255,0.03)]" />
              ) : !isLoggedIn ? (
                <div className="flex flex-col gap-2">
                  <Link
                    href="/auth?mode=signup"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full text-center py-2.5 text-sm font-medium text-white bg-gradient-to-r from-[#00E5FF] to-[#7000FF] rounded-button hover:shadow-[0_0_30px_rgba(0,229,255,0.15)] transition-all duration-300"
                  >
                    Get started
                  </Link>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="px-2 py-1">
                    <p className="text-xs text-[rgba(255,255,255,0.2)]">Signed in as</p>
                    <p className="text-sm font-medium text-white truncate">
                      {user?.user_metadata?.display_name || user.email}
                    </p>
                    {user?.user_metadata?.display_name && (
                      <p className="text-xs text-[rgba(255,255,255,0.2)] truncate mt-0.5">{user.email}</p>
                    )}
                  </div>
                  <div className="space-y-1 pl-2">
                    {(userRole === "founder" || userRole === "investor") && (
                      <Link
                        href="/dashboard"
                        onClick={() => setMobileMenuOpen(false)}
                        className="block py-1.5 text-sm font-medium text-[rgba(255,255,255,0.4)] hover:text-white transition-colors duration-200"
                      >
                        Dashboard
                      </Link>
                    )}
                    {userRole === "founder" && !hasCompanies && (
                      <Link
                        href="/register"
                        onClick={() => setMobileMenuOpen(false)}
                        className="block py-1.5 text-sm font-medium text-[rgba(255,255,255,0.4)] hover:text-white transition-colors duration-200"
                      >
                        Onboard your startup
                      </Link>
                    )}
                    {userRole === "investor" && (
                      <Link
                        href="/investor/register"
                        onClick={() => setMobileMenuOpen(false)}
                        className="block py-1.5 text-sm font-medium text-[rgba(255,255,255,0.4)] hover:text-white transition-colors duration-200"
                      >
                        My Profile
                      </Link>
                    )}
                    <Link
                      href="/reset-password"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block py-1.5 text-sm font-medium text-[rgba(255,255,255,0.4)] hover:text-white transition-colors duration-200"
                    >
                      Reset password
                    </Link>
                    <button
                      onClick={handleSignOut}
                      className="w-full text-left py-1.5 text-sm font-medium text-[rgba(255,68,68,0.4)] hover:text-[#FF4444] transition-colors duration-200 cursor-pointer focus:outline-hidden"
                    >
                      Sign out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}