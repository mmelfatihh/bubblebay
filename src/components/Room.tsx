import { useEffect, useRef, useState } from "react";
import { RoomBubble } from "./RoomBubble";
import { DropletAssembly } from "./DropletAssembly";
import { useMicVolume } from "../hooks/useMicVolume";

interface RoomProps {
    users: any[];
    onHangUp: () => void;
}

export const Room = ({ users, onHangUp }: RoomProps) => {
  const physicsState = useRef<{ [key: string]: { x: number, y: number, vx: number, vy: number } }>({});
  const draggingId = useRef<string | null>(null);
  const [ setRenderTrigger] = useState(0);
  const [muted, setMuted] = useState(false);

  const micVolume = useMicVolume(!muted);

  // 1. INITIALIZE PHYSICS
  useEffect(() => {
    const w = window.innerWidth;
    const h = window.innerHeight;
    const PADDING = 100;
    
    users.forEach(u => {
        if (!physicsState.current[u.id]) {
            physicsState.current[u.id] = { 
                x: PADDING + Math.random() * (w - PADDING * 2), 
                y: PADDING + Math.random() * (h - PADDING * 2),
                vx: (Math.random() - 0.5) * 0.2, 
                vy: (Math.random() - 0.5) * 0.2
            };
        }
    });
  }, [users]);

  // 2. PHYSICS ENGINE LOOP
  useEffect(() => {
    let animationFrameId: number;
    const runPhysics = () => {
      const state = physicsState.current;
      const ids = Object.keys(state);
      const w = window.innerWidth;
      const h = window.innerHeight;
      const MAX_SPEED = 0.2; 
      const BUBBLE_SIZE = 130;
      
      // Button Repulsion Zone (Updated position logic)
      const BUTTON_RADIUS = 120; 
      const BUTTON_X = w / 2;
      // We estimate button Y based on window height minus safe area padding
      const BUTTON_Y = h - 100; 

      ids.forEach(idA => {
          const body = state[idA];
          if (!body || draggingId.current === idA) return;

          // Separation
          ids.forEach(idB => {
              if (idA === idB) return;
              const other = state[idB];
              if (!other) return;
              const dx = body.x - other.x;
              const dy = body.y - other.y;
              const dist = Math.sqrt(dx*dx + dy*dy);
              if (dist < 300 && dist > 0) {
                  const force = (1 - dist / 300) * 0.005; 
                  body.vx += (dx / dist) * force;
                  body.vy += (dy / dist) * force;
              }
          });

          // Button Avoidance
          const btnDx = body.x - BUTTON_X;
          const btnDy = body.y - BUTTON_Y;
          const btnDist = Math.sqrt(btnDx*btnDx + btnDy*btnDy);
          if (btnDist < BUTTON_RADIUS) {
              const pushFactor = 0.02;
              body.vx += (btnDx / btnDist) * pushFactor;
              body.vy += (btnDy / btnDist) * pushFactor;
          }

          // Wall Bounce
          if (body.x < 0) { body.x = 0; body.vx = Math.abs(body.vx) * 0.8; }
          else if (body.x > w - BUBBLE_SIZE) { body.x = w - BUBBLE_SIZE; body.vx = -Math.abs(body.vx) * 0.8; }
          if (body.y < 0) { body.y = 0; body.vy = Math.abs(body.vy) * 0.8; }
          else if (body.y > h - BUBBLE_SIZE) { body.y = h - BUBBLE_SIZE; body.vy = -Math.abs(body.vy) * 0.8; }

          // Damping & Speed Limit
          body.vx *= 0.99; body.vy *= 0.99;
          body.vx += (Math.random() - 0.5) * 0.01; body.vy += (Math.random() - 0.5) * 0.01;

          const speed = Math.sqrt(body.vx*body.vx + body.vy*body.vy);
          if (speed > MAX_SPEED) {
              body.vx = (body.vx / speed) * MAX_SPEED;
              body.vy = (body.vy / speed) * MAX_SPEED;
          }

          body.x += body.vx; body.y += body.vy;
      });
      setRenderTrigger(prev => prev + 1);
      animationFrameId = requestAnimationFrame(runPhysics);
    };
    runPhysics();
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  const [visibleBubbles, setVisibleBubbles] = useState<string[]>([]);

  return (
    <div className="absolute inset-0 z-40 pointer-events-none overflow-hidden"> 
      
      {/* --- DEBUG OVERLAY: Optional --- */}
      {/* <div className="absolute top-4 left-4 text-xs text-white/50 z-50 pointer-events-none">
          Users: {users.length}
      </div> */}

      <div className="absolute inset-0 pointer-events-auto touch-none"> 
        {users.map(user => {
            const state = physicsState.current[user.id];
            
            // If physics hasn't initialized for this user yet, skip render
            if (!state) return null;
            
            const isVisible = visibleBubbles.includes(user.id);
            const volume = user.isMe ? micVolume : 0; 

            return (
                <div key={user.id}>
                    {!isVisible && (
                        <DropletAssembly 
                            x={state.x + 65} y={state.y + 65} 
                            onAssemblyComplete={() => setVisibleBubbles(prev => [...prev, user.id])} 
                        />
                    )}
                    {isVisible && (
                        <RoomBubble
                            id={user.id} 
                            label={user.label} 
                            x={state.x} 
                            y={state.y}
                            isMe={user.isMe} 
                            participant={user.participant}
                            volume={volume} 
                            isMuted={user.isMe ? muted : user.isMuted}
                            onMuteToggle={user.isMe ? () => setMuted(!muted) : undefined}
                            onDragStart={() => draggingId.current = user.id}
                            onDragEnd={(dx, dy, vx, vy) => {
                                draggingId.current = null;
                                if (physicsState.current[user.id]) {
                                    const b = physicsState.current[user.id];
                                    b.x = dx; b.y = dy; b.vx = vx; b.vy = vy;
                                }
                            }}
                        />
                    )}
                </div>
            );
        })}

        {/* --- HANG UP BUTTON (MOBILE OPTIMIZED) --- */}
        <div className="absolute bottom-8 left-0 right-0 flex justify-center z-50 pb-[env(safe-area-inset-bottom)] pointer-events-none">
            {/* Pointer events auto so we can click the button, but not block drags around it */}
            <div className="pointer-events-auto">
                <button onClick={onHangUp} className="group relative w-[80px] h-[80px] rounded-full flex items-center justify-center cursor-pointer active:scale-90 transition-transform duration-200" style={{ background: "radial-gradient(120% 120% at 50% 50%, rgba(220, 38, 38, 0.2) 0%, rgba(220, 38, 38, 0.05) 80%, rgba(220, 38, 38, 0.1) 100%)", backdropFilter: "blur(6px)", border: "1px solid rgba(254, 202, 202, 0.3)", boxShadow: "inset -5px -5px 15px rgba(153, 27, 27, 0.3), inset 5px 5px 15px rgba(254, 202, 202, 0.2), inset 0px 0px 10px rgba(255, 255, 255, 0.3), 0 10px 30px rgba(0,0,0,0.3)" }}>
                    <div className="absolute top-3 left-4 w-6 h-3 bg-white opacity-40 rounded-[50%] rotate-[-45deg] blur-[2px]" />
                    <div className="absolute bottom-3 right-4 w-5 h-2 bg-red-200 opacity-20 rounded-[50%] rotate-[-45deg] blur-[3px]" />
                    <div className="text-white/90 drop-shadow-md">
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor"><path d="M12 9c-1.6 0-3.15.25-4.6.72v3.1c0 .39-.23.74-.56.9-.98.49-1.87 1.12-2.66 1.85-.18.18-.43.28-.7.28-.28 0-.53-.11-.71-.29L.29 13.08c-.18-.17-.29-.42-.29-.7 0-.28.11-.53.29-.71C3.34 8.36 7.46 6 12 6s8.66 2.36 11.71 5.67c.18.18.29.43.29.71 0 .28-.11.53-.29.71l-2.48 2.48c-.18.18-.43.29-.71.29-.27 0-.52-.11-.7-.28-.79-.74-1.69-1.36-2.67-1.85-.33-.16-.56-.5-.56-.9v-3.1C15.15 9.25 13.6 9 12 9z"/></svg>
                    </div>
                </button>
            </div>
        </div>

      </div>
    </div>
  );
};