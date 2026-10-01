import React, { useState } from "react";
import {
  LuHandCoins,
  LuWalletMinimal,
  LuPlus,
  LuEye,
  LuEyeOff,
  LuLandmark,
  LuWallet,
  LuCreditCard,
  LuBanknote,
  LuBriefcase,
  LuCoins,
} from "react-icons/lu";
import { useNavigate } from "react-router-dom";

const formatCurrency = (val) => {
  return Number(val || 0).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

const isLiquidAccount = (acc) => {
  const type = (acc.type || "").toLowerCase();
  const name = (acc.name || "").toLowerCase();
  const isLiquid =
    type === "cash" ||
    type === "wallet" ||
    type === "salary" ||
    type === "checking" ||
    name.includes("cash") ||
    name.includes("salary") ||
    name.includes("wallet") ||
    name.includes("checking");
  const isExcluded =
    (type === "savings" && !name.includes("salary")) ||
    type === "credit" ||
    type === "crypto" ||
    type === "investment";

  return isLiquid && !isExcluded;
};

const getOutlineIconForAccount = (acc) => {
  const type = (acc.type || "").toLowerCase();
  const name = (acc.name || "").toLowerCase();

  if (name.includes("salary") || type === "salary") {
    return <LuBriefcase className="text-white text-base sm:text-lg" />;
  }
  if (type === "cash" || name.includes("cash")) {
    return <LuBanknote className="text-white text-base sm:text-lg" />;
  }
  if (type === "wallet" || name.includes("wallet")) {
    return <LuWallet className="text-white text-base sm:text-lg" />;
  }
  if (type === "credit" || name.includes("credit") || name.includes("card")) {
    return <LuCreditCard className="text-white text-base sm:text-lg" />;
  }
  if (type === "crypto" || type === "web3") {
    return <LuCoins className="text-white text-base sm:text-lg" />;
  }
  return <LuLandmark className="text-white text-base sm:text-lg" />;
};

export const SingleInfoCard = ({
  icon,
  label,
  value,
  subtitle,
  color = "bg-neutral-800/80",
  colSpan = "w-full",
  totalCardsCount = 1,
  badge,
  forcedVisibility = null,
  isTwoColCard = false,
}) => {
  const [isSelfVisible, setIsSelfVisible] = useState(false);

  // Default hidden for privacy unless user reveals
  const isVisible = forcedVisibility !== null ? forcedVisibility : isSelfVisible;

  const isWideCard = isTwoColCard || colSpan.includes("col-span-2");
  const isMany = totalCardsCount > 4;
  const isModerate = totalCardsCount >= 3;

  const styles = {
    padding: isWideCard
      ? "p-3 sm:p-4"
      : isMany
      ? "p-2 sm:p-2.5"
      : isModerate
      ? "p-2.5 sm:p-3"
      : "p-3 sm:p-3.5",
    iconContainer: isWideCard
      ? "w-8 h-8 sm:w-9 sm:h-9 text-base sm:text-lg"
      : isMany
      ? "w-7 h-7 sm:w-8 sm:h-8 text-xs sm:text-sm"
      : "w-7.5 h-7.5 sm:w-8 sm:h-8 text-xs sm:text-sm",
    titleFont: isWideCard
      ? "text-xs sm:text-xs md:text-sm font-semibold"
      : isMany
      ? "text-[10px] sm:text-[11px] font-semibold"
      : "text-[10.5px] sm:text-xs font-semibold",
    subtitleFont: isWideCard
      ? "text-[10px] sm:text-[11px]"
      : isMany
      ? "text-[9px] sm:text-[9.5px]"
      : "text-[9.5px] sm:text-[10px]",
    valueFont: isWideCard
      ? "text-base sm:text-lg md:text-xl font-extrabold"
      : isMany
      ? "text-xs sm:text-sm font-bold"
      : isModerate
      ? "text-xs sm:text-base font-bold"
      : "text-sm sm:text-lg font-bold",
  };

  // Helper to format subtext to clean camel / title case
  const formatSubtext = (str) => {
    if (!str) return "";
    if (str.toUpperCase() === str && str.length > 1) {
      return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    }
    return str;
  };

  return (
    <div
      className={`${colSpan} relative flex items-center justify-between gap-2 ${color} backdrop-blur-md ${styles.padding} rounded-xl border border-white/10 shadow-md transition-all duration-200 hover:border-white/20 overflow-hidden w-full group`}
    >
      <div className="flex items-center gap-2.5 sm:gap-3 overflow-hidden w-full pr-7 sm:pr-8">
        {/* Outline icon container in pure white */}
        <div
          className={`${styles.iconContainer} flex items-center justify-center text-white bg-white/10 border border-white/15 rounded-xl shrink-0 shadow-sm`}
        >
          {icon}
        </div>

        {/* 2-Column cards on desktop: Heading block on left, Amount on right in SAME ROW */}
        {isWideCard ? (
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between overflow-hidden min-w-0 w-full gap-1">
            <div className="flex flex-col overflow-hidden min-w-0">
              <div className="flex items-center gap-1.5 overflow-hidden">
                <h6
                  className={`${styles.titleFont} text-gray-100 tracking-wide truncate`}
                >
                  {label}
                </h6>
                {badge && (
                  <span className="text-[8.5px] sm:text-[9px] px-1.5 py-0.5 rounded bg-white/15 text-gray-200 font-medium tracking-normal shrink-0">
                    {formatSubtext(badge)}
                  </span>
                )}
              </div>
              {subtitle && (
                <p
                  className={`${styles.subtitleFont} text-gray-300/80 font-normal tracking-normal truncate mt-0.5`}
                >
                  {formatSubtext(subtitle)}
                </p>
              )}
            </div>

            <span
              className={`${styles.valueFont} text-white tracking-tight truncate shrink-0 sm:text-right mt-0.5 sm:mt-0`}
            >
              {isVisible ? `₹ ${formatCurrency(value)}` : "₹ ••••••"}
            </span>
          </div>
        ) : (
          /* 1-Column cards: Standard vertical stack */
          <div className="flex flex-col overflow-hidden min-w-0 w-full pr-2">
            <div className="flex items-center gap-1.5 overflow-hidden">
              <h6
                className={`${styles.titleFont} text-gray-100 tracking-wide truncate`}
              >
                {label}
              </h6>
              {badge && (
                <span className="text-[8.5px] sm:text-[9px] px-1.5 py-0.5 rounded bg-white/15 text-gray-200 font-medium tracking-normal shrink-0">
                  {formatSubtext(badge)}
                </span>
              )}
            </div>
            {subtitle && (
              <p
                className={`${styles.subtitleFont} text-gray-300/80 font-normal tracking-normal truncate mt-0.5`}
              >
                {formatSubtext(subtitle)}
              </p>
            )}
            <span
              className={`${styles.valueFont} text-white mt-1 tracking-tight truncate`}
            >
              {isVisible ? `₹ ${formatCurrency(value)}` : "₹ ••••••"}
            </span>
          </div>
        )}
      </div>

      {/* Top-Right Privacy Eye Toggle Button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          setIsSelfVisible(!isSelfVisible);
        }}
        className="absolute top-2.5 right-2.5 text-white/50 hover:text-white transition-colors p-0.5 border border-white/50 rounded-full hover:bg-black/20 cursor-pointer z-10"
        title={isVisible ? "Hide value" : "Show value"}
      >
        {isVisible ? <LuEyeOff size={14} /> : <LuEye size={14} />}
      </button>
    </div>
  );
};

const InfoCard = ({
  dashboardData,
  totalBalance = 0,
  totalIncome = 0,
  totalExpenses = 0,
  accounts = [],
  icon,
  label,
  value,
  color,
}) => {
  const navigate = useNavigate();
  const [globalVisibility, setGlobalVisibility] = useState(null);

  // If used as standard single InfoCard prop
  if (label && value !== undefined && !dashboardData && accounts.length === 0) {
    return (
      <SingleInfoCard
        icon={icon}
        label={label}
        value={value}
        color={color}
        colSpan="w-full"
      />
    );
  }

  const incomeVal = dashboardData?.totalIncome ?? totalIncome;
  const expenseVal = dashboardData?.totalExpenses ?? totalExpenses;
  const userAccounts = dashboardData?.accounts || accounts || [];

  // Calculate Net Liquid Balance (Cash + Salary accounts only)
  const liquidAccounts = userAccounts.filter(isLiquidAccount);
  const calculatedLiquidBalance =
    liquidAccounts.length > 0
      ? liquidAccounts.reduce((sum, acc) => sum + Number(acc.balance || 0), 0)
      : dashboardData?.totalBalance ?? totalBalance;

  const totalAccountsCount = userAccounts.length;
  const isAccountsOdd = totalAccountsCount % 2 !== 0;

  const handleToggleGlobal = () => {
    setGlobalVisibility((prev) => (prev === true ? false : true));
  };

  return (
    <div className="flex flex-col gap-4 bg-gradient-to-r via-indigo-600/90 from-purple-600/90 to-violet-700/90 text-white rounded-2xl p-4 sm:p-5 shadow-xl border border-white/10 w-full">
      {/* 1. TOP CARD: Net Liquid Balance (2-column card on desktop) */}
      <SingleInfoCard
        icon={<LuWallet className="text-lg md:text-xl text-white" />}
        label="Total Balance"
        subtitle="Net Liquid Assets (Cash + Salary)"
        value={calculatedLiquidBalance}
        color="bg-fuchsia-950/60 border-fuchsia-400/40 text-fuchsia-100"
        colSpan="w-full"
        totalCardsCount={1}
        badge="Liquid"
        forcedVisibility={globalVisibility}
        isTwoColCard={true}
      />

      {/* 2. SECOND ROW: Income & Expense (1-column cards side-by-side) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
        <SingleInfoCard
          icon={<LuWalletMinimal className="text-lg md:text-xl text-white" />}
          label="Total Income"
          subtitle="All Earnings"
          value={incomeVal}
          color="bg-emerald-900/50 border-emerald-400/30"
          colSpan="w-full"
          totalCardsCount={2}
          forcedVisibility={globalVisibility}
          isTwoColCard={false}
        />
        <SingleInfoCard
          icon={<LuHandCoins className="text-lg md:text-xl text-white" />}
          label="Total Expense"
          subtitle="All Spendings"
          value={expenseVal}
          color="bg-rose-900/50 border-rose-400/30"
          colSpan="w-full"
          totalCardsCount={2}
          forcedVisibility={globalVisibility}
          isTwoColCard={false}
        />
      </div>

      {/* 3. THIRD SECTION: Accounts Breakdown Grid */}
      <div className="flex flex-col gap-2.5 pt-2 border-t border-white/15 w-full">
        <div className="flex justify-between items-center px-1">
          <span className="text-xs sm:text-sm font-bold text-gray-100 tracking-wide uppercase">
            Accounts Breakdown ({totalAccountsCount} {totalAccountsCount === 1 ? "Account" : "Accounts"})
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={handleToggleGlobal}
              className="flex items-center gap-1 text-[11px] sm:text-xs font-semibold text-indigo-200 hover:text-white transition-colors cursor-pointer bg-black/20 hover:bg-black/30 px-2 py-0.5 rounded-md"
              title={globalVisibility === true ? "Hide all values" : "Show all values"}
            >
              {globalVisibility === true ? <LuEyeOff size={12} /> : <LuEye size={12} />}
              {globalVisibility === true ? "Hide All" : "Reveal All"}
            </button>
            <button
              onClick={() => navigate("/accounts")}
              className="flex items-center gap-1 text-[11px] sm:text-xs font-semibold text-indigo-200 hover:text-white transition-colors cursor-pointer bg-black/20 hover:bg-black/30 px-2 py-0.5 rounded-md"
              title="Manage Accounts"
            >
              <LuPlus size={12} /> Manage
            </button>
          </div>
        </div>

        {/* 2-Column Accounts Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
          {userAccounts.map((acc, index) => {
            const isLiquid = isLiquidAccount(acc);
            const isWide = isAccountsOdd && index === 0;
            const colSpan = isWide ? "sm:col-span-2 w-full" : "w-full";

            return (
              <SingleInfoCard
                key={acc._id || acc.name || index}
                icon={getOutlineIconForAccount(acc)}
                label={acc.name}
                subtitle={acc.type || "Account"}
                value={acc.balance}
                color="bg-black/25 border-white/10 hover:bg-black/35"
                colSpan={colSpan}
                totalCardsCount={totalAccountsCount}
                badge={isLiquid ? "Liquid" : "Account"}
                forcedVisibility={globalVisibility}
                isTwoColCard={isWide}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default InfoCard;
