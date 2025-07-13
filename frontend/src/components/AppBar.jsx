import React, { useState, useRef, useEffect } from "react";
import Avatar from "./Avatar";
import { useNavigate } from "react-router-dom";

export const AppBar = ({ text, firstName }) => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const dropdownRef = useRef(null);

  const toggleMenu = () => setMenuOpen((prev) => !prev);

  const logout = () => {
    localStorage.clear();
    navigate("/signin");
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="flex justify-between bg-secondary text-primary shadow-xl p-4 rounded-b-xl relative">
      <div className="text-2xl font-bold">{text}</div>

      <div className="relative gap-3 flex items-center font-medium" ref={dropdownRef}>
        <div className="cursor-pointer flex items-center" onClick={toggleMenu}>
          <Avatar name={firstName} />
          <div className="text-[#E0E0E0] ml-2">Welcome, {firstName}!</div>
        </div>

        {menuOpen && (
          <div className="w-full px-3 py-2 bg-[#1E1E1E] text-[#E0E0E0] border border-gray-600 rounded-md placeholder-gray-500">
            <button
              onClick={logout}
              className="w-full px-4 py-2 text-left hover:bg-[#1E1E1E] text-[#E0E0E0]"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
