import React from "react";
import { Link } from "react-router-dom";

const Landing = () => {
  return (
    <div className=" min-h-screen flex flex-col bg-neutral-900 ">
      {/* Hero Section */}
      <section className="flex flex-col md:flex-row items-center justify-between px-10 py-20">
        <div className="md:w-1/2 space-y-6">
          <h2 className="text-5xl font-extrabold text-gray-100 leading-tight">
            Track Your <span className="text-blue-600">Expenses</span> <br />{" "}
            with Ease
          </h2>
          <p className="text-lg text-gray-200">
            Manage your income, monitor spending, and gain insights with
            powerful analytics. Stay on top of your finances anywhere, anytime.
          </p>
          <div className="flex space-x-4">
            <Link
              to="/login"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 text-lg rounded-lg"
            >
              Login
            </Link>
            <Link
              to="/dashboard"
              className="border border-gray-300 hover:bg-gray-100 text-gray-200 hover:text-black px-6 py-3 text-lg rounded-lg"
            >
              Already Logged In?
            </Link>
          </div>
        </div>

        <div className="md:w-1/2 mt-10 md:mt-0 flex justify-center">
          <img
            src="https://cdni.iconscout.com/illustration/premium/thumb/expense-management-illustration-svg-png-download-7740766.png"
            alt="Expense Tracker Dashboard"
            className="w-3/4 rounded-4xl "
          />
        </div>
      </section>

      {/* Features */}
      <section className="px-10 py-16 bg-neutral-900">
        <h3 className="text-3xl font-bold text-gray-100 text-center mb-10">
          Why Choose EazyTrack
        </h3>
        <div className="grid md:grid-cols-4 gap-6">
          <div className="bg-neutral-800 p-6 rounded-xl shadow hover:shadow-lg transition">
            <div className="text-blue-600 text-4xl mb-3">💳</div>
            <h4 className="font-semibold text-gray-100">Easy Transactions</h4>
            <p className="text-sm text-gray-300">
              Add income and expenses in just a few clicks.
            </p>
          </div>
          <div className="bg-neutral-800 p-6 rounded-xl shadow hover:shadow-lg transition">
            <div className="text-green-600 text-4xl mb-3">📊</div>
            <h4 className="font-semibold text-gray-100">Smart Analytics</h4>
            <p className="text-sm text-gray-300">
              Visualize spending habits with charts & insights.
            </p>
          </div>
          <div className="bg-neutral-800 p-6 rounded-xl shadow hover:shadow-lg transition">
            <div className="text-purple-600 text-4xl mb-3">📈</div>
            <h4 className="font-semibold text-gray-100">Detailed Reports</h4>
            <p className="text-sm text-gray-300">
              Generate expense reports to track progress.
            </p>
          </div>
          <div className="bg-neutral-800 p-6 rounded-xl shadow hover:shadow-lg transition">
            <div className="text-red-600 text-4xl mb-3">🔒</div>
            <h4 className="text-gray-100 font-semibold">Secure & Reliable</h4>
            <p className="text-sm text-gray-300">
              Your data is safe with enterprise-grade security.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-10 py-20 text-center bg-neutral-900">
        <h3 className="text-4xl font-bold mb-6 text-gray-100">
          Ready to Take Control of Your Finances?
        </h3>
        <p className="text-gray-300 mb-8">
          Join thousands of users who trust EazyTrack for smarter money
          management.
        </p>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg rounded-lg">
          Get Started Free
        </button>
      </section>

      {/* Footer */}
      <footer className="px-10 py-6 bg-neutral-950 text-gray-400 text-center">
        <p>© {new Date().getFullYear()} EazyTrack. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Landing;
