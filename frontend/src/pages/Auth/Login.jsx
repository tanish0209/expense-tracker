import React, { useContext, useState } from "react";
import AuthLayout from "../../components/layouts/AuthLayout";
import { Link, useNavigate } from "react-router-dom";
import API from "../../utils/api";
import { AppContext } from "../../context/AppContext";
import { toast } from "react-toastify";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { setToken, updateUser } = useContext(AppContext);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await API.post("/api/v1/auth/login", {
        email,
        password,
      });
      const { token, user, message, success } = response.data;
      if (success && token) {
        localStorage.setItem("token", token);
        if (setToken) setToken(token);
        updateUser(user);
        toast.success("Login Successful!");
        navigate("/dashboard");
      } else {
        toast.error(message || "Login failed");
      }
    } catch (error) {
      console.error("Login Error:", error);
      toast.error(error.response?.data?.message || error.message || "Network Error: Server connection refused");
    }
  };
  return (
    <AuthLayout>
      <div className="w-full max-w-md mx-auto flex flex-col justify-center text-gray-200">
        <h3 className="text-purple-400 text-xl md:text-2xl font-bold tracking-tight">
          Welcome Back!
        </h3>
        <p className="text-sm text-gray-400 mt-1 mb-6">
          Please enter your details to log in.
        </p>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-300 mb-1">
              Email Address
            </label>
            <input
              className="w-full bg-neutral-900 border border-neutral-700 rounded-lg text-sm text-white px-3 py-2.5 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all placeholder:text-neutral-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="johndoe@gmail.com"
              type="email"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-300 mb-1">
              Password
            </label>
            <input
              className="w-full bg-neutral-900 border border-neutral-700 rounded-lg text-sm text-white px-3 py-2.5 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all placeholder:text-neutral-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              type="password"
              required
            />
          </div>

          <button
            className="w-full text-sm font-semibold bg-indigo-600 hover:bg-indigo-500 text-white py-2.5 rounded-lg transition-all shadow-md cursor-pointer mt-2"
            type="submit"
          >
            LOGIN
          </button>
          <p className="text-xs text-gray-400 text-center pt-2">
            Don't have an account?{" "}
            <Link
              to={"/signup"}
              className="font-semibold text-indigo-400 hover:underline"
            >
              Sign Up
            </Link>
          </p>
        </form>
      </div>
    </AuthLayout>
  );
};

export default Login;
