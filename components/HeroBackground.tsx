"use client";

import { motion } from "framer-motion";

export function HeroBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Animated gradient orbs - Benin green/yellow */}
      <motion.div
        className="absolute -top-40 -right-40 w-96 h-96 bg-primary/10 rounded-full blur-3xl"
        animate={{ x: [0, 30, 0], y: [0, -20, 0], scale: [1, 1.1, 1] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute -bottom-20 -left-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl"
        animate={{ x: [0, -20, 0], y: [0, 30, 0], scale: [1, 1.15, 1] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-primary/5 rounded-full blur-3xl"
        animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `radial-gradient(circle, #E8112D 1px, transparent 1px)`,
          backgroundSize: "32px 32px",
        }}
      />

      {/* Floating shield icons */}
      {[
        { top: "15%", left: "10%", delay: 0, size: 20 },
        { top: "25%", right: "15%", delay: 1.5, size: 16 },
        { top: "60%", left: "8%", delay: 3, size: 14 },
        { top: "70%", right: "10%", delay: 2, size: 18 },
        { top: "40%", left: "85%", delay: 4, size: 12 },
      ].map((item, i) => (
        <motion.div
          key={i}
          className="absolute text-primary/15"
          style={{ top: item.top, left: item.left, right: item.right }}
          animate={{
            y: [0, -15, 0],
            rotate: [0, 5, -5, 0],
            opacity: [0.15, 0.3, 0.15],
          }}
          transition={{
            duration: 4 + i,
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
