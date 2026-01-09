import { motion } from "framer-motion";

interface RoomBubbleProps {
  id: string;
  label: string;
  x: number;
  y: number;
  volume: number; 
  isMuted: boolean;
  isMe: boolean;
  participant?: any; // Added to match Room.tsx
  onMuteToggle?: () => void;
  onDragStart?: () => void;
  onDragEnd?: (x: number, y: number, vx: number, vy: number) => void;
  onDrag?: (x: number, y: number) => void;
}

export const RoomBubble = ({ 
  label, x, y, volume, isMuted, isMe, 
  onMuteToggle, onDragStart, onDragEnd, onDrag 
}: RoomBubbleProps) => {

  return (
    <>
      <motion.div
        className="absolute flex items-center justify-center rounded-full z-20 cursor-grab active:cursor-grabbing touch-none"
        style={{ width: 130, height: 130 }}
        drag
        dragMomentum={false}
        dragElastic={0.1}
        onDragStart={onDragStart}
        onDragEnd={() => onDragEnd?.(x, y, 0, 0)}
        onDrag={(_, info) => {
            if (onDrag) onDrag(info.point.x, info.point.y);
        }}
        animate={{ 
            x: x, 
            y: y,
            scale: 1 + Math.min(volume, 0.2), 
            filter: isMuted ? "grayscale(100%) opacity(0.6)" : "grayscale(0%) opacity(1)"
        }} 
        transition={{ 
            x: { type: "tween", duration: 0 }, 
            y: { type: "tween", duration: 0 },
            scale: { type: "spring", stiffness: 200, damping: 25 }
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
            animate={{ x: x + 85, y: y + 85 }}
            transition={{ type: "tween", duration: 0 }}
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