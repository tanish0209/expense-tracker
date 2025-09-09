import axios from "axios";
import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";

export const AppContext = createContext();
const AppContextProvider = (props) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(
    localStorage.getItem("token") ? localStorage.getItem("token") : false
  );

  //Updating user data
  const updateUser = (userData) => {
    setUser(userData);
  };

  //clearing user data
  const clearUser = () => {
    setUser(null);
  };

  //loading user data
  const loadUserData = async () => {
    try {
      const { data } = await axios.get(backendUrl + "/api/v1/auth/getUser", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (data.success) {
        setUser(data.user);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };
  const values = {
    backendUrl,
    token,
    setToken,
    user,
    updateUser,
    clearUser,
  };
  useEffect(() => {
    if (token) {
      loadUserData();
    } else {
      setUser(null);
    }
  }, [token]);

  return (
    <AppContext.Provider value={values}>{props.children}</AppContext.Provider>
  );
};
export default AppContextProvider;
