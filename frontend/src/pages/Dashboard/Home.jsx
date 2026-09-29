import React, { useEffect, useState, useCallback } from "react";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import { useUserAuth } from "../../hooks/useUserAuth";
import { useNavigate } from "react-router-dom";
import API from "../../utils/api";
import { IoMdCard } from "react-icons/io";
import { LuHandCoins, LuWalletMinimal } from "react-icons/lu";
import InfoCard from "../../components/cards/InfoCard";
import RecentTransactions from "../../components/dashboard/RecentTransactions";
import ExpenseTransactions from "../../components/dashboard/ExpenseTransactions";
import RecentIncome from "../../components/dashboard/RecentIncome";
import LineChartFromTransactions from "../../components/dashboard/LineChartFromTransactions";
import { SkeletonCard, SkeletonChart, SkeletonList } from "../../components/SkeletonLoader";

const Home = () => {
  useUserAuth();
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      const res = await API.get("/api/v1/dashboard");
      if (res.data?.success) {
        setDashboardData(res.data);
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  if (loading) {
    return (
      <DashboardLayout activeMenu="Dashboard">
        <div className="my-5 mx-auto max-w-7xl space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <SkeletonList />
            <SkeletonList />
          </div>
          <SkeletonChart />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout activeMenu="Dashboard">
      <div className="my-3 mx-auto max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="card grid grid-cols-1 bg-gradient-to-r via-indigo-500 from-purple-500 to-violet-600 text-white rounded-2xl p-4 md:p-6 shadow-xl gap-4">
            <InfoCard
              icon={<IoMdCard className="text-2xl" />}
              label="Total Balance"
              value={dashboardData?.totalBalance || 0}
              color="bg-fuchsia-800/80"
            />
            <InfoCard
              icon={<LuWalletMinimal className="text-2xl" />}
              label="Total Income"
              value={dashboardData?.totalIncome || 0}
              color="bg-emerald-800/80"
            />
            <InfoCard
              icon={<LuHandCoins className="text-2xl" />}
              label="Total Expense"
              value={dashboardData?.totalExpenses || 0}
              color="bg-rose-800/80"
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
