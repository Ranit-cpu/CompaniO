import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NamePage from "./Components/NamePage/NamePage"; // adjust path
import Hero from "./Components/Hero/Hero";
import Header from "./Components/Header/Header";
// other imports...

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Hero />} />
        <Route path="/namepage" element={<NamePage />} />
      </Routes>
    </Router>
  );
}

export default App;
