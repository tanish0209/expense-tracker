import React, { useContext, useState } from "react";
import AuthLayout from "../../components/layouts/AuthLayout";
import { Link, useNavigate } from "react-router-dom";
import API from "../../utils/api";
import { AppContext } from "../../context/AppContext";
import { toast } from "react-toastify";

const SignUp = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { setToken, updateUser } = useContext(AppContext);
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const response = await API.post("/api/v1/auth/register", {
        email,
        password,
        name,
      });
      const { token, user, success, message } = response.data;
      if (success && token) {
        localStorage.setItem("token", token);
        if (setToken) setToken(token);
        updateUser(user);
        toast.success("Account Created Successfully!");
        navigate("/dashboard");
      } else {
        toast.error(message || "Registration failed");
      }
    } catch (error) {
      console.error("Signup error:", error);
      toast.error(error.response?.data?.message || error.message || "Network Error: Server connection refused");
    }
  };

  return (
    <AuthLayout>
      <div className="w-full max-w-md mx-auto flex flex-col justify-center text-gray-200">
        <h3 className="text-purple-400 text-xl md:text-2xl font-bold tracking-tight">
          Welcome!
        </h3>
        <p className="text-sm text-gray-400 mt-1 mb-6">
          Create an Account and Join Us Today!
        </p>

        <form onSubmit={handleSignup}>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1">
                Enter Name
              </label>
              <input
                className="w-full bg-neutral-900 border border-neutral-700 rounded-lg text-sm text-white px-3 py-2.5 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all placeholder:text-neutral-500"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                type="text"
                required
              />
            </div>
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
                Enter Password
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
              SIGN UP
            </button>
            <p className="text-xs text-gray-400 text-center pt-2">
              Already have an account?{" "}
              <Link
                to={"/login"}
                className="font-semibold text-indigo-400 hover:underline"
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
