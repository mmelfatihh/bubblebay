import { motion } from "framer-motion";
import { Bubble } from "./Bubble";
import { useState } from "react";

interface LobbyProps {
  onPortalChoose: (type: 'create' | 'join') => void;
}

export const Lobby = ({ onPortalChoose }: LobbyProps) => {
  const width = window.innerWidth;
  const height = window.innerHeight;
  const [poppingState, setPoppingState] = useState<'create' | 'join' | null>(null);

  const handleChoose = (type: 'create' | 'join') => {
      setPoppingState(type);
      setTimeout(() => onPortalChoose(type), 600); 
  };

  // Fixed the 'any' typing here so Vercel doesn't complain about Easing types
  const portalVariants: any = {
      hidden: { 
          left: "50%", 
          scale: 0, 
          opacity: 0 
      },
      idle: { 
          scale: 1, 
          opacity: 1,
          y: [0, -10, 0],
          transition: { 
              y: { duration: 4, repeat: Infinity, ease: "easeInOut" },
              scale: { type: "spring", stiffness: 100, damping: 15, delay: 0.3 }, 
              left: { type: "spring", stiffness: 80, damping: 18, delay: 0.1 }
          }
      },
      popping: { 
          scale: [1, 0.9, 20], 
          opacity: [1, 1, 0],
          transition: { duration: 0.6, times: [0, 0.3, 1], ease: "circIn" }
      },
      faded: { scale: 0, opacity: 0, transition: { duration: 0.3 } }
  };

  return (
    <>
      <motion.div 
        className="absolute top-1/2 z-10 pointer-events-none"
        initial="hidden"
        animate={poppingState === 'create' ? 'popping' : (poppingState === 'join' ? 'faded' : 'idle')}
        style={{ left: "30%" }}
        variants={{
            ...portalVariants,
            idle: { ...portalVariants.idle, left: "30%" }
        }}
      >
         <div className="-translate-x-1/2 -translate-y-1/2 flex items-center justify-center relative w-[180px] h-[180px] rounded-full"
            style={{
                background: "radial-gradient(120% 120% at 50% 50%, rgba(34, 211, 238, 0.1) 0%, rgba(34, 211, 238, 0.02) 80%, rgba(34, 211, 238, 0.05) 100%)",
                backdropFilter: "blur(4px)",
                border: "1px solid rgba(165, 243, 252, 0.2)",
                boxShadow: `inset -10px -10px 20px rgba(6, 182, 212, 0.3), inset 10px 10px 20px rgba(207, 250, 254, 0.2), 0 0 30px rgba(34, 211, 238, 0.1)`
            }}
         >
            <motion.div className="absolute inset-0 rounded-full border-[1px] border-cyan-400/30" animate={poppingState ? {} : { rotate: 360 }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }} />
            <div className="absolute top-4 left-6 w-16 h-8 bg-white opacity-20 rounded-[50%] rotate-[-45deg] blur-[8px]" />
            <span className="text-cyan-100 font-light text-sm tracking-[0.2em] uppercase drop-shadow-[0_0_10px_rgba(34,211,238,0.5)]">Create</span>
         </div>
      </motion.div>

      <motion.div 
        className="absolute top-1/2 z-10 pointer-events-none"
        initial="hidden"
        animate={poppingState === 'join' ? 'popping' : (poppingState === 'create' ? 'faded' : 'idle')}
        style={{ left: "70%" }}
        variants={{
            ...portalVariants,
            idle: { ...portalVariants.idle, left: "70%" }
        }}
      >
         <div className="-translate-x-1/2 -translate-y-1/2 flex items-center justify-center relative w-[180px] h-[180px] rounded-full"
            style={{
                background: "radial-gradient(120% 120% at 50% 50%, rgba(192, 132, 252, 0.1) 0%, rgba(192, 132, 252, 0.02) 80%, rgba(192, 132, 252, 0.05) 100%)",
                backdropFilter: "blur(4px)",
                border: "1px solid rgba(233, 213, 255, 0.2)",
                boxShadow: `inset -10px -10px 20px rgba(147, 51, 234, 0.3), inset 10px 10px 20px rgba(243, 232, 255, 0.2), 0 0 30px rgba(168, 85, 247, 0.1)`
            }}
         >
             <motion.div className="absolute inset-0 rounded-full border-[1px] border-purple-400/30" animate={poppingState ? {} : { rotate: -360 }} transition={{ duration: 25, repeat: Infinity, ease: "linear" }} />
            <div className="absolute top-4 left-6 w-16 h-8 bg-white opacity-20 rounded-[50%] rotate-[-45deg] blur-[8px]" />
            <span className="text-purple-100 font-light text-sm tracking-[0.2em] uppercase drop-shadow-[0_0_10px_rgba(168,85,247,0.5)]">Join</span>
         </div>
      </motion.div>

      {!poppingState && (
        <motion.div
            initial={{ y: height + 200 }}
            animate={{ y: 0 }}
            transition={{ type: "spring", damping: 20, delay: 0.8 }}
            className="absolute inset-0 z-20 pointer-events-none"
        >
            <div className="pointer-events-auto w-full h-full">
                <Bubble 
                    label="ME"
                    startPos={{ x: width / 2, y: height * 0.85 }} 
                    portalTargets={[
                        { x: width * 0.3, y: height * 0.5, action: () => handleChoose('create') },
                        { x: width * 0.7, y: height * 0.5, action: () => handleChoose('join') }
                    ]}
                />
            </div>
        </motion.div>
      )}
    </>
  );
};