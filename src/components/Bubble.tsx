import { motion, useMotionValue, useSpring } from "framer-motion";
import { useEffect, useRef, useState } from "react";

interface PortalTarget {
    x: number;
    y: number;
    action: () => void;
}

interface BubbleProps {
  label?: string;
  startPos: { x: number; y: number };
  portalTargets?: PortalTarget[]; 
}

export const Bubble = ({ label, startPos, portalTargets }: BubbleProps) => {
  const [isSucked, setIsSucked] = useState(false);
  const [targetPortal, setTargetPortal] = useState<{x: number, y: number} | null>(null);

  const position = useRef({ x: startPos.x, y: startPos.y });
  const velocity = useRef({ x: 0, y: 0 }); 
  const isDragging = useRef(false);
  const bounds = useRef({ w: window.innerWidth, h: window.innerHeight });
  const x = useMotionValue(startPos.x);
  const y = useMotionValue(startPos.y);
  
  // --- PHYSICS TUNING ---
  // stiffness: 400 (High) = Feels firm/tight
  // damping: 30 (High) = Stops wobbling quickly (No gelatin feel)
  const springConfig = { stiffness: 400, damping: 30 };
  
  const scaleX = useSpring(1, springConfig);
  const scaleY = useSpring(1, springConfig);
  const rotate = useSpring(0, { stiffness: 200, damping: 20 });
  const opacity = useSpring(1);

  useEffect(() => {
    const handleResize = () => { bounds.current = { w: window.innerWidth, h: window.innerHeight }; };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    let animationFrameId: number;

    const updatePhysics = () => {
      const BUBBLE_SIZE = 140; 
      const RADIUS = BUBBLE_SIZE / 2;
      const BOUNCE_DAMPING = 0.8; // Lower bounciness on walls
      const FRICTION = 0.99; // Higher friction so it stops drifting faster

      if (isSucked && targetPortal) {
        // Portal Suction Logic
        position.current.x += (targetPortal.x - position.current.x) * 0.1;
        position.current.y += (targetPortal.y - position.current.y) * 0.1;
        
        scaleX.set(0); scaleY.set(0); opacity.set(0); rotate.set(rotate.get() + 15);
        x.set(position.current.x - RADIUS);
        y.set(position.current.y - RADIUS);
        
        animationFrameId = requestAnimationFrame(updatePhysics);
        return;
      }

      if (!isDragging.current) {
        position.current.x += velocity.current.x;
        position.current.y += velocity.current.y;
        velocity.current.x *= FRICTION;
        velocity.current.y *= FRICTION;

        // Wall Collisions
        if (position.current.x > bounds.current.w - RADIUS) { 
            position.current.x = bounds.current.w - RADIUS; 
            velocity.current.x *= -BOUNCE_DAMPING; 
        }
        if (position.current.x < RADIUS) { 
            position.current.x = RADIUS; 
            velocity.current.x *= -BOUNCE_DAMPING; 
        }
        if (position.current.y > bounds.current.h - RADIUS) { 
            position.current.y = bounds.current.h - RADIUS; 
            velocity.current.y *= -BOUNCE_DAMPING; 
        }
        if (position.current.y < RADIUS) { 
            position.current.y = RADIUS; 
            velocity.current.y *= -BOUNCE_DAMPING; 
        }

        // Always return to scale 1 cleanly
        if (scaleX.get() !== 1) scaleX.set(1);
        if (scaleY.get() !== 1) scaleY.set(1);

        x.set(position.current.x - RADIUS);
        y.set(position.current.y - RADIUS);
      }

      animationFrameId = requestAnimationFrame(updatePhysics);
    };
    updatePhysics();
    return () => cancelAnimationFrame(animationFrameId);
  }, [isSucked, targetPortal, x, y, scaleX, scaleY]);

  return (
    <motion.div
      style={{ x, y, scaleX, scaleY, rotate, opacity }}
      className="absolute flex items-center justify-center rounded-full cursor-grab active:cursor-grabbing z-20"
      onPointerDown={() => { 
          isDragging.current = true; 
          // Subtle squish on grab (0.95 instead of 0.9)
          scaleX.set(1.05); 
          scaleY.set(0.95); 
      }}
      onPointerUp={(e) => {
        isDragging.current = false;
        
        if (portalTargets) {
            let hit = false;
            portalTargets.forEach(target => {
                const distance = Math.sqrt(Math.pow(position.current.x - target.x, 2) + Math.pow(position.current.y - target.y, 2));
                if (distance < 100) {
                    hit = true;
                    setTargetPortal({ x: target.x, y: target.y });
                    setIsSucked(true);
                    setTimeout(() => target.action(), 1000); 
                }
            });

            if (!hit) {
                 velocity.current = { x: (Math.random() - 0.5) * 5, y: (Math.random() - 0.5) * 5 };
                 scaleX.set(1); scaleY.set(1); // Snap back immediately, no wobble
            }
        } else {
             velocity.current = { x: (Math.random() - 0.5) * 5, y: (Math.random() - 0.5) * 5 };
             scaleX.set(1); scaleY.set(1);
        }
      }}
      drag 
      dragMomentum={false} 
      onDrag={(event, info) => {
        position.current = { x: x.get() + 70, y: y.get() + 70 };
        velocity.current = { x: info.velocity.x / 60, y: info.velocity.y / 60 };
        
        const dx = info.delta.x; 
        const dy = info.delta.y;
        
        // --- REDUCED STRETCH SENSITIVITY ---
        // Was 0.02, now 0.005 (4x less stretch)
        // Max stretch capped at 0.1 (10%) instead of 0.3 (30%)
        const sensitivity = 0.005;
        const maxStretch = 0.1;
        
        const stretchAmount = Math.min(Math.abs(dx) * sensitivity, maxStretch); 
        
        if (Math.abs(dx) > Math.abs(dy)) { 
            scaleX.set(1 + stretchAmount); 
            scaleY.set(1 - stretchAmount); 
        } else { 
            scaleY.set(1 + Math.min(Math.abs(dy) * sensitivity, maxStretch)); 
            scaleX.set(1 - Math.min(Math.abs(dy) * sensitivity, maxStretch)); 
        }
      }}
    >
      <div 
        className="w-[140px] h-[140px] rounded-full relative"
        style={{
          background: "radial-gradient(120% 120% at 50% 50%, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.01) 80%, rgba(255, 255, 255, 0.05) 100%)",
          backdropFilter: "blur(2px)",
          boxShadow: `inset -10px -10px 20px rgba(0, 255, 255, 0.2), inset 10px 10px 20px rgba(255, 0, 255, 0.2), inset 0px 0px 10px rgba(255, 255, 255, 0.4), 0px 10px 20px rgba(0,0,0,0.1)`,
          border: "1px solid rgba(255,255,255,0.15)"
        }}
      >
        <div className="absolute top-3 left-6 w-12 h-8 bg-gradient-to-b from-white to-transparent opacity-60 rounded-[50%] rotate-[-45deg] blur-[1px]" />
        <div className="absolute bottom-3 right-5 w-8 h-4 bg-cyan-200 opacity-20 rounded-[50%] rotate-[-45deg] blur-[3px]" />
        <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-white font-light text-xl tracking-widest font-sans opacity-90 select-none drop-shadow-md">{label}</span>
        </div>
      </div>
    </motion.div>
  );
};