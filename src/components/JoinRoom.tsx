import { useState } from "react";

interface JoinRoomProps {
  onJoin: (roomId: string) => void;
  onBack: () => void;
}

export const JoinRoom = ({ onJoin, onBack }: JoinRoomProps) => {
  const [code, setCode] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // Stop page refresh
    if (code.length > 0) {
        onJoin(code); // Send the code ONLY when button is clicked
    }
  };

  return (
    <div className="absolute inset-0 flex items-center justify-center z-50">
      <div className="flex flex-col items-center gap-8 w-full max-w-md px-6">
        
        {/* HEADER */}
        <div className="text-center space-y-2">
            <h2 className="text-2xl font-light tracking-[0.2em] text-white">
                JOIN FREQUENCY
            </h2>
            <p className="text-xs text-white/40 tracking-widest uppercase">
                Enter Room Code
            </p>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="w-full flex flex-col items-center gap-6">
            
            {/* INPUT BOX */}
            <div className="relative group w-full max-w-[200px]">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-lg blur opacity-30 group-focus-within:opacity-100 transition duration-500"></div>
                <input 
                    type="text" 
                    value={code}
                    onChange={(e) => setCode(e.target.value.toUpperCase())} // Force Uppercase
                    placeholder="CODE"
                    className="relative w-full bg-black/90 text-white placeholder-white/20 text-3xl font-mono text-center py-4 rounded-lg border border-white/10 focus:outline-none focus:border-cyan-500/50 tracking-[0.2em] uppercase"
                    autoFocus
                />
            </div>

            {/* BUTTONS */}
            <div className="flex gap-4">
                <button 
                    type="button"
                    onClick={onBack}
                    className="px-6 py-3 rounded-full border border-white/10 text-xs tracking-widest text-white/50 hover:bg-white/5 hover:text-white transition-colors"
                >
                    BACK
                </button>

                <button 
                    type="submit"
                    disabled={code.length === 0} // Disable if empty
                    className="px-8 py-3 bg-white/10 hover:bg-white/20 border border-white/10 rounded-full text-xs tracking-widest text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    CONNECT
                </button>
            </div>
        </form>

      </div>
    </div>
  );
};