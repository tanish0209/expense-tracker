import React from "react";

const DashboardLayout = ({ children }) => {
  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 md:px-8 pt-4 md:pt-6 pb-6 md:pb-12 text-white">
      {children}
    </div>
  );
};

export default DashboardLayout;
