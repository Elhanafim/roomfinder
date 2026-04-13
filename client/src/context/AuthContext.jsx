import React, { createContext, useContext, useReducer, useEffect } from "react";
import api from "../services/api.js";

const AuthContext = createContext(null);

const initialState = { user: null, token: null, loading: true, error: null };

function authReducer(state, action) {
  switch (action.type) {
    case "AUTH_SUCCESS":
      return { ...state, user: action.user, token: action.token, loading: false, error: null };
    case "AUTH_FAILURE":
      return { ...state, user: null, token: null, loading: false, error: action.error };
    case "LOGOUT":
      return { ...initialState, loading: false };
    case "CLEAR_ERROR":
      return { ...state, error: null };
    default:
      return state;
  }
}

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    const token = localStorage.getItem("rf_token");
    if (!token) {
      dispatch({ type: "LOGOUT" });
      return;
    }
    api.get("/auth/me")
      .then(({ data }) => dispatch({ type: "AUTH_SUCCESS", user: data.user, token }))
      .catch(() => {
        localStorage.removeItem("rf_token");
        dispatch({ type: "LOGOUT" });
      });
  }, []);

  useEffect(() => {
    const handler = () => logout();
    window.addEventListener("auth:logout", handler);
    return () => window.removeEventListener("auth:logout", handler);
  }, []);

  async function login(email, password) {
    dispatch({ type: "CLEAR_ERROR" });
    const { data } = await api.post("/auth/login", { email, password });
    localStorage.setItem("rf_token", data.token);
    dispatch({ type: "AUTH_SUCCESS", user: data.user, token: data.token });
    return data.user;
  }

  async function register(name, email, password, role) {
    dispatch({ type: "CLEAR_ERROR" });
    const { data } = await api.post("/auth/register", { name, email, password, role });
    localStorage.setItem("rf_token", data.token);
    dispatch({ type: "AUTH_SUCCESS", user: data.user, token: data.token });
    return data.user;
  }

  function logout() {
    localStorage.removeItem("rf_token");
    dispatch({ type: "LOGOUT" });
  }

  return (
    <AuthContext.Provider
      value={{
        ...state,
        isAuthenticated: !!state.user,
        login,
        register,
        logout,
        clearError: () => dispatch({ type: "CLEAR_ERROR" }),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
