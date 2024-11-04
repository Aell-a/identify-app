"use client";

import { useState } from "react";
import { checkEmail, checkNickname } from "@/lib/middleware";
import { checkPasswordStrength } from "@/lib/utils";
import { useAuth } from "@/lib/auth";

export default function AuthPopup({ onClose }) {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [retypePassword, setRetypePassword] = useState("");
  const [nickname, setNickname] = useState("");
  const [errors, setErrors] = useState({});

  const { signup, isLoading, error } = useAuth();

  const handleContinue = async () => {
    if (step === 1) {
      const newErrors = {};

      if (!email) {
        newErrors.email = "Email is required";
      } else {
        const isEmailValid = await checkEmail(email);
        if (!isEmailValid) {
          newErrors.email = "Invalid email or email already in use";
        }
      }

      if (!password) {
        newErrors.password = "Password is required";
      } else {
        const isPasswordStrong = await checkPasswordStrength(password);
        if (!isPasswordStrong) {
          newErrors.password = "Password is not strong enough";
        }
      }

      if (password !== retypePassword) {
        newErrors.retypePassword = "Passwords do not match";
      }

      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return;
      }

      setErrors({});
      setStep(2);
    } else if (step === 2) {
      if (!nickname) {
        setErrors({ nickname: "Nickname is required" });
        return;
      }

      const isNicknameUnique = await checkNickname(nickname);
      if (!isNicknameUnique) {
        setErrors({ nickname: "Nickname is already taken" });
        return;
      }

      setErrors({});
      setStep(3);
    } else if (step === 3) {
      await signup(nickname, email, password);
    }
  };

  const renderInput = (name, type, placeholder, value, onChange) => (
    <div className="mb-4">
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full p-2 bg-gray-700 text-white rounded ${
          errors[name] ? "border-red-500" : "border-gray-600"
        }`}
        aria-invalid={errors[name] ? "true" : "false"}
        aria-describedby={errors[name] ? `${name}-error` : undefined}
      />
      {errors[name] && (
        <p
          className="text-red-500 text-sm mt-1"
          id={`${name}-error`}
          role="alert"
        >
          {errors[name]}
        </p>
      )}
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-gray-800 p-8 rounded-lg w-96">
        {error && (
          <div className="mb-4 p-2 bg-red-600 text-white rounded" role="alert">
            {error}
          </div>
        )}
        {step !== 3 && <h2 className="text-2xl font-bold mb-4">Register</h2>}
        {step === 1 && (
          <>
            {renderInput("email", "email", "Email", email, setEmail)}
            {renderInput(
              "password",
              "password",
              "Password",
              password,
              setPassword
            )}
            {renderInput(
              "retypePassword",
              "password",
              "Retype Password",
              retypePassword,
              setRetypePassword
            )}
          </>
        )}
        {step === 2 && (
          <>
            <h3 className="pb-1 text-sm">
              Great! Now choose a nickname for your account!
            </h3>
            {renderInput("nickname", "text", "Nickname", nickname, setNickname)}
          </>
        )}
        {step === 3 && (
          <div>
            <div>
              <h3>Welcome to IDentify</h3>
            </div>
            <div className="mt-4 flex justify-between">
              <button className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 mx-2 rounded">
                Customize Profile
              </button>
              <button className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 mx-2 rounded">
                Explore Website
              </button>
            </div>
          </div>
        )}
        {step !== 3 && (
          <div className="flex justify-between">
            <button
              onClick={onClose}
              className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              onClick={handleContinue}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              disabled={isLoading}
            >
              {isLoading ? "Loading..." : step === 1 ? "Continue" : "Register"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
