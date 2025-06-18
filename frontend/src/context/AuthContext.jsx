import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if user is logged in on app start
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      checkAuthStatus();
    } else {
      setLoading(false);
    }
  }, []);

  const checkAuthStatus = async () => {
    try {
      const response = await axios.get("/auth/me");
      setUser(response.data.user);
    } catch (error) {
      localStorage.removeItem("token");
      delete axios.defaults.headers.common["Authorization"];
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      setError(null);
      const response = await axios.post("/auth/login", { email, password });
      const { token, user } = response.data;

      localStorage.setItem("token", token);
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      setUser(user);

      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || "Login failed";
      setError(message);
      return { success: false, message };
    }
  };

  const register = async (username, email, password, leetcodeProfile) => {
    try {
      setError(null);
      const response = await axios.post("/auth/register", {
        username,
        email,
        password,
        leetcodeProfile,
      });
      const { token, user } = response.data;

      localStorage.setItem("token", token);
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      setUser(user);

      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || "Registration failed";
      setError(message);
      return { success: false, message };
    }
  };

  const logout = async () => {
    try {
      await axios.post("/auth/logout");
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      localStorage.removeItem("token");
      delete axios.defaults.headers.common["Authorization"];
      setUser(null);
    }
  };

  const updateProfile = async (userData) => {
    try {
      setError(null);
      const response = await axios.put("/users/profile", userData);
      setUser(response.data.user);
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || "Update failed";
      setError(message);
      return { success: false, message };
    }
  };

  const changePassword = async (currentPassword, newPassword) => {
    try {
      setError(null);
      await axios.put("/users/change-password", {
        currentPassword,
        newPassword,
      });
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || "Password change failed";
      setError(message);
      return { success: false, message };
    }
  };

  const clearError = () => {
    setError(null);
  };

  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    updateProfile,
    changePassword,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
