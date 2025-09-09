import React, { useContext, useEffect, useState } from "react";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import { useUserAuth } from "../../hooks/useUserAuth";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AppContext } from "../../context/AppContext";
import { IoMdCard } from "react-icons/io";
import { LuHandCoins, LuWalletMinimal } from "react-icons/lu";
import InfoCard from "../../components/cards/InfoCard";
import RecentTransactions from "../../components/dashboard/RecentTransactions";

import ExpenseTransactions from "../../components/dashboard/ExpenseTransactions";
import RecentIncome from "../../components/dashboard/RecentIncome";
import LineChartFromTransactions from "../../components/dashboard/LineChartFromTransactions";

const Home = () => {
  useUserAuth();
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(false);
  const { backendUrl } = useContext(AppContext);
  const fetchDashboardData = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const res = await axios.get(backendUrl + "/api/v1/dashboard", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (res.data) {
        setDashboardData(res.data);
      }
    } catch (error) {
      console.log("Error", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchDashboardData();
    return () => {};
  }, []);
  return (
    <DashboardLayout activeMenu="Dashboard">
      <div className="my-3 mx-auto">
        <div className="grid grid-cols-1  md:grid-cols-2  gap-4 ">
          <div className="card grid grid-cols-1 bg-linear-to-r via-indigo-400 from-purple-400 to-violet-600 text-primary border-gray-400 gap-2">
            <InfoCard
              icon={<IoMdCard />}
              label="Total Balance"
              value={dashboardData?.totalBalance || 0}
              color="bg-fuchsia-800"
            />
            <InfoCard
              icon={<LuWalletMinimal />}
              label="Total Income"
              value={dashboardData?.totalIncome || 0}
              color="bg-fuchsia-800"
            />
            <InfoCard
              icon={<LuHandCoins />}
              label="Total Expense"
              value={dashboardData?.totalExpenses || 0}
              color="bg-fuchsia-800"
            />
          </div>
          <RecentTransactions
            transactions={dashboardData?.recentTransactions}
            onSeeMore={() => navigate("/expense")}
          />

          <ExpenseTransactions
            transactions={dashboardData?.last30DaysExpenses?.transactions || []}
            onSeeMore={() => navigate("/expense")}
          />
          <RecentIncome
            transactions={dashboardData?.last60DaysIncome?.transactions || []}
            onSeeMore={() => navigate("/income")}
          />
        </div>
        <div className="py-6">
          <LineChartFromTransactions
            transactions={dashboardData?.allTransactions}
          />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Home;
