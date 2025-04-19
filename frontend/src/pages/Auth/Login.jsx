import React, { useContext, useState } from "react";
import AuthLayout from "../../components/layouts/AuthLayout";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { AppContext } from "../../context/AppContext";
import { toast } from "react-toastify";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { backendUrl, updateUser } = useContext(AppContext);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(backendUrl + "/api/v1/auth/login", {
        email,
        password,
      });
      const { token, user } = response.data;
      console.log(response.data);
      if (token) {
        localStorage.setItem("token", token);
        updateUser(user);
        navigate("/dashboard");
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };
  return (
    <AuthLayout>
      <div className="lg:w-[80%] h-3/4 md:h-full flex flex-col justify-center text-primary">
        <h3 className="text-4xl font-semibold text-purple-500">
          Welcome Back !
        </h3>
        <p className="text-xl text-primary mt-[5px] mb-6">
          Please enter your details to log in.
        </p>

        <form onSubmit={handleLogin}>
          <p className="text-primary text-lg font-semibold">Email Address</p>
          <input
            className=" text-white rounded-lg w-full flex jusitfy-between text-lg px-4 py-3 mb-4 mt-3 border border-gray-500 "
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="johdoe@gmail.com"
            type="text"
          />
          <p className="text-primary text-lg font-semibold">Password</p>
          <input
            className=" text-white rounded-lg w-full flex jusitfy-between text-lg px-4 py-3 mb-4 mt-3 border border-gray-500 "
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="ABC123"
            type="password"
          />

          <button
            className="w-full text-md font-medium bg-purple-500 p-[10px] rounded-md my-3 hover:scale-105 transition-all"
            type="submit"
          >
            LOGIN
          </button>
          <p>
            Don't have an account? {"  "}
            <Link
              to={"/signup"}
              className="font-medium text-purple-500 underline"
            >
              SignUp
            </Link>
          </p>
        </form>
      </div>
    </AuthLayout>
  );
};

export default Login;
