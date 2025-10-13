import { useState, useEffect } from 'react';
import './App.css';
import Header from './Components/Header/Header';
import Home from './Home';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Upload from './Components/Upload/Upload';
import SignIn from './Components/SignIn/SignIn';
import NamePage from './Components/NamePage/NamePage';
import About from './Components/About/About';
import Chat from './Components/Chat/Chat';
import VideoCall from "./Components/VideoCall/VideoCall";
import KnowMore from './Components/KnowMore/KnowMore';

function AppContent() {
  const [activeModal, setActiveModal] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const location = useLocation();

  // ✅ Hide header on these routes
  const hideHeaderRoutes = ['/upload', '/chat'];
  const shouldHideHeader = hideHeaderRoutes.includes(location.pathname);

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("token");
      const isValidToken = token && token !== "dummyToken" && token.length > 10;
      setIsAuthenticated(isValidToken);
    };
    checkAuth();
  }, []);

  const handleAuthSuccess = (realToken) => {
    if (realToken && realToken !== "dummyToken") {
      localStorage.setItem("token", realToken);
      setIsAuthenticated(true);
      setActiveModal(null);
    } else {
      console.error("Invalid token provided");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    window.location.href = "/";
  };

  return (
    <>
      {/* ✅ Conditionally render Header */}
      {!shouldHideHeader && (
        <Header
          onLoginClick={() => setActiveModal("login")}
          onSignUpClick={() => setActiveModal("signin")}
          isAuthenticated={isAuthenticated}
          onLogout={handleLogout}
        />
      )}

      <Routes>
          <Route
            path="/"
            element={
              <Home
                setActiveModal={setActiveModal}
                isAuthenticated={isAuthenticated}
                onAuthSuccess={handleAuthSuccess}
              />
            }
          />
          <Route path="/upload" element={<Upload />} />
          <Route
            path="/namepage"
            element={
              isAuthenticated ? <NamePage /> : <Home setActiveModal={setActiveModal} />
            }
          />

          {/* 🔄 Swapped routes */}
          <Route path="/know-more" element={<KnowMore />} />
          <Route path="/about" element={<About />} />

          <Route
            path="/chat"
            element={
              isAuthenticated ? <Chat /> : <Home setActiveModal={setActiveModal} />
            }
          />
          <Route path="/video-call" element={<VideoCall />} />
        </Routes>

      {activeModal && (
        <SignIn
          mode={activeModal}
          onClose={() => setActiveModal(null)}
          onAuthSuccess={handleAuthSuccess}
          onSwitch={() =>
            setActiveModal(activeModal === "signin" ? "login" : "signin")
          }
        />
      )}
    </>
  );
}

// ✅ Wrap AppContent with BrowserRouter
function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
