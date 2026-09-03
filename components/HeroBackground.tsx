"use client";

import { motion } from "framer-motion";

export function HeroBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      {/* Static blobs — blur-3xl is already visually smooth without JS animation */}
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary/8 rounded-full blur-3xl" />
      <div className="absolute -bottom-20 -left-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />

      {/* Dot grid */}
      <div
        className="absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage: "radial-gradient(circle, #E8112D 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      {/* Floating shield icons — y only, GPU composited */}
      {[
        { top: "15%", left: "10%", delay: 0, size: 18 },
        { top: "25%", right: "15%", delay: 1.8, size: 14 },
        { top: "62%", left: "8%", delay: 3.2, size: 13 },
        { top: "68%", right: "10%", delay: 2.2, size: 16 },
      ].map((item, i) => (
        <motion.div
          key={i}
          className="absolute text-primary/12"
          style={{
            top: item.top,
            left: item.left,
            right: item.right,
            willChange: "transform",
          }}
          animate={{ y: [0, -12, 0] }}
          transition={{
            duration: 5 + i * 0.7,
            repeat: Infinity,
            delay: item.delay,
            ease: "easeInOut",
          }}
        >
          <svg width={item.size} height={item.size} viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          </svg>
        </motion.div>
      ))}
    </div>
  );
}
