import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { LiveAudioRoom } from "../components/LiveAudioRoom";

const SERVER_URL = "wss://bubblebay-349kj4iq.livekit.cloud";

export const RoomPage = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Grab token passed from Lobby
  const [token, setToken] = useState(location.state?.token || "");

  useEffect(() => {
    // If someone copy-pasted the URL directly (no token in state), 
    // we should technically redirect them to a "Join" page to generate one.
    // For now, let's just bounce them to Lobby.
    if (!token) {
        console.log("No token found, redirecting to lobby...");
        navigate('/lobby');
    }
  }, [token, navigate]);

  if (!token) return null;

  return (
    <div className="relative w-full h-[100dvh]">
        <LiveAudioRoom 
            token={token} 
            serverUrl={SERVER_URL} 
            onHangUp={() => {
                navigate('/lobby');
                window.location.reload(); 
            }} 
        />
        
        {/* ROOM ID DISPLAY (So they can share it!) */}
        <div className="absolute top-6 left-1/2 -translate-x-1/2 z-50 pointer-events-none">
            <div className="bg-white/5 backdrop-blur-md border border-white/10 px-4 py-2 rounded-full text-white/50 text-xs tracking-widest flex gap-2">
                <span>ROOM CODE:</span>
                <span className="text-cyan-400 select-all pointer-events-auto cursor-pointer">{roomId}</span>
            </div>
        </div>
    </div>
  );
};