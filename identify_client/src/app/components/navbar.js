"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth";
import AuthPopup from "./authPopup";
import { CircleUserRound } from "lucide-react";

export default function Navbar() {
  const { user, id, logout } = useAuth();
  const [isAuthPopupOpen, setIsAuthPopupOpen] = useState(false);

  return (
    <nav className="bg-gray-800 shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <Link
            href="/"
            className="text-white text-xl font-bold flex justify-center items-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="48px"
              viewBox="0 -960 960 960"
              width="48px"
              fill="#FFFFFF"
              className="mr-1"
            >
              <path d="M440-220q125 0 212.5-87.5T740-520q0-125-87.5-212.5T440-820q-125 0-212.5 87.5T140-520q0 125 87.5 212.5T440-220Zm0-300Zm0 160q-83 0-147.5-44.5T200-520q28-70 92.5-115T440-680q82 0 146.5 45T680-520q-29 71-93.5 115.5T440-360Zm0-60q55 0 101-26.5t72-73.5q-26-46-72-73t-101-27q-56 0-102 27t-72 73q26 47 72 73.5T440-420Zm0-50q20 0 35-14.5t15-35.5q0-20-15-35t-35-15q-21 0-35.5 15T390-520q0 21 14.5 35.5T440-470Zm0 310q-75 0-140.5-28.5t-114-77q-48.5-48.5-77-114T80-520q0-74 28.5-139.5t77-114.5q48.5-49 114-77.5T440-880q74 0 139.5 28.5T694-774q49 49 77.5 114.5T800-520q0 67-22.5 126T715-287l164 165-42 42-165-165q-48 40-107 62.5T440-160Z" />
            </svg>
            IDentify
          </Link>
          <div>
            {user ? (
              <div className="flex items-center space-x-4">
                <Link
                  href={`/profile/${id}`}
                  className="flex text-white hover:text-gray-300"
                >
                  <CircleUserRound className="mr-1" />
                  {user}
                </Link>

                <button
                  onClick={logout}
                  className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                >
                  Logout
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsAuthPopupOpen(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              >
                Login / Register
              </button>
            )}
          </div>
        </div>
      </div>
      {isAuthPopupOpen && (
        <AuthPopup onClose={() => setIsAuthPopupOpen(false)} />
      )}
    </nav>
  );
}
