import { useContext, useEffect } from "react";
import { AppContext } from "../context/AppContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export const useUserAuth = () => {
  const { user, updateUser, clearUser, backendUrl } = useContext(AppContext);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  useEffect(() => {
    if (user) return;
    let isMounted = true;
    const fetchUserInfo = async () => {
      try {
        const response = await axios.get(backendUrl + "/api/v1/auth/getUser", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (isMounted && response.data) {
          updateUser(response.data);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchUserInfo();
    return () => {
      isMounted = false;
    };
  }, [updateUser, clearUser, backendUrl, navigate]);
};
