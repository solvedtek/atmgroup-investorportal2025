import { Routes, Route } from "react-router-dom";
import "./App.css";

// Import the new components
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import Navbar from "./components/layout/Navbar";

function App() {
  return (
    <>
      <Navbar /> {/* Render the Navbar */}
      {/* Define Routes using imported components */}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        {/* Add other routes later */}
      </Routes>
    </>
  );
}

export default App;
