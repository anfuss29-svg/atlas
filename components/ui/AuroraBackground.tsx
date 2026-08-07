"use client";

import { motion } from "framer-motion";

export default function AuroraBackground() {
  return (
    <div className="fixed inset-0 -z-50 overflow-hidden bg-[#070B14]">

      <motion.div
        animate={{
          x: [0, 120, -80, 0],
          y: [0, -80, 80, 0],
          scale: [1, 1.2, 0.9, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute left-[-10%] top-[-10%] h-[500px] w-[500px] rounded-full bg-blue-500/20 blur-[140px]"
      />

      <motion.div
        animate={{
          x: [0, -150, 80, 0],
          y: [0, 100, -100, 0],
          scale: [1, 0.8, 1.1, 1],
        }}
        transition={{
          duration: 22,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute right-[-10%] top-[20%] h-[500px] w-[500px] rounded-full bg-cyan-400/15 blur-[160px]"
      />

      <motion.div
        animate={{
          x: [0, 100, -120, 0],
          y: [0, -100, 120, 0],
          scale: [1, 1.15, 0.9, 1],
        }}
        transition={{
          duration: 24,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute bottom-[-10%] left-[25%] h-[600px] w-[600px] rounded-full bg-indigo-500/15 blur-[170px]"
      />

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#070B14_90%)]" />
    </div>
  );
}