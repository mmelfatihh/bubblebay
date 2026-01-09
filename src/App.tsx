import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Background } from "./components/Background";
import { LoginPage } from "./pages/LoginPage";
import { LobbyPage } from "./pages/LobbyPage";
import { RoomPage } from "./pages/RoomPage";
import { AnimatePresence } from "framer-motion";

function App() {
  return (
    <BrowserRouter>
      <div className="relative w-full h-screen bg-black overflow-hidden font-sans text-white">
        <Background />
        
        <AnimatePresence mode="wait">
            <Routes>
              <Route path="/" element={<LoginPage />} />
              <Route path="/lobby" element={<LobbyPage />} />
              <Route path="/room/:roomId" element={<RoomPage />} />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        </AnimatePresence>
      </div>
    </BrowserRouter>
  );
}

export default App;