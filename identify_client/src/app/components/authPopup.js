"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth";
import { checkEmail, checkNickname } from "@/lib/middleware";

export default function AuthPopup({ onClose }) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [retypePassword, setRetypePassword] = useState("");
  const [nickname, setNickname] = useState("");
  const [errors, setErrors] = useState([]);
  const { login, signup, user, error } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors([]);

    if (isLogin) {
      const result = await login(nickname, password);
      console.log(result);
      if (result.success) {
        onClose();
      } else {
        console.log(result.error);
        setErrors([result.error]);
      }
    } else {
      if (password !== retypePassword) {
        setErrors(["Passwords do not match"]);
        return;
      }

      const isEmailValid = await checkEmail(email);
      if (!isEmailValid) {
        setErrors(["Email is already in use"]);
        return;
      }

      const isNicknameValid = await checkNickname(nickname);
      if (!isNicknameValid) {
        setErrors(["Nickname is already taken"]);
        return;
      }

      const result = await signup(nickname, email, password);
      if (result.success) {
        onClose();
      } else {
        setErrors([result.error]);
      }
    }
  };

  const renderInput = (name, type, placeholder, value, onChange) => (
    <div className="mb-4">
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
          setErrors([]);
        }}
        className={`w-full p-2 bg-gray-700 text-white rounded-lg ${
          errors.length > 0 ? "border-red-500" : "border-gray-600"
        }`}
        aria-invalid={errors.length > 0 ? "true" : "false"}
        aria-describedby={errors.length > 0 ? "form-error" : undefined}
      />
    </div>
  );

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div
        className="fixed inset-0 backdrop-blur-md bg-black bg-opacity-50 cursor-pointer"
        onClick={onClose}
      />
      <div className="bg-gray-800 p-8 rounded-lg w-96 relative z-10">
        <h2 className="text-2xl font-bold mb-4">
          {isLogin ? "Login" : "Register"}
        </h2>
        <form onSubmit={handleSubmit}>
          {isLogin ? (
            renderInput(
              "nickname",
              "text",
              "Enter nickname",
              nickname,
              setNickname
            )
          ) : (
            <>
              {renderInput("email", "email", "Email", email, setEmail)}
              {renderInput(
                "nickname",
                "text",
                "Nickname",
                nickname,
                setNickname
              )}
            </>
          )}
          {renderInput(
            "password",
            "password",
            "Password",
            password,
            setPassword
          )}
          {!isLogin &&
            renderInput(
              "retypePassword",
              "password",
              "Retype Password",
              retypePassword,
              setRetypePassword
            )}
          {errors.length > 0 && (
            <p
              className="text-red-500 text-sm mb-4"
              id="form-error"
              role="alert"
            >
              {errors[0]}
            </p>
          )}
          <div className="flex justify-between">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              {isLogin ? "Login" : "Register"}
            </button>
          </div>
        </form>
        <p className="mt-4 text-center">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-blue-400 hover:underline focus:outline-none"
          >
            {isLogin ? "Register" : "Login"}
          </button>
        </p>
      </div>
    </div>
  );
}
