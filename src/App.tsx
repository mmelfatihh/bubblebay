import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Background } from './components/Background';
import { LoginPage } from './pages/LoginPage';
import { LobbyPage } from './pages/LobbyPage';
import { RoomPage } from './pages/RoomPage';

function App() {
  return (
    <Router>
      {/* FIX: h-[100dvh] ensures it fits the mobile screen perfectly 
          overflow-hidden prevents the browser from trying to scroll 
      */}
      <div className="relative w-full h-[100dvh] overflow-hidden bg-black">
        <Background />
        
        <div className="relative z-10 w-full h-full">
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/lobby" element={<LobbyPage />} />
            <Route path="/room/:roomId" element={<RoomPage />} />
            <Route path="/" element={<Navigate to="/login" replace />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;