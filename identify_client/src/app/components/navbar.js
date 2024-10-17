"use client";

import { useState } from "react";
import AuthPopup from "./AuthPopup";

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAuthPopupOpen, setIsAuthPopupOpen] = useState(false);
  const [userNickname, setUserNickname] = useState("");

  const handleLogin = (nickname) => {
    setIsLoggedIn(true);
    setUserNickname(nickname);
    setIsAuthPopupOpen(false);
  };

  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-white text-xl font-bold">Demo App</div>
        <div>
          {isLoggedIn ? (
            <div className="flex items-center">
              <span className="text-white mr-2">{userNickname}</span>
              <button className="bg-gray-700 hover:bg-gray-600 text-white rounded-full p-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsAuthPopupOpen(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Register
            </button>
          )}
        </div>
      </div>
      {isAuthPopupOpen && (
        <AuthPopup
          onClose={() => setIsAuthPopupOpen(false)}
          onLogin={handleLogin}
        />
      )}
    </nav>
  );
}
