import { motion } from "framer-motion";

export const Portal = () => {
  return (
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center pointer-events-none z-0">
      
      {/* 1. The Outer Glow (Pulse) */}
      <motion.div
        className="absolute w-[300px] h-[300px] rounded-full opacity-20 blur-3xl"
        style={{ background: "radial-gradient(circle, #a855f7 0%, transparent 70%)" }}
        animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* 2. The Spinning Event Horizon */}
      <motion.div
        className="w-[180px] h-[180px] rounded-full border-[1px] border-purple-500/30"
        style={{ boxShadow: "0 0 40px rgba(168, 85, 247, 0.2), inset 0 0 20px rgba(168, 85, 247, 0.1)" }}
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      >
         {/* Decorative ticks on the ring */}
         <div className="absolute top-0 left-1/2 w-1 h-2 bg-purple-400/50 -translate-x-1/2" />
         <div className="absolute bottom-0 left-1/2 w-1 h-2 bg-purple-400/50 -translate-x-1/2" />
         <div className="absolute left-0 top-1/2 w-2 h-1 bg-purple-400/50 -translate-y-1/2" />
         <div className="absolute right-0 top-1/2 w-2 h-1 bg-purple-400/50 -translate-y-1/2" />
      </motion.div>

      {/* 3. The "Singularity" (Center text) */}
      <div className="absolute text-purple-200/50 text-xs tracking-[0.3em] font-sans font-light uppercase">
        Drag to Enter
      </div>

    </div>
  );
};