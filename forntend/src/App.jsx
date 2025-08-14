import { useState } from 'react'
import './App.css'
import Header from './Components/Header/Header';
import Home from './Home';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LogIn from './Components/LogIn/LogIn'; 
import SignIn from './Components/SignIn/SignIn';
// import { Upload } from 'lucide-react';
import Upload from './Components/Upload/Upload';


function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      {/* <Home/> */}
       
    <BrowserRouter>
      <Routes>
        {/* Route for the Home page, set to the root path */}
        <Route path="/" element={<Home />} />

        {/* Routes for Login and SignIn components */}
        <Route path="/login" element={<LogIn />} />
        <Route path="/signin" element={<SignIn />} />
         <Route path="/upload" element={<Upload />} />
      </Routes>
    </BrowserRouter>
    </>
  )
}

export default App
