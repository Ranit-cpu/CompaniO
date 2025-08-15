import { useState } from 'react';
import './App.css';
import Header from './Components/Header/Header';
import Home from './Home';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Upload from './Components/Upload/Upload';
import SignIn from './Components/SignIn/SignIn';


function App() {
  const [activeModal, setActiveModal] = useState(null); 
  // "login", "signin", or null

  return (
    <>
      <BrowserRouter>
        {/* Header is outside Routes so it shows on all pages */}
        <Header onLoginClick={() => setActiveModal("login")} onSignUpClick={() => setActiveModal("signin")} />
        
        <Routes>
          {/* Main page */}
          <Route path="/" element={<Home />} />

          {/* Upload page */}
          <Route path="/upload" element={<Upload />} />
        </Routes>

       

        {activeModal === "signin" && (
          <SignIn 
            onClose={() => setActiveModal(null)} 
            onSwitch={() => setActiveModal("login")} 
          />
        )}
      </BrowserRouter>
    </>
  );
}

export default App;
