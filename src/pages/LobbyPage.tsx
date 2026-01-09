import { Lobby } from "../components/Lobby";
import { JoinRoom } from "../components/JoinRoom";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../lib/firebase"; 
import { getToken } from "../lib/api";

export const LobbyPage = () => {
  const navigate = useNavigate();
  const [mode, setMode] = useState<'menu' | 'join'>('menu');
  const [loading, setLoading] = useState(false);

  // Generate 4-character ID (A1B2)
  const generateRoomId = () => Math.random().toString(36).substring(2, 6).toUpperCase();

  const handleCreateRoom = async () => {
    // FALLBACK NAME: Use "Guest" if auth isn't ready
    const userName = auth.currentUser?.displayName || "Guest";
    
    setLoading(true);

    try {
        const roomId = generateRoomId();
        const token = await getToken(roomId, userName);
        navigate(`/room/${roomId}`, { state: { token } });
    } catch (e) {
        console.error(e);
        alert("Server offline! Did you run 'node server.js'?");
    } finally {
        setLoading(false);
    }
  };

  const handleJoinRoom = async (roomId: string) => {
    // FALLBACK NAME: Use "Guest" if auth isn't ready
    const userName = auth.currentUser?.displayName || "Guest";

    if (!roomId) return alert("Please enter a room ID");
    
    setLoading(true);

    try {
        const token = await getToken(roomId, userName);
        navigate(`/room/${roomId}`, { state: { token } });
    } catch (e) {
        console.error(e);
        alert("Could not join room. Check console for details.");
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="relative w-full h-[100dvh]">
      {/* Loading Overlay */}
      {loading && (
          <div className="absolute inset-0 z-50 bg-black/80 flex items-center justify-center text-cyan-400 animate-pulse tracking-widest">
              GENERATING KEY...
          </div>
      )}

      {mode === 'menu' && (
        <Lobby 
            onPortalChoose={(type) => {
                if (type === 'create') handleCreateRoom();
                if (type === 'join') setMode('join');
            }} 
        />
      )}

      {mode === 'join' && (
        <JoinRoom 
            onJoin={handleJoinRoom}
            onBack={() => setMode('menu')} 
        />
      )}
    </div>
  );
};