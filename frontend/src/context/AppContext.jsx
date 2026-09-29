import { createContext, useEffect, useState, useCallback } from "react";
import { toast } from "react-toastify";
import API from "../utils/api";

export const AppContext = createContext();

const getInitialToken = () => {
  const t = localStorage.getItem("token");
  return t && t !== "null" && t !== "undefined" && t !== "false" ? t : null;
};

const AppContextProvider = (props) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(getInitialToken);

  //Updating user data
  const updateUser = (userData) => {
    setUser(userData);
  };

  //clearing user data
  const clearUser = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
  };

  //loading user data
  const loadUserData = useCallback(async () => {
    const activeToken = localStorage.getItem("token");
    if (!activeToken || activeToken === "null" || activeToken === "undefined" || activeToken === "false") {
      setUser(null);
      setToken(null);
      return;
    }
    try {
      const { data } = await API.get("/api/v1/auth/getUser");
      if (data?.success && data?.user) {
        setUser(data.user);
      } else {
        clearUser();
      }
    } catch (error) {
      // Stale or invalid token - silently clear authentication state
      clearUser();
    }
  }, []);

  const values = {
    backendUrl,
    token,
    setToken,
    user,
    setUser,
    updateUser,
    clearUser,
    loadUserData,
  };

  useEffect(() => {
    if (token) {
      loadUserData();
    } else {
      setUser(null);
    }
  }, [token, loadUserData]);

  return (
    <AppContext.Provider value={values}>{props.children}</AppContext.Provider>
  );
};

export default AppContextProvider;
