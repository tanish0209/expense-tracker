import React from "react";
import { LuArrowRight } from "react-icons/lu";
import moment from "moment";
import TransactionsInfoCard from "../cards/TransactionsInfoCard";

const RecentTransactions = ({ transactions, onSeeMore }) => {
  return (
    <div className="bg-neutral-800/80 border border-neutral-700/80 rounded-2xl p-3 sm:p-4 md:p-6 shadow-xl backdrop-blur-xl text-white">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-neutral-700/60 pb-4">
        <h5 className="text-base md:text-lg font-bold tracking-wide text-gray-100">Recent Transactions</h5>
        <button
          className="flex items-center gap-1.5 text-xs font-semibold text-gray-200 bg-neutral-700 hover:bg-neutral-600 px-3 py-1.5 rounded-lg transition-all cursor-pointer"
          onClick={onSeeMore}
        >
          See All <LuArrowRight className="text-sm" />
        </button>
      </div>

      {/* Table Header */}
      <div className="hidden sm:grid grid-cols-[5fr_3fr_4fr] py-3 px-4 border-b border-neutral-700 text-gray-400 bg-neutral-900/60 rounded-xl mt-3 text-xs font-semibold uppercase tracking-wider">
        <p>Name</p>
        <p className="text-center">Date</p>
        <p className="text-right">Amount</p>
      </div>

      {/* Transactions */}
      <div className="flex flex-col divide-y divide-neutral-700/50 mt-1">
        {(!transactions || transactions.length === 0) ? (
          <p className="text-center py-6 text-xs text-gray-400">No transactions recorded yet.</p>
        ) : (
          transactions.slice(0, 5).map((item, index) => (
            <div
              key={item._id || item.id || index}
              className="py-2.5 sm:py-3 px-2 sm:px-4 hover:bg-neutral-700/30 rounded-lg transition-all"
            >
              {/* Mobile View */}
              <div className="flex sm:hidden items-center justify-between gap-3">
                <div className="flex flex-col gap-0.5 min-w-0">
                  <TransactionsInfoCard
                    title={item.type === "expense" ? item.category : item.source}
                    icon={item.icon}
                    type={item.type}
                    amount={item.amount}
                    hideDeleteBtn
                    compact
                  />
                  <p className="text-[11px] text-gray-400 font-medium pl-1">
                    {moment(item.date).format("Do MMM YYYY")}
                  </p>
                </div>
                <div className="shrink-0 text-right">
                  <p
                    className={`font-semibold px-2.5 py-1 text-xs rounded-lg whitespace-nowrap ${
                      item.type === "expense"
                        ? "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                        : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                    }`}
                  >
                    {item.type === "expense"
                      ? `- ₹ ${Number(item.amount || 0).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                      : `+ ₹ ${Number(item.amount || 0).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                  </p>
                </div>
              </div>

              {/* Desktop View */}
              <div className="hidden sm:grid sm:grid-cols-[5fr_3fr_4fr] items-center gap-4">
                <div className="flex items-center gap-2 overflow-hidden">
                  <TransactionsInfoCard
                    title={item.type === "expense" ? item.category : item.source}
                    icon={item.icon}
                    type={item.type}
                    amount={item.amount}
                    hideDeleteBtn
                    compact
                  />
                </div>
                <p className="text-center font-medium text-xs md:text-sm text-gray-300 whitespace-nowrap">
                  {moment(item.date).format("Do MMM YYYY")}
                </p>
                <div className="flex justify-end shrink-0">
                  <p
                    className={`font-semibold px-2.5 py-1 text-xs rounded-lg w-fit whitespace-nowrap ${
                      item.type === "expense"
                        ? "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                        : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                    }`}
                  >
                    {item.type === "expense"
                      ? `- ₹ ${Number(item.amount || 0).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                      : `+ ₹ ${Number(item.amount || 0).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default RecentTransactions;
