import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { LiveAudioRoom } from "../components/LiveAudioRoom";

const SERVER_URL = "wss://bubblebay-349kj4iq.livekit.cloud";

export const RoomPage = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [token] = useState(location.state?.token || "");

  useEffect(() => {
    if (!token) { navigate('/lobby'); }
  }, [token, navigate]);

  if (!token) return null;

  return (
    <div className="relative w-full h-screen overflow-hidden">
        <LiveAudioRoom 
            token={token} 
            serverUrl={SERVER_URL} 
            onHangUp={() => navigate('/lobby')} // Removed the reload here!
        />
        
        {/* ROOM ID: Added mt-safe to prevent notch cut-off */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 z-50 pointer-events-none mt-[env(safe-area-inset-top)]">
            <div className="bg-black/40 backdrop-blur-md border border-white/10 px-4 py-2 rounded-full text-white/70 text-[10px] tracking-widest flex gap-2 shadow-2xl">
                <span>ROOM:</span>
                <span className="text-cyan-400 select-all pointer-events-auto cursor-pointer font-bold">{roomId}</span>
            </div>
        </div>
    </div>
  );
};