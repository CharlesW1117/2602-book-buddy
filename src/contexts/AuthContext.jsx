/* eslint-disable react-refresh/only-export-components */
import { createContext, useEffect, useState } from "react";
import { api } from "../api";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem("bb_token"));
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(!!token);

  useEffect(() => {
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }
    let mounted = true;
    setLoading(true);
    api.getProfile(token)
      .then((data) => {
        if (mounted) setUser(data);
      })
      .catch(() => {
        localStorage.removeItem("bb_token");
        setToken(null);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => { mounted = false; };
  }, [token]);

  const login = async (credentials) => {
    const data = await api.login(credentials);
    const t = data.token;
    if (!t) throw new Error("No token returned from login");
    localStorage.setItem("bb_token", t);
    setToken(t);
    return data;
  };

  const register = async (payload) => {
    const data = await api.register(payload);
    const t = data.token;
    if (!t) throw new Error("No token returned from register");
    localStorage.setItem("bb_token", t);
    setToken(t);
    return data;
  };

  const logout = () => {
    localStorage.removeItem("bb_token");
    setToken(null);
    setUser(null);
  };

  const displayName = user ? `${user.firstname} ${user.lastname}` : "";

  return (
    <AuthContext.Provider value={{
      token,
      user,
      displayName,
      loading,
      login,
      register,
      logout,
      setUser
    }}>
      {children}
    </AuthContext.Provider>
  );
}
