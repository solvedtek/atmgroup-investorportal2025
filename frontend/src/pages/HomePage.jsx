import React from "react";
import { Link } from "react-router-dom";

const HomePage = () => (
  <div className="p-4">
    <h2 className="text-2xl font-bold mb-4">Home Page</h2>
    Home Page Placeholder - <Link to="/login">Login</Link> |{" "}
    <Link to="/dashboard">Dashboard</Link>
  </div>
);

export default HomePage;
