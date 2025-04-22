import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../../context/AppContext";
import axios from "axios";

const DashboardLayout = ({ activeMenu, children }) => {
  const [user, setUser] = useState(null);
  const { backendUrl } = useContext(AppContext);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await axios.get(backendUrl + "/api/v1/auth/getUser", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.data.success) {
          setUser(res.data.userData);
        }
      } catch (err) {
        console.log("Error fetching user:", err);
      }
    };

    fetchUser();
  }, []);

  return (
    <div className="text-primary mx-6">
      <h2 className="text-primary text-2xl sm:text-3xl md:text-4xl lg:text-5xl py-6 md:py-8  font-bold">
        {activeMenu === "Dashboard" && (
          <>Hi{user?.name ? ` ${user.name} !` : " User !"}</>
        )}
      </h2>
      {children}
    </div>
  );
};

export default DashboardLayout;
