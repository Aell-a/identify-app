"use client";

import { useState } from "react";
import AuthPopup from "./components/authPopup";

export default function Home() {
  const [isAuthPopupOpen, setIsAuthPopupOpen] = useState(false);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold mb-8">Welcome to the Demo App</h1>
      <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
        Dummy Button
      </button>
      {isAuthPopupOpen && (
        <AuthPopup onClose={() => setIsAuthPopupOpen(false)} />
      )}
    </main>
  );
}
