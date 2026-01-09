import { motion, useMotionValue } from "framer-motion";

interface RoomBubbleProps {
  id: string;
  label: string;
  x: number;
  y: number;
  volume: number; 
  isMuted: boolean;
  isMe: boolean;
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
    // This wrapper now contains BOTH the bubble and the mute button
    <motion.div
      className="absolute z-20 touch-none select-none"
      style={{ x, y, width: 130, height: 130 }}
      drag
      dragMomentum={false}
      onDragStart={onDragStart}
      onDrag={(_, info) => {
        // This tells the physics engine exactly where your finger is
        if (onDrag) onDrag(info.point.x, info.point.y);
      }}
      onDragEnd={() => {
        if (onDragEnd) onDragEnd(x, y, 0, 0);
      }}
      animate={{ 
        scale: 1 + Math.min(volume, 0.2), 
        filter: isMuted ? "grayscale(100%) opacity(0.6)" : "grayscale(0%) opacity(1)"
      }}
      transition={{ 
        scale: { type: "spring", stiffness: 200, damping: 25 } 
      }}
    >
      {/* THE VISUAL BUBBLE */}
      <div className="w-full h-full rounded-full relative cursor-grab active:cursor-grabbing"
           style={{
              background: "radial-gradient(120% 120% at 50% 50%, rgba(255, 255, 255, 0.02) 0%, rgba(255, 255, 255, 0.01) 80%, rgba(255, 255, 255, 0.05) 100%)",
              backdropFilter: "blur(4px)",
              border: isMe ? "1.5px solid rgba(255,255,255,0.3)" : "1px solid rgba(255,255,255,0.15)",
              boxShadow: `inset -10px -10px 20px rgba(0, 255, 255, 0.15), inset 10px 10px 20px rgba(255, 0, 255, 0.15), 0px 10px 30px rgba(0,0,0,0.2)`
           }}
      >
          <div className="absolute top-4 left-6 w-10 h-6 bg-white opacity-40 rounded-[50%] rotate-[-45deg] blur-[3px]" />
          <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-white font-medium text-lg tracking-wide select-none">{label}</span>
          </div>
      </div>

      {/* THE MUTE BUTTON (Now relative to the bubble!) */}
      {isMe && (
        <button
          onClick={(e) => {
            e.stopPropagation(); // Prevents dragging when you just want to mute
            onMuteToggle?.();
          }}
          className={`absolute -right-2 -bottom-2 w-12 h-12 rounded-full border border-white/20 backdrop-blur-md flex items-center justify-center shadow-lg transition-colors z-30
            ${isMuted ? "bg-red-500/80" : "bg-white/10"}`}
        >
          {isMuted ? (
              <div className="w-3 h-3 bg-white rounded-[2px]" /> 
          ) : (
              <div className="w-2 h-4 bg-green-400 rounded-full animate-pulse" /> 
          )}
        </button>
      )}
    </motion.div>
  );
};