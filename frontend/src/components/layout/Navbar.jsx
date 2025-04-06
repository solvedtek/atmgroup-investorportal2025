import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav>
      <ul className="flex space-x-4 bg-gray-800 p-4">
        <li className="text-white hover:text-gray-300">
          <Link to="/">Home</Link>
        </li>
        <li className="text-white hover:text-gray-300">
          <Link to="/login">Login</Link>
        </li>
        <li className="text-white hover:text-gray-300">
          <Link to="/dashboard">Dashboard</Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
