"use client";

import React, { useEffect, useRef } from "react";

export default function GoldCoinCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const coinRef = useRef<HTMLDivElement>(null);

  // raw target position (updated instantly on mousemove)
  const target = useRef({ x: 0, y: 0 });
  // current rendered position (eased toward target every frame)
  const current = useRef({ x: 0, y: 0 });
  const isHovering = useRef(false);
  const rafId = useRef<number | null>(null);

  useEffect(() => {
    // hide native cursor
    document.documentElement.style.cursor = "none";

    const handleMouseMove = (e: MouseEvent) => {
      target.current.x = e.clientX;
      target.current.y = e.clientY;

      const el = e.target as HTMLElement;
      const interactive = el.closest(
        'a, button, input, select, textarea, [role="button"], .cursor-hover'
      );
      isHovering.current = !!interactive;
    };

    const handleMouseDown = () => {
      coinRef.current?.classList.add("coin-pressed");
    };
    const handleMouseUp = () => {
      coinRef.current?.classList.remove("coin-pressed");
    };

    const handleMouseLeave = () => {
      if (cursorRef.current) cursorRef.current.style.opacity = "0";
    };
    const handleMouseEnter = () => {
      if (cursorRef.current) cursorRef.current.style.opacity = "1";
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseenter", handleMouseEnter);

    // smoothing loop
    const speed = 0.18; // lower = smoother/laggier trail, higher = snappier
    const tick = () => {
      current.current.x += (target.current.x - current.current.x) * speed;
      current.current.y += (target.current.y - current.current.y) * speed;

      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${current.current.x}px, ${current.current.y}px, 0) translate(-50%, -50%)`;
      }

      if (coinRef.current) {
        coinRef.current.classList.toggle("coin-hover", isHovering.current);
      }

      rafId.current = requestAnimationFrame(tick);
    };
    rafId.current = requestAnimationFrame(tick);

    return () => {
      document.documentElement.style.cursor = "";
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseenter", handleMouseEnter);
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, []);

  return (
    <div ref={cursorRef} className="gold-coin-cursor-root">
      <div ref={coinRef} className="gold-coin">
        <svg
          viewBox="0 0 64 64"
          width="100%"
          height="100%"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <radialGradient id="coinFace" cx="35%" cy="30%" r="75%">
              <stop offset="0%" stopColor="#FFF3D0" />
              <stop offset="35%" stopColor="#F0CE7C" />
              <stop offset="65%" stopColor="#C8A451" />
              <stop offset="100%" stopColor="#8C6A2C" />
            </radialGradient>
            <linearGradient id="coinRim" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFE9A8" />
              <stop offset="50%" stopColor="#B4863A" />
              <stop offset="100%" stopColor="#6E4E1E" />
            </linearGradient>
          </defs>

          {/* outer rim */}
          <circle cx="32" cy="32" r="30" fill="url(#coinRim)" />
          {/* inner face */}
          <circle cx="32" cy="32" r="25" fill="url(#coinFace)" stroke="#7A5A22" strokeWidth="0.5" />
          {/* rim ridges */}
          <circle cx="32" cy="32" r="28.5" fill="none" stroke="#8C6A2C" strokeWidth="0.6" strokeDasharray="1.5 1.8" opacity="0.6" />
          {/* engraved emblem */}
          <circle cx="32" cy="32" r="17" fill="none" stroke="#7A5A22" strokeWidth="1" opacity="0.5" />
          <text
            x="32"
            y="40"
            textAnchor="middle"
            fontFamily="Georgia, serif"
            fontSize="22"
            fontWeight="700"
            fill="#7A5A22"
            opacity="0.75"
          >
            T
          </text>
          {/* top-left specular highlight */}
          <ellipse cx="23" cy="20" rx="8" ry="5" fill="#FFFFFF" opacity="0.35" />
        </svg>
      </div>
    </div>
  );
}