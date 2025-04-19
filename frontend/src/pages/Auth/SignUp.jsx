import React, { useContext, useState } from "react";
import AuthLayout from "../../components/layouts/AuthLayout";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { AppContext } from "../../context/AppContext";
import { toast } from "react-toastify";
const SignUp = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { backendUrl, updateUser } = useContext(AppContext);
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(backendUrl + "/api/v1/auth/register", {
        email,
        password,
        name,
      });
      const { token, user } = response.data;
      if (token) {
        localStorage.setItem("token", token);
        updateUser(user);
        navigate("/dashboard");
        toast.success("Account Created Successfully!");
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  return (
    <AuthLayout>
      <div className="lg:w-[80%] h-auto md:h-full mt-10 md:mt-0 flex flex-col justify-center text-primary">
        <h3 className="text-purple-500 text-4xl font-semibold ">Welcome!</h3>
        <p className="text-xl text-primary mt-[5px] mb-6">
          Create an Account and Join Us Today!
        </p>

        <form onSubmit={handleSignup}>
          <div className="grid grid-cols-1 gap-4">
            <div>
              <p className="text-primary text-lg font-semibold">Enter Name</p>
              <input
                className=" text-white rounded-lg w-full flex jusitfy-between text-lg px-4 py-3 mb-4 mt-3 border border-gray-500 "
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                type="text"
              />
            </div>
            <div>
              <p className="text-primary text-lg font-semibold">
                Email Address
              </p>
              <input
                className=" text-white rounded-lg w-full flex jusitfy-between text-lg px-4 py-3 mb-4 mt-3 border border-gray-500 "
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="johndoe@gmail.com"
                type="text"
              />
            </div>
            <div>
              <p className="text-primary text-lg font-semibold">
                Enter Pasword
              </p>
              <input
                className=" text-white rounded-lg w-full flex jusitfy-between text-lg px-4 py-3 mb-4 mt-3 border border-gray-500 "
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="ABC123"
                type="password"
              />
            </div>
            <button
              className="w-full text-md font-medium bg-purple-500 p-[10px] rounded-md my-3 hover:scale-105 transition-all"
              type="submit"
            >
              SIGNUP
            </button>
            <p className="text-primary">
              Already have an account? {"  "}
              <Link
                to={"/login"}
                className="font-medium text-purple-500 underline"
              >
                Login
              </Link>
            </p>
          </div>
        </form>
      </div>
    </AuthLayout>
  );
};

export default SignUp;
