import { useState } from "react";

interface AuthFormProps {
  onLogin: (name: string) => void;
}

export const AuthForm = ({ onLogin }: AuthFormProps) => {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    
    setLoading(true);
    // Simulate a small network delay for effect
    setTimeout(() => {
        onLogin(name);
        setLoading(false);
    }, 500);
  };

  return (
    <div className="absolute inset-0 flex items-center justify-center z-50">
      <form onSubmit={handleSubmit} className="flex flex-col items-center gap-6 w-full max-w-xs">
        
        {/* LOGO */}
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-600 shadow-[0_0_40px_rgba(6,182,212,0.5)] mb-4 animate-pulse" />

        <div className="text-center space-y-2">
            <h1 className="text-3xl font-light tracking-[0.2em] text-white">
                BUBBLEBAY
            </h1>
            <p className="text-xs text-white/40 tracking-widest uppercase">
                Spatial Audio Workspace
            </p>
        </div>

        {/* NAME INPUT */}
        <div className="relative group w-full">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg blur opacity-30 group-focus-within:opacity-100 transition duration-500"></div>
            <input 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="ENTER YOUR NAME"
                className="relative w-full bg-black/90 text-white placeholder-white/30 px-6 py-4 rounded-lg border border-white/10 focus:outline-none focus:border-cyan-500/50 text-center tracking-widest uppercase text-sm"
                autoFocus
            />
        </div>

        {/* BUTTON */}
        <button 
            disabled={!name.trim() || loading}
            className="group relative px-8 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full transition-all disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden"
        >
          <span className="relative z-10 text-xs tracking-[0.3em] text-white/80 group-hover:text-white transition-colors">
            {loading ? "CONNECTING..." : "ENTER"}
          </span>
        </button>

      </form>
    </div>
  );
};