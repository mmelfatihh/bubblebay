import { motion } from "framer-motion";

export const Background = () => {
  return (
    <div className="fixed inset-0 z-0 overflow-hidden bg-black pointer-events-none">
      {/* 1. Deep Base */}
      <div className="absolute inset-0 bg-[#050505]" />

      {/* 2. Moving Auroras */}
      <motion.div 
        animate={{ rotate: 360 }}
        transition={{ duration: 100, repeat: Infinity, ease: "linear" }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] opacity-30"
      >
        {/* Deep Purple Blob */}
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-purple-900 rounded-full blur-[120px] mix-blend-screen opacity-50" />
        
        {/* Cyan Blob */}
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-cyan-900 rounded-full blur-[120px] mix-blend-screen opacity-50" />
        
        {/* Blue Center */}
        <div className="absolute top-[20%] right-[20%] w-[400px] h-[400px] bg-blue-900 rounded-full blur-[100px] mix-blend-screen opacity-40" />
      </motion.div>

      {/* 3. The "Noise" Overlay (Adds texture to the glass) */}
      <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'url("https://grainy-gradients.vercel.app/noise.svg")' }} />

      {/* 4. Subtle Dust Particles */}
      <div className="absolute inset-0">
         {[...Array(20)].map((_, i) => (
            <motion.div
               key={i}
               className="absolute bg-white rounded-full opacity-20"
               initial={{ 
                   x: Math.random() * window.innerWidth, 
                   y: Math.random() * window.innerHeight, 
                   scale: Math.random() * 0.5 + 0.5 
               }}
               animate={{ 
                   y: [null, Math.random() * -100], 
                   opacity: [0.2, 0.5, 0.2] 
               }}
               transition={{ 
                   duration: Math.random() * 10 + 10, 
                   repeat: Infinity, 
                   ease: "linear" 
               }}
               style={{ width: '2px', height: '2px' }}
            />
         ))}
      </div>
    </div>
  );
};