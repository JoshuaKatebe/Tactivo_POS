import React, { createContext, useContext, useEffect, useState } from "react";
import { authApi } from "@/api/auth";

export const AuthContext = createContext(null);

/**
 * Provides authentication and user session management using Tactivo Server
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [employee, setEmployee] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load auth state from localStorage on mount
  useEffect(() => {
    const storedToken = localStorage.getItem("auth_token");
    const storedUser = localStorage.getItem("user");
    const storedEmployee = localStorage.getItem("employee");

    if (storedToken) {
      setToken(storedToken);
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
      if (storedEmployee) {
        setEmployee(JSON.parse(storedEmployee));
      }
      // Verify token is still valid
      verifyToken();
    } else {
      setLoading(false);
    }
  }, []);

  const verifyToken = async () => {
    try {
      const userData = await authApi.getMe();
      setUser(userData);
      setLoading(false);
    } catch (error) {
      // Token invalid, clear auth
      logout();
    }
  };

  const login = async (username, password) => {
    try {
      const response = await authApi.login(username, password);

      setToken(response.token);
      setUser(response.user);
      setEmployee(response.employee || null);

      // Store in localStorage for persistence and axios interceptor
      localStorage.setItem("auth_token", response.token);
      localStorage.setItem("user", JSON.stringify(response.user));
      if (response.employee) {
        localStorage.setItem("employee", JSON.stringify(response.employee));
      } else {
        localStorage.removeItem("employee");
      }

      // Keep compatibility with existing PrivateRoute that checks authToken
      localStorage.setItem("authToken", "yes");

      return response;
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    authApi.logout();
    setToken(null);
    setUser(null);
    setEmployee(null);
    localStorage.removeItem("authToken");
    setLoading(false);
  };

  const hasPermission = (permissionCode) => {
    // Superusers have all permissions
    if (user?.is_superuser) {
      return true;
    }
    // Check employee permissions
    if (employee?.permissions) {
      return employee.permissions.includes(permissionCode);
    }
    return false;
  };

  const hasAnyPermission = (...permissionCodes) => {
    if (user?.is_superuser) {
      return true;
    }
    if (employee?.permissions) {
      return permissionCodes.some((code) => employee.permissions.includes(code));
    }
    return false;
  };

  const value = {
    user,
    employee,
    token,
    loading,
    login,
    logout,
    hasPermission,
    hasAnyPermission,
    isAuthenticated: !!token,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
