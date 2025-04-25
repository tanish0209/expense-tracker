import React, { useContext } from "react";
import { AppContext } from "../../context/AppContext";

const DashboardLayout = ({ activeMenu, children }) => {
  const { user } = useContext(AppContext);

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
