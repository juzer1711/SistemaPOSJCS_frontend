import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { AUTH_TOKEN_KEY } from "../api/apiClient.js";
import { getCurrentSession, loginRequest, logoutRequest } from "../modules/auth/services/authApi.js";

const AuthContext = createContext(null);

const clearStoredSession = () => {
  globalThis.sessionStorage?.removeItem(AUTH_TOKEN_KEY);
  globalThis.localStorage?.removeItem("username");
  globalThis.localStorage?.removeItem("id_usuario");
  globalThis.localStorage?.removeItem("role");
};

const storeUserMetadata = (user) => {
  if (user?.username) {
    globalThis.localStorage?.setItem("username", user.username);
  }
  if (user?.idUsuario != null) {
    globalThis.localStorage?.setItem("id_usuario", String(user.idUsuario));
  }
  globalThis.localStorage?.removeItem("role");
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [status, setStatus] = useState("checking");

  const acceptSession = useCallback((sessionUser) => {
    const identity = {
      idUsuario: sessionUser.idUsuario,
      username: sessionUser.username,
    };
    setUser(identity);
    storeUserMetadata(identity);
    setStatus("authenticated");
  }, []);

  const clearSession = useCallback(() => {
    clearStoredSession();
    setUser(null);
    setStatus("unauthenticated");
  }, []);

  const login = useCallback(async (username, password) => {
    const response = await loginRequest({ username, password });
    globalThis.sessionStorage?.setItem(AUTH_TOKEN_KEY, response.token);
    acceptSession(response);
    return response;
  }, [acceptSession]);

  const logout = useCallback(async () => {
    try {
      if (globalThis.sessionStorage?.getItem(AUTH_TOKEN_KEY)) {
        await logoutRequest();
      }
    } finally {
      clearSession();
    }
  }, [clearSession]);

  const refreshSession = useCallback(async () => {
    if (!globalThis.sessionStorage?.getItem(AUTH_TOKEN_KEY)) {
      clearSession();
      return null;
    }

    setStatus("checking");
    try {
      const session = await getCurrentSession();
      acceptSession(session);
      return session;
    } catch (error) {
      if (error.response?.status === 401) {
        clearSession();
      } else {
        setStatus("error");
      }
      return null;
    }
  }, [acceptSession, clearSession]);

  useEffect(() => {
    const handleUnauthorized = () => clearSession();
    globalThis.addEventListener?.("auth:unauthorized", handleUnauthorized);
    let active = true;

    if (!globalThis.sessionStorage?.getItem(AUTH_TOKEN_KEY)) {
      setStatus("unauthenticated");
      return () => {
        active = false;
        globalThis.removeEventListener?.("auth:unauthorized", handleUnauthorized);
      };
    }

    getCurrentSession()
      .then((session) => {
        if (active) {
          acceptSession(session);
        }
      })
      .catch((error) => {
        if (!active) return;
        if (error.response?.status === 401) {
          clearSession();
        } else {
          setStatus("error");
        }
      });

    return () => {
      active = false;
      globalThis.removeEventListener?.("auth:unauthorized", handleUnauthorized);
    };
  }, [acceptSession, clearSession]);

  const value = useMemo(() => ({
    user,
    status,
    login,
    logout,
    refreshSession,
  }), [user, status, login, logout, refreshSession]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
