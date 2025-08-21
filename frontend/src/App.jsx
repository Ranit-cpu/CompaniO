import { useState, useEffect } from 'react';
import './App.css';
import Header from './Components/Header/Header';
import Home from './Home';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Upload from './Components/Upload/Upload';
import SignIn from './Components/SignIn/SignIn';
import NamePage from './Components/NamePage/NamePage';
import About from './Components/About/About';
import Chat from './Components/Chat/Chat';

function App() {
  const [activeModal, setActiveModal] = useState(null); // "login", "signin", or null
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check authentication status on app load
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("token");
      // Only consider user authenticated if token exists and is not the dummy token
      const isValidToken = token && token !== "dummyToken" && token.length > 10;
      setIsAuthenticated(isValidToken);
    };

    checkAuth();
  }, []);

  // Handle successful login/signup
  const handleAuthSuccess = (realToken) => {
    // Only set token if it's a real token, not dummy
    if (realToken && realToken !== "dummyToken") {
      localStorage.setItem("token", realToken);
      setIsAuthenticated(true);
      setActiveModal(null);
    } else {
      console.error("Invalid token provided");
    }
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    window.location.href = "/";
  };

  return (
    <>
      <BrowserRouter>
        {/* Header is outside Routes so it shows on all pages */}
        <Header
          onLoginClick={() => setActiveModal("login")}
          onSignUpClick={() => setActiveModal("signin")}
          isAuthenticated={isAuthenticated}
          onLogout={handleLogout}
        />

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
          <Route path="/about" element={<About />} />
          <Route
            path="/chat"
            element={
              isAuthenticated ? <Chat /> : <Home setActiveModal={setActiveModal} />
            }
          />
        </Routes>

        {/* SignIn Modal (used for both login/signup) */}
        {activeModal && (
          <SignIn
            mode={activeModal} // pass "login" or "signin"
            onClose={() => setActiveModal(null)}
            onAuthSuccess={handleAuthSuccess}
            onSwitch={() =>
              setActiveModal(activeModal === "signin" ? "login" : "signin")
            }
          />
        )}
      </BrowserRouter>
    </>
  );
}

export default App;