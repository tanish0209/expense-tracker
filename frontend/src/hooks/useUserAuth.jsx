import { useContext, useEffect } from "react";
import { AppContext } from "../context/AppContext";
import { useNavigate } from "react-router-dom";
import API from "../utils/api";

export const useUserAuth = () => {
  const { user, updateUser, clearUser } = useContext(AppContext);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token || token === "null" || token === "undefined" || token === "false") {
      clearUser();
      navigate("/login");
      return;
    }

    if (user) return;

    let isMounted = true;
    const fetchUserInfo = async () => {
      try {
        const response = await API.get("/api/v1/auth/getUser");
        if (isMounted && response.data?.success && response.data?.user) {
          updateUser(response.data.user);
        }
      } catch (error) {
        if (isMounted) {
          clearUser();
          navigate("/login");
        }
      }
    };

    fetchUserInfo();

    return () => {
      isMounted = false;
    };
  }, [user, updateUser, clearUser, navigate]);
};
