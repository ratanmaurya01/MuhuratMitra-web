
"use client";

import {
  createContext,
  useState,
  useEffect,
} from "react";

import {
  registerUser as registerUserAPI,
  loginUser as loginUserAPI,
  logoutUser as logoutUserAPI,
} from "@/services/authService";

export const AuthContext = createContext(null);

export const USER_ROLES = {
  DEVOTEE: "DEVOTEE",
  PANDIT: "PANDIT",
  ADMIN: "ADMIN",
};

export const USER_STATUS = {
  ACTIVE: "ACTIVE",
  PENDING: "PENDING",
  REJECTED: "REJECTED",
  BLOCKED: "BLOCKED",
};

const STORAGE_KEY = "muhuratmitra_user";

const formatUser = (user) => ({
  ...user,
  phone: user.mobile || user.phone,
  role: user.role?.toUpperCase(),
  status: user.status?.toUpperCase(),
});

const getRedirectPath = (user) => {
  if (user?.status === USER_STATUS.PENDING) {
    return "/pandit/pending-approval";
  }

  if (user?.status !== USER_STATUS.ACTIVE) {
    return "/login";
  }

  switch (user?.role) {
    case USER_ROLES.ADMIN:
      return "/admin/dashboard";
    case USER_ROLES.PANDIT:
      return "/pandit/dashboard";
    default:
      return "/account";
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  // Restore session from localStorage
  useEffect(() => {
    try {
      const savedUser = localStorage.getItem(STORAGE_KEY);

      if (savedUser) {
        const userData = formatUser(JSON.parse(savedUser));

        if (
          [USER_STATUS.ACTIVE, USER_STATUS.PENDING].includes(
            userData.status
          )
        ) {
          setUser(userData);
          setIsLoggedIn(true);
        } else {
          localStorage.removeItem(STORAGE_KEY);
        }
      }
    } catch (error) {
      console.error("Local Auth Restore Error:", error);
      localStorage.removeItem(STORAGE_KEY);
    } finally {
      setLoading(false);
    }
  }, []);

  // Register
  const register = async (values) => {
    const result = await registerUserAPI(values);

    if (!result.success) {
      throw new Error(result.message);
    }

    const userData = formatUser(result.data.user);

    if (userData.status === USER_STATUS.ACTIVE) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(userData));
      setUser(userData);
      setIsLoggedIn(true);
    }

    return {
      user: userData,
      redirectTo: getRedirectPath(userData),
    };
  };

  // Login
  const login = async (values) => {
    const result = await loginUserAPI({
      email: values.email.trim().toLowerCase(),
      password: values.password,
    });

    if (!result.success) {
      throw new Error(result.message);
    }

    const userData = formatUser(result.data.user);

    if (userData.status === USER_STATUS.BLOCKED) {
      throw new Error("Your account has been blocked.");
    }

    if (userData.status === USER_STATUS.REJECTED) {
      throw new Error("Your Pandit application was rejected.");
    }

    if (
      ![USER_STATUS.ACTIVE, USER_STATUS.PENDING].includes(
        userData.status
      )
    ) {
      throw new Error("Your account is not active.");
    }

    // Save user in localStorage
    localStorage.setItem(STORAGE_KEY, JSON.stringify(userData));

    setUser(userData);
    setIsLoggedIn(true);

    return {
      user: userData,
      redirectTo: getRedirectPath(userData),
    };
  };

  // Logout
  const logout = async () => {
    try {
      await logoutUserAPI();
    } catch (error) {
      console.error("Logout API Error:", error);
    } finally {
      localStorage.removeItem(STORAGE_KEY);
      setUser(null);
      setIsLoggedIn(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isLoggedIn,
        isAuthenticated: isLoggedIn,
        register,
        login,
        logout,
        setUser,
        getRedirectPath,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
