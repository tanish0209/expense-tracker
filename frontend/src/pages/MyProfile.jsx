import React, { useContext, useEffect } from "react";
import DashboardLayout from "../components/layouts/DashboardLayout";
import userimage from "../assets/userimage.png";
import { AppContext } from "../context/AppContext";
import axios from "axios";

const MyProfile = () => {
  const { user, backendUrl, setUser } = useContext(AppContext);
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
    <DashboardLayout>
      <div className="card m-5 w-96 md:w-2xl lg:w-4xl place-self-center">
        <h2 className="text-2xl font-bold">User Information</h2>
        <div className="flex-col justify-center items-center place-self-center">
          <div className="flex justify-center items-center ">
            <img
              src={userimage}
              className="rounded-full items-center w-20 h-20 border p-1 m-8"
              alt=""
            />
          </div>
          <div className="flex gap-3 border border-gray-200 w-80 md:w-xl max-w-2xl py-5 px-2 lg:px-7 lg:m-3 m-1 rounded-2xl">
            <h3 className="text-lg lg:text-2xl font-bold">User Name:</h3>
            <p className="text-lg lg:text-2xl font-semibold">{user.name}</p>
          </div>
          <div className="border border-gray-200 w-80 md:w-xl max-w-2xl py-5 px-2 lg:p-7 lg:m-3 m-1 rounded-2xl flex gap-3">
            <h3 className="text-md lg:text-2xl font-bold">User Mail ID:</h3>
            <p className="text-md lg:text-2xl font-semibold">{user.email}</p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default MyProfile;
