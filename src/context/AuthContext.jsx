
"use client";

import {
  createContext,
  useCallback,
  useEffect,
  useState,
} from "react";

const AuthContext = createContext(null);

const USERS_KEY = "muhuratmitra_users";
const SESSION_KEY = "muhuratmitra_user";

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

function readJSON(key, fallback) {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
}

function getSafeUser(user) {
  if (!user) return null;

  const {
    passwordHash,
    passwordSalt,
    ...safeUser
  } = user;

  return safeUser;
}

async function hashPassword(password, salt) {
  if (!window.crypto?.subtle) {
    throw new Error(
      "Secure browser context required. Use localhost or HTTPS."
    );
  }

  const encoder = new TextEncoder();

  const keyMaterial = await window.crypto.subtle.importKey(
    "raw",
    encoder.encode(password),
    "PBKDF2",
    false,
    ["deriveBits"]
  );

  const derivedBits = await window.crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      salt: Uint8Array.from(atob(salt), (char) =>
        char.charCodeAt(0)
      ),
      iterations: 100000,
      hash: "SHA-256",
    },
    keyMaterial,
    256
  );

  return btoa(
    String.fromCharCode(...new Uint8Array(derivedBits))
  );
}

function createSalt() {
  const bytes = window.crypto.getRandomValues(
    new Uint8Array(16)
  );

  return btoa(String.fromCharCode(...bytes));
}

function getRedirectPath(user) {
  if (!user) return "/login";

  if (user.status === USER_STATUS.PENDING) {
    return "/pandit/pending-approval";
  }

  if (user.status !== USER_STATUS.ACTIVE) {
    return "/login";
  }

  switch (user.role) {
    case USER_ROLES.ADMIN:
      return "/admin/dashboard";

    case USER_ROLES.PANDIT:
      return "/pandit/dashboard";

    case USER_ROLES.DEVOTEE:
    default:
      return "/account";
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Restore logged-in session
  useEffect(() => {
    try {
      const savedUser = readJSON(SESSION_KEY, null);

      if (savedUser) {
        setUser(savedUser);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  // Register new user
  const register = useCallback(async (values) => {
    const users = readJSON(USERS_KEY, []);

    const email = values.email.trim().toLowerCase();
    const phone = values.phone.trim();

    const existingUser = users.find(
      (item) =>
        item.email === email || item.phone === phone
    );

    if (existingUser) {
      throw new Error(
        "Email or mobile number is already registered."
      );
    }

    const role = values.accountType;

    // Admin registration is never allowed publicly
    if (
      ![USER_ROLES.DEVOTEE, USER_ROLES.PANDIT].includes(role)
    ) {
      throw new Error("Invalid account type.");
    }

    const salt = createSalt();
    const passwordHash = await hashPassword(
      values.password,
      salt
    );

    const newUser = {
      id: `USER_${window.crypto.randomUUID()}`,
      name: values.name.trim(),
      email,
      phone,
      role,
      status:
        role === USER_ROLES.PANDIT
          ? USER_STATUS.PENDING
          : USER_STATUS.ACTIVE,
      passwordSalt: salt,
      passwordHash,
      createdAt: new Date().toISOString(),
    };

    users.push(newUser);

    localStorage.setItem(USERS_KEY, JSON.stringify(users));

    // Pandits stay logged out until approval.
    if (newUser.status === USER_STATUS.ACTIVE) {
      const safeUser = getSafeUser(newUser);

      localStorage.setItem(
        SESSION_KEY,
        JSON.stringify(safeUser)
      );

      setUser(safeUser);
    }

    return {
      user: getSafeUser(newUser),
      redirectTo: getRedirectPath(newUser),
    };
  }, []);

  // Login existing user
  const login = useCallback(async ({ email, password }) => {
    const users = readJSON(USERS_KEY, []);

    const normalizedEmail = email.trim().toLowerCase();

    const existingUser = users.find(
      (item) => item.email === normalizedEmail
    );

    if (!existingUser) {
      throw new Error("Invalid email or password.");
    }

    const enteredHash = await hashPassword(
      password,
      existingUser.passwordSalt
    );

    if (enteredHash !== existingUser.passwordHash) {
      throw new Error("Invalid email or password.");
    }

    if (existingUser.status === USER_STATUS.PENDING) {
      throw new Error(
        "Your Pandit account is waiting for admin approval."
      );
    }

    if (existingUser.status === USER_STATUS.REJECTED) {
      throw new Error("Your Pandit application was rejected.");
    }

    if (existingUser.status === USER_STATUS.BLOCKED) {
      throw new Error("Your account has been blocked.");
    }

    if (existingUser.status !== USER_STATUS.ACTIVE) {
      throw new Error("Your account is not active.");
    }

    const safeUser = getSafeUser(existingUser);

    localStorage.setItem(
      SESSION_KEY,
      JSON.stringify(safeUser)
    );

    setUser(safeUser);

    return {
      user: safeUser,
      redirectTo: getRedirectPath(safeUser),
    };
  }, []);

  // Logout
  const logout = useCallback(() => {
    localStorage.removeItem(SESSION_KEY);
    setUser(null);
  }, []);

  // Refresh session from localStorage
  const refreshUser = useCallback(() => {
    const savedUser = readJSON(SESSION_KEY, null);
    setUser(savedUser);
    return savedUser;
  }, []);

  const value = {
    user,
    role: user?.role || null,
    status: user?.status || null,
    loading,
    isAuthenticated: Boolean(user),
    register,
    login,
    logout,
    refreshUser,
    getRedirectPath,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export { AuthContext };
