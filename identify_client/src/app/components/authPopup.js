"use client";

import { useState } from "react";
import {
  checkEmail,
  checkPasswordStrength,
  checkNicknameUniqueness,
} from "@/lib/middleware";

export default function AuthPopup({ onClose, onLogin }) {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [retypePassword, setRetypePassword] = useState("");
  const [nickname, setNickname] = useState("");

  const handleContinue = async () => {
    if (step === 1) {
      const isEmailValid = await checkEmail(email);
      const isPasswordStrong = await checkPasswordStrength(password);
      if (isEmailValid && isPasswordStrong && password === retypePassword) {
        setStep(2);
      } else {
        alert("Please check your email and password");
      }
    } else if (step === 2) {
      const isNicknameUnique = await checkNicknameUniqueness(nickname);
      if (isNicknameUnique) {
        onLogin(nickname);
      } else {
        alert("Nickname is already taken");
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-gray-800 p-8 rounded-lg w-96">
        <h2 className="text-2xl font-bold mb-4">Register</h2>
        {step === 1 && (
          <>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 mb-4 bg-gray-700 text-white rounded"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 mb-4 bg-gray-700 text-white rounded"
            />
            <input
              type="password"
              placeholder="Retype Password"
              value={retypePassword}
              onChange={(e) => setRetypePassword(e.target.value)}
              className="w-full p-2 mb-4 bg-gray-700 text-white rounded"
            />
          </>
        )}
        {step === 2 && (
          <input
            type="text"
            placeholder="Nickname"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            className="w-full p-2 mb-4 bg-gray-700 text-white rounded"
          />
        )}
        <div className="flex justify-between">
          <button
            onClick={onClose}
            className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
          >
            Cancel
          </button>
          <button
            onClick={handleContinue}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            {step === 1 ? "Continue" : "Register"}
          </button>
        </div>
        {step === 2 && (
          <div className="mt-4 flex justify-between">
            <button className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
              Customize Profile
            </button>
            <button className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded">
              Explore Website
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
