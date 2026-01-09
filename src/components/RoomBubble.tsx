import { motion } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import { Participant } from "livekit-client";
import { useLiveKitVolume } from "../hooks/useLiveKitVolume";

interface RoomBubbleProps {
  id: string;
  label: string;
  x: number;
  y: number;
  isMe: boolean;
  participant?: Participant; // <--- NEW PROP
  volume: number;
  isMuted: boolean;
  onMuteToggle?: () => void;
  onDragStart?: () => void;
  onDragEnd?: (x: number, y: number, vx: number, vy: number) => void;
}

export const RoomBubble = ({ 
  label, x, y, isMe, participant, isMuted, 
  onMuteToggle, onDragStart, onDragEnd 
}: RoomBubbleProps) => {
  
  const [isDragging, setIsDragging] = useState(false);
  
  // USE THE NEW HOOK: Calculate volume automatically based on the participant
  const liveVolume = useLiveKitVolume(participant);
  
  // Amplify volume slightly for visual impact (max 1.0)
  const displayVolume = Math.min(liveVolume * 1.5, 1);

  const constraintsRef = useRef(null);
  const [dimensions, setDimensions] = useState({ w: 0, h: 0 });

  useEffect(() => {
      setDimensions({ 
          w: window.innerWidth - 130, 
          h: window.innerHeight - 130 
      });
  }, []);

  return (
    <>
      <div className="absolute inset-0 pointer-events-none" ref={constraintsRef} />
      
      <motion.div
        className="absolute flex items-center justify-center rounded-full z-20 cursor-grab active:cursor-grabbing"
        style={{ width: 130, height: 130 }}
        
        drag
        dragMomentum={false} 
        dragConstraints={{ left: 0, right: dimensions.w, top: 0, bottom: dimensions.h }}
        dragElastic={0.2} 
        
        onDragStart={() => {
            setIsDragging(true);
            if (onDragStart) onDragStart();
        }}
        
        onDragEnd={(_, info) => {
            setIsDragging(false);
            if (onDragEnd) {
                onDragEnd(
                    info.point.x - 65, 
                    info.point.y - 65,
                    info.velocity.x * 0.01,
                    info.velocity.y * 0.01
                );
            }
        }}

        animate={{ 
            x: x, 
            y: y,
            // USE REAL VOLUME HERE
            scale: isDragging ? 1.1 : (1 + displayVolume * 0.5), // Scale up to 1.5x
            zIndex: isDragging ? 50 : 20,
            filter: isMuted ? "grayscale(100%) opacity(0.6)" : "grayscale(0%) opacity(1)"
        }} 
        
        transition={{ 
            x: { type: "tween", duration: 0 }, 
            y: { type: "tween", duration: 0 },
            scale: { type: "spring", stiffness: 300, damping: 20 }
        }}
      >
        <div className="w-full h-full rounded-full relative"
             style={{
                background: "radial-gradient(120% 120% at 50% 50%, rgba(255, 255, 255, 0.02) 0%, rgba(255, 255, 255, 0.01) 80%, rgba(255, 255, 255, 0.05) 100%)",
                backdropFilter: "blur(4px)",
                border: isMe ? "1.5px solid rgba(255,255,255,0.3)" : "1px solid rgba(255,255,255,0.15)",
                boxShadow: `
                    inset -10px -10px 20px rgba(0, 255, 255, 0.15), 
                    inset 10px 10px 20px rgba(255, 0, 255, 0.15), 
                    inset 0px 0px 10px rgba(255, 255, 255, 0.3), 
                    0px 10px 30px rgba(0,0,0,0.2)
                `
             }}
        >
            <div className="absolute top-4 left-6 w-10 h-6 bg-white opacity-40 rounded-[50%] rotate-[-45deg] blur-[3px]" />
            <div className="absolute bottom-4 right-6 w-8 h-4 bg-cyan-200 opacity-20 rounded-[50%] rotate-[-45deg] blur-[4px]" />
            
            <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-white font-medium text-lg tracking-wide drop-shadow-md select-none">
                    {label}
                </span>
            </div>
        </div>
      </motion.div>

      {isMe && (
          <motion.button
            onClick={onMuteToggle}
            className="absolute z-30 w-12 h-12 rounded-full flex items-center justify-center cursor-pointer active:scale-90 transition-transform"
            animate={{ 
                x: x + 85, 
                y: y + 85,
                opacity: isDragging ? 0 : 1 
            }}
            transition={{ duration: 0.2 }}
          >
             <div className={`w-full h-full rounded-full border border-white/20 backdrop-blur-md flex items-center justify-center shadow-lg transition-colors duration-300
                ${isMuted ? "bg-red-500/80" : "bg-white/10"}`}
             >
                {isMuted ? (
                    <div className="w-3 h-3 bg-white rounded-[2px]" /> 
                ) : (
                    <div className="w-2 h-4 bg-green-400 rounded-full animate-pulse" /> 
                )}
             </div>
          </motion.button>
      )}
    </>
  );
};