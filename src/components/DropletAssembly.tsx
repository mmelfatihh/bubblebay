import { motion } from "framer-motion";

interface DropletAssemblyProps {
  onAssemblyComplete: () => void;
  x: number;
  y: number;
}

export const DropletAssembly = ({ onAssemblyComplete, x, y }: DropletAssemblyProps) => {
  // Create 12 random droplets
  const droplets = [...Array(12)].map((_, i) => ({
    id: i,
    startX: (Math.random() - 0.5) * 150, // Scatter range
    startY: (Math.random() - 0.5) * 150,
    size: Math.random() * 6 + 4, 
    delay: Math.random() * 0.1 
  }));

  return (
    <div 
      className="absolute pointer-events-none z-30"
      style={{ left: x, top: y }} 
    >
      {droplets.map((d, i) => (
        <motion.div
          key={d.id}
          className="absolute rounded-full bg-white/40 shadow-[0_0_10px_rgba(255,255,255,0.4)] backdrop-blur-sm"
          style={{ width: d.size, height: d.size }}
          initial={{ x: d.startX, y: d.startY, opacity: 0, scale: 0 }}
          animate={{ x: 0, y: 0, opacity: 1, scale: 0 }} // Move to center and vanish
          transition={{ 
            duration: 0.6, 
            delay: d.delay, 
            ease: "backIn" 
          }}
          onAnimationComplete={() => {
            // Trigger completion only on the last droplet
            if (i === droplets.length - 1) onAssemblyComplete();
          }}
        />
      ))}
    </div>
  );
};