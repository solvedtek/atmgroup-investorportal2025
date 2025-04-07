import React, { useState } from "react";
import { Link } from "react-router-dom";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu.jsx";
import { Button } from "@/components/ui/button"; // hypothetical ShadCN button import
import { cn } from "@/lib/utils"; // className utility if available

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-gray-800 p-4" role="navigation" aria-label="Main navigation">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link to="/" className="text-white font-semibold hover:text-gray-300">
            ATMG Portal
          </Link>
          <div className="hidden md:flex space-x-4">
            <Link to="/" className="text-white hover:text-gray-300">
              Home
            </Link>
            <Link to="/login" className="text-white hover:text-gray-300">
              Login
            </Link>
            <Link to="/dashboard" className="text-white hover:text-gray-300">
              Dashboard
            </Link>
          </div>
        </div>
        <div className="hidden md:flex items-center space-x-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="text-white hover:text-gray-300">
                User
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-white text-black rounded shadow-md mt-2">
              <DropdownMenuItem>
                <Link to="/profile" className="block w-full px-4 py-2 hover:bg-gray-100">Profile</Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link to="/settings" className="block w-full px-4 py-2 hover:bg-gray-100">Settings</Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <button className="block w-full text-left px-4 py-2 hover:bg-gray-100">Logout</button>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="md:hidden">
          <Button
            variant="ghost"
            className="text-white hover:text-gray-300 focus:outline-none"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
            aria-expanded={isOpen}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              {isOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </Button>
        </div>
      </div>
      {isOpen && (
        <div className="mt-2 space-y-2 md:hidden">
          <Link to="/" className="block text-white hover:text-gray-300">
            Home
          </Link>
          <Link to="/login" className="block text-white hover:text-gray-300">
            Login
          </Link>
          <Link to="/dashboard" className="block text-white hover:text-gray-300">
            Dashboard
          </Link>
          <div className="border-t border-gray-700 mt-2 pt-2">
            <Link to="/profile" className="block text-white hover:text-gray-300">
              Profile
            </Link>
            <Link to="/settings" className="block text-white hover:text-gray-300">
              Settings
            </Link>
            <button className="block w-full text-left text-white hover:text-gray-300 mt-1">
              Logout
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
