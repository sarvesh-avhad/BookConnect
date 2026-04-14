import { createContext, useState, useEffect } from "react";
import { getProfile } from "../services/authService";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // initialize user from localStorage
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  // load profile on refresh
  const refreshUser = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const profile = await getProfile();
      setUser(profile);
      localStorage.setItem("user", JSON.stringify(profile));
    } catch (err) {
      console.error("Failed to refresh profile", err);
    }
  };

  // initial load
  useEffect(() => {
    refreshUser();
  }, []);

  // login
  const login = (data) => {
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));
    setUser(data.user);
  };

  // update profile
  const updateUser = (updatedUser) => {
    localStorage.setItem("user", JSON.stringify(updatedUser));
    setUser(updatedUser);
  };

  // logout
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        updateUser,
        refreshUser,
        setUser, // exposed for flexibility
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
