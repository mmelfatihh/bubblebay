import { motion } from "framer-motion";

interface RoomBubbleProps {
  id: string; label: string; x: number; y: number; volume: number; 
  isMuted: boolean; isMe: boolean; onMuteToggle?: () => void;
  onDragStart?: () => void; onDragEnd?: (x: number, y: number, vx: number, vy: number) => void;
  onDrag?: (x: number, y: number) => void;
}

export const RoomBubble = ({ label, x, y, volume, isMuted, isMe, onMuteToggle, onDragStart, onDragEnd, onDrag }: RoomBubbleProps) => {
  return (
    <motion.div
      className="absolute z-20 touch-none"
      style={{ x, y, width: 130, height: 130 }}
      drag
      dragMomentum={false}
      onDragStart={onDragStart}
      onDrag={(_, info) => onDrag?.(info.point.x, info.point.y)}
      onDragEnd={() => onDragEnd?.(x, y, 0, 0)}
      animate={{ scale: 1 + Math.min(volume, 0.2) }}
    >
      {/* THE BUBBLE BODY */}
      <div className={`w-full h-full rounded-full relative flex items-center justify-center border transition-opacity duration-500 ${isMuted ? 'opacity-40 grayscale' : 'opacity-100'}`}
           style={{
              background: "radial-gradient(circle at 30% 30%, rgba(255,255,255,0.1), transparent)",
              backdropFilter: "blur(8px)",
              borderColor: isMe ? "rgba(6, 182, 212, 0.5)" : "rgba(255,255,255,0.1)",
              boxShadow: isMe ? "0 0 20px rgba(6, 182, 212, 0.2)" : "none"
           }}>
        <span className="text-white text-sm font-medium tracking-tight">{label}</span>
        
        {/* THE MUTE BUTTON: Now locked relative to the bubble! */}
        {isMe && (
          <button 
            onClick={(e) => { e.stopPropagation(); onMuteToggle?.(); }}
            className={`absolute -bottom-2 -right-2 w-10 h-10 rounded-full flex items-center justify-center border border-white/20 shadow-lg ${isMuted ? 'bg-red-500' : 'bg-cyan-500'}`}
          >
            <span className="text-[10px]">{isMuted ? "OFF" : "ON"}</span>
          </button>
        )}
      </div>
    </motion.div>
  );
};