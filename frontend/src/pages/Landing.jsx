import React from "react";
import { Link } from "react-router-dom";

const Landing = () => {
  return (
    <div className="min-h-screen flex flex-col bg-neutral-900 text-white">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto w-full flex flex-col md:flex-row items-center justify-between px-6 md:px-12 pt-24 pb-12 gap-8">
        <div className="md:w-1/2 space-y-4">
          <h2 className="text-xl md:text-2xl font-bold text-gray-100 leading-tight">
            Track Your <span className="text-indigo-500">Expenses</span> with Ease
          </h2>
          <p className="text-sm text-gray-300">
            Manage your income, monitor spending, and gain insights with
            powerful analytics. Stay on top of your finances anywhere, anytime.
          </p>
          <div className="flex items-center gap-3 pt-2">
            <Link
              to="/login"
              className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 text-sm font-semibold rounded-lg shadow-md transition-all"
            >
              Login
            </Link>
            <Link
              to="/dashboard"
              className="border border-neutral-700 hover:bg-neutral-800 text-gray-300 px-4 py-2 text-sm font-semibold rounded-lg transition-all"
            >
              Dashboard
            </Link>
          </div>
        </div>

        <div className="md:w-1/2 flex justify-center">
          <img
            src="https://cdni.iconscout.com/illustration/premium/thumb/expense-management-illustration-svg-png-download-7740766.png"
            alt="Expense Tracker Dashboard"
            className="w-full max-w-sm rounded-2xl shadow-xl"
          />
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto w-full px-6 md:px-12 py-10">
        <h3 className="text-lg md:text-xl font-bold text-gray-100 text-center mb-8">
          Why Choose EazyTrack
        </h3>
        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-neutral-800/80 border border-neutral-700/60 p-5 rounded-xl shadow-md">
            <div className="text-indigo-400 text-2xl mb-2">💳</div>
            <h4 className="text-sm font-bold text-gray-100">Easy Transactions</h4>
            <p className="text-xs text-gray-400 mt-1">
              Add income and expenses in just a few clicks.
            </p>
          </div>
          <div className="bg-neutral-800/80 border border-neutral-700/60 p-5 rounded-xl shadow-md">
            <div className="text-emerald-400 text-2xl mb-2">📊</div>
            <h4 className="text-sm font-bold text-gray-100">Smart Analytics</h4>
            <p className="text-xs text-gray-400 mt-1">
              Visualize spending habits with charts & insights.
            </p>
          </div>
          <div className="bg-neutral-800/80 border border-neutral-700/60 p-5 rounded-xl shadow-md">
            <div className="text-purple-400 text-2xl mb-2">📈</div>
            <h4 className="text-sm font-bold text-gray-100">Detailed Reports</h4>
            <p className="text-xs text-gray-400 mt-1">
              Generate expense reports to track progress.
            </p>
          </div>
          <div className="bg-neutral-800/80 border border-neutral-700/60 p-5 rounded-xl shadow-md">
            <div className="text-rose-400 text-2xl mb-2">🔒</div>
            <h4 className="text-sm font-bold text-gray-100">Secure & Reliable</h4>
            <p className="text-xs text-gray-400 mt-1">
              Your data is safe with enterprise-grade security.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 py-12 text-center bg-neutral-950/50 border-t border-neutral-800 mt-auto">
        <h3 className="text-lg md:text-xl font-bold mb-2 text-gray-100">
          Ready to Take Control of Your Finances?
        </h3>
        <p className="text-xs text-gray-400 mb-6 max-w-md mx-auto">
          Join thousands of users who trust EazyTrack for smarter money management.
        </p>
        <Link
          to="/signup"
          className="inline-block bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2.5 text-sm font-semibold rounded-lg shadow-lg transition-all"
        >
          Get Started Free
        </Link>
      </section>

      {/* Footer */}
      <footer className="px-6 py-4 bg-neutral-950 text-gray-500 text-xs text-center border-t border-neutral-900">
        <p>© {new Date().getFullYear()} EazyTrack. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Landing;
