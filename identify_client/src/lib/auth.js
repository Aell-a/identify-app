"use client";

import { login, register, verify } from "./middleware";

const { createContext, useReducer, useEffect, useContext } = require("react");

const AuthContext = createContext();

const initialState = {
  id: null,
  user: null,
  token: null,
  isLoading: false,
  error: null,
};

function authReducer(state, action) {
  switch (action.type) {
    case "LOGIN":
      return {
        ...state,
        id: action.payload.id,
        user: action.payload.nickname,
        token: action.payload.token,
        isLoading: false,
        error: null,
      };
    case "SIGNUP":
      return {
        ...state,
        id: action.payload.id,
        user: action.payload.nickname,
        token: action.payload.token,
        isLoading: false,
        error: null,
      };
    case "AUTH_SUCCESS":
      return {
        ...state,
        id: action.payload.id,
        user: action.payload.nickname,
        token: action.payload.token,
        isLoading: false,
        error: null,
      };
    case "LOGOUT":
      return { ...initialState };
    case "AUTH_FAILURE":
      return { ...initialState, error: action.payload, isLoading: false };
    case "LOADING":
      return { ...state, isLoading: true };
    default:
      return state;
  }
}

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token");
      if (token && !state.user) {
        const response = await verify(token);
        if (!response.success) {
          localStorage.removeItem("token");
          dispatch({ type: "LOGOUT" });
        } else {
          dispatch({
            type: "AUTH_SUCCESS",
            payload: { ...response.data, token },
          });
        }
      }
    };

    checkAuth();
  }, [state.user]);

  const handleLogin = async (identifier, password) => {
    dispatch({ type: "LOADING" });
    try {
      const response = await login(identifier, password);
      if (response.success) {
        dispatch({ type: "LOGIN", payload: response.data });
        localStorage.setItem("token", response.data.token);
      } else {
        dispatch({
          type: "AUTH_FAILURE",
          payload: response.error,
        });
      }
      return response;
    } catch (error) {
      dispatch({
        type: "AUTH_FAILURE",
        payload: "An unexpected error occurred",
      });
      return { success: false, error: "An unexpected error occurred" };
    }
  };

  const handleLogout = async () => {
    localStorage.removeItem("token");
    dispatch({ type: "LOGOUT" });
    window.location.href = "/";
  };

  const handleSignup = async (nickname, email, password) => {
    dispatch({ type: "LOADING" });
    try {
      const response = await register(nickname, email, password);

      if (response.success) {
        dispatch({ type: "SIGNUP", payload: response.data });
        localStorage.setItem("token", response.data.token);
      } else {
        dispatch({
          type: "AUTH_FAILURE",
          payload: response.error,
        });
      }
      return response;
    } catch (error) {
      dispatch({
        type: "AUTH_FAILURE",
        payload: "An unexpected error occurred",
      });
      return { success: false, error: "An unexpected error occurred" };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login: handleLogin,
        logout: handleLogout,
        signup: handleSignup,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
