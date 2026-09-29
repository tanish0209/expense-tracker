import React, { useContext, useEffect } from "react";
import DashboardLayout from "../components/layouts/DashboardLayout";
import userimage from "../assets/userimage.png";
import { AppContext } from "../context/AppContext";
import API from "../utils/api";

const MyProfile = () => {
  const { user, setUser } = useContext(AppContext);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await API.get("/api/v1/auth/getUser");
        if (res.data?.success && res.data?.user) {
          setUser(res.data.user);
        }
      } catch (err) {
        console.error("Error fetching user profile:", err);
      }
    };

    fetchUser();
  }, [setUser]);

  return (
    <DashboardLayout activeMenu="My Profile">
      <div className="bg-neutral-800/80 border border-neutral-700/80 rounded-2xl p-6 shadow-xl max-w-2xl mx-auto my-8 backdrop-blur-xl text-white">
        <h2 className="text-2xl font-bold border-b border-neutral-700/60 pb-4 mb-6">User Profile</h2>
        <div className="flex flex-col items-center gap-6">
          <img
            src={userimage}
            className="rounded-full w-24 h-24 border-2 border-purple-500/50 p-1 object-cover shadow-lg"
            alt="User Avatar"
          />
          <div className="w-full space-y-4">
            <div className="bg-neutral-900/60 border border-neutral-700/60 rounded-xl p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
              <span className="text-sm font-semibold text-gray-400">Full Name</span>
              <span className="text-lg font-bold text-white">{user?.name || "N/A"}</span>
            </div>
            <div className="bg-neutral-900/60 border border-neutral-700/60 rounded-xl p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
              <span className="text-sm font-semibold text-gray-400">Email Address</span>
              <span className="text-lg font-bold text-white">{user?.email || "N/A"}</span>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default MyProfile;
