import moment from "moment";
import React, { useState, useEffect, useRef, useMemo } from "react";
import { LuDownload, LuTrash2, LuEllipsisVertical, LuPencil, LuFilter, LuChevronDown, LuCalendar } from "react-icons/lu";
import TransactionsInfoCard from "../cards/TransactionsInfoCard";

const ExpenseList = ({ transactions, onEdit, onDelete, onDownload }) => {
  const [openMenuId, setOpenMenuId] = useState(null);
  const [openHeaderMenu, setOpenHeaderMenu] = useState(false);
  const [openMonthMenu, setOpenMonthMenu] = useState(false);

  // Filter state
  const [filterType, setFilterType] = useState("month"); // 'month', 'last_1_month', 'last_3_months', 'last_6_months', 'last_12_months', 'custom', 'all_time'
  const [selectedMonth, setSelectedMonth] = useState(moment().format("YYYY-MM"));
  const [customStartDate, setCustomStartDate] = useState("");
  const [customEndDate, setCustomEndDate] = useState("");

  const menuRef = useRef(null);
  const headerMenuRef = useRef(null);
  const monthMenuRef = useRef(null);

  const rawList = Array.isArray(transactions)
    ? transactions
    : transactions?.expense || [];

  // Generate month options (current month + past 11 months)
  const monthOptions = useMemo(() => {
    const options = [];
    for (let i = 0; i < 12; i++) {
      const m = moment().subtract(i, "months");
      options.push({
        value: m.format("YYYY-MM"),
        label: m.format("MMMM YYYY"),
      });
    }
    return options;
  }, []);

  // Get active filter display label for button
  const getActiveFilterLabel = () => {
    if (filterType === "month") {
      const found = monthOptions.find((m) => m.value === selectedMonth);
      return found ? found.label : moment(selectedMonth, "YYYY-MM").format("MMMM YYYY");
    }
    if (filterType === "last_1_month") return "Last 1 Month";
    if (filterType === "last_3_months") return "Last 3 Months";
    if (filterType === "last_6_months") return "Last 6 Months";
    if (filterType === "last_12_months") return "Last 12 Months";
    if (filterType === "custom") return "Custom Range";
    if (filterType === "all_time") return "All Time";
    return "Select Month";
  };

  // Filtered transactions logic
  const expenseList = useMemo(() => {
    return rawList.filter((item) => {
      if (!item.date) return false;
      const mDate = moment(item.date);

      if (filterType === "month") {
        return mDate.format("YYYY-MM") === selectedMonth;
      }
      if (filterType === "last_1_month") {
        return mDate.isAfter(moment().subtract(1, "month").startOf("day"));
      }
      if (filterType === "last_3_months") {
        return mDate.isAfter(moment().subtract(3, "months").startOf("day"));
      }
      if (filterType === "last_6_months") {
        return mDate.isAfter(moment().subtract(6, "months").startOf("day"));
      }
      if (filterType === "last_12_months") {
        return mDate.isAfter(moment().subtract(12, "months").startOf("day"));
      }
      if (filterType === "custom") {
        if (!customStartDate || !customEndDate) return true;
        const start = moment(customStartDate).startOf("day");
        const end = moment(customEndDate).endOf("day");
        return mDate.isSameOrAfter(start) && mDate.isSameOrBefore(end);
      }
      if (filterType === "all_time") {
        return true;
      }
      return true;
    });
  }, [rawList, filterType, selectedMonth, customStartDate, customEndDate]);

  const handleDownloadClick = () => {
    let bounds = { startDate: null, endDate: null };
    if (filterType === "month" && selectedMonth) {
      bounds.startDate = moment(selectedMonth, "YYYY-MM").startOf("month").toISOString();
      bounds.endDate = moment(selectedMonth, "YYYY-MM").endOf("month").toISOString();
    } else if (filterType === "last_1_month") {
      bounds.startDate = moment().subtract(1, "month").startOf("day").toISOString();
      bounds.endDate = moment().endOf("day").toISOString();
    } else if (filterType === "last_3_months") {
      bounds.startDate = moment().subtract(3, "months").startOf("day").toISOString();
      bounds.endDate = moment().endOf("day").toISOString();
    } else if (filterType === "last_6_months") {
      bounds.startDate = moment().subtract(6, "months").startOf("day").toISOString();
      bounds.endDate = moment().endOf("day").toISOString();
    } else if (filterType === "last_12_months") {
      bounds.startDate = moment().subtract(12, "months").startOf("day").toISOString();
      bounds.endDate = moment().endOf("day").toISOString();
    } else if (filterType === "custom") {
      if (customStartDate) bounds.startDate = moment(customStartDate).startOf("day").toISOString();
      if (customEndDate) bounds.endDate = moment(customEndDate).endOf("day").toISOString();
    }
    onDownload(bounds);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpenMenuId(null);
      }
      if (headerMenuRef.current && !headerMenuRef.current.contains(event.target)) {
        setOpenHeaderMenu(false);
      }
      if (monthMenuRef.current && !monthMenuRef.current.contains(event.target)) {
        setOpenMonthMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="bg-neutral-800/80 border border-neutral-700/80 rounded-2xl p-4 md:p-6 shadow-xl text-white backdrop-blur-xl">
      {/* Header Container */}
      <div className="flex flex-col gap-3 border-b border-neutral-700/60 pb-4">
        <div className="flex items-center justify-between gap-2">
          <h5 className="text-base md:text-xl font-bold tracking-wide text-gray-100 shrink-0">
            Expense History
          </h5>

          {/* Header Controls */}
          <div className="flex items-center gap-2">
            {/* Custom Styled Month Selector Dropdown */}
            <div className="relative" ref={monthMenuRef}>
              <button
                onClick={() => {
                  setOpenMonthMenu(!openMonthMenu);
                  setOpenHeaderMenu(false);
                }}
                className="flex items-center gap-2 bg-neutral-900 border border-neutral-700 hover:border-neutral-600 text-gray-200 text-xs md:text-sm font-medium px-3 py-1.5 md:py-2 rounded-xl transition-all cursor-pointer shadow-sm"
              >
                <LuCalendar className="text-rose-400 text-xs md:text-sm" />
                <span>{getActiveFilterLabel()}</span>
                <LuChevronDown className={`text-xs transition-transform duration-200 ${openMonthMenu ? "rotate-180" : ""}`} />
              </button>

              {openMonthMenu && (
                <div className="absolute right-0 top-11 z-50 bg-neutral-900 border border-neutral-700 rounded-xl shadow-2xl p-1.5 w-48 max-h-48 overflow-y-auto backdrop-blur-xl flex flex-col gap-1 text-xs [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-neutral-700 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-transparent">
                  <div className="px-2.5 py-1 text-gray-400 font-semibold uppercase tracking-wider text-[10px] border-b border-neutral-800 mb-1 sticky top-0 bg-neutral-900 z-10">
                    Select Month
                  </div>
                  {monthOptions.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => {
                        setFilterType("month");
                        setSelectedMonth(opt.value);
                        setOpenMonthMenu(false);
                      }}
                      className={`text-left px-2.5 py-2 rounded-lg transition-colors cursor-pointer w-full ${
                        filterType === "month" && selectedMonth === opt.value
                          ? "bg-rose-500/20 text-rose-400 font-semibold"
                          : "text-gray-300 hover:bg-neutral-800"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Header 3-Dots Menu Button */}
            <div className="relative" ref={headerMenuRef}>
              <button
                onClick={() => {
                  setOpenHeaderMenu(!openHeaderMenu);
                  setOpenMonthMenu(false);
                }}
                className="p-2 rounded-xl bg-neutral-700 hover:bg-neutral-600 text-gray-200 transition-colors cursor-pointer flex items-center justify-center shadow-sm"
                title="Filter Presets & Download"
              >
                <LuEllipsisVertical size={18} />
              </button>

              {openHeaderMenu && (
                <div className="absolute right-0 top-11 z-50 bg-neutral-900 border border-neutral-700 rounded-xl shadow-2xl p-2 w-52 max-h-80 overflow-y-auto backdrop-blur-xl flex flex-col gap-1 text-xs [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-neutral-700 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-transparent">
                  <div className="flex items-center gap-1.5 px-2 py-1 text-gray-400 font-semibold uppercase tracking-wider text-[10px] sticky top-0 bg-neutral-900 z-10">
                    <LuFilter size={12} /> Time Period Filter
                  </div>
                  <button
                    onClick={() => {
                      setFilterType("month");
                      setSelectedMonth(moment().format("YYYY-MM"));
                      setOpenHeaderMenu(false);
                    }}
                    className={`text-left px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer ${
                      filterType === "month" ? "bg-rose-500/20 text-rose-400 font-semibold" : "text-gray-300 hover:bg-neutral-800"
                    }`}
                  >
                    Current Month ({moment().format("MMM YYYY")})
                  </button>
                  <button
                    onClick={() => {
                      setFilterType("last_1_month");
                      setOpenHeaderMenu(false);
                    }}
                    className={`text-left px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer ${
                      filterType === "last_1_month" ? "bg-rose-500/20 text-rose-400 font-semibold" : "text-gray-300 hover:bg-neutral-800"
                    }`}
                  >
                    Last 1 Month
                  </button>
                  <button
                    onClick={() => {
                      setFilterType("last_3_months");
                      setOpenHeaderMenu(false);
                    }}
                    className={`text-left px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer ${
                      filterType === "last_3_months" ? "bg-rose-500/20 text-rose-400 font-semibold" : "text-gray-300 hover:bg-neutral-800"
                    }`}
                  >
                    Last 3 Months
                  </button>
                  <button
                    onClick={() => {
                      setFilterType("last_6_months");
                      setOpenHeaderMenu(false);
                    }}
                    className={`text-left px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer ${
                      filterType === "last_6_months" ? "bg-rose-500/20 text-rose-400 font-semibold" : "text-gray-300 hover:bg-neutral-800"
                    }`}
                  >
                    Last 6 Months
                  </button>
                  <button
                    onClick={() => {
                      setFilterType("last_12_months");
                      setOpenHeaderMenu(false);
                    }}
                    className={`text-left px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer ${
                      filterType === "last_12_months" ? "bg-rose-500/20 text-rose-400 font-semibold" : "text-gray-300 hover:bg-neutral-800"
                    }`}
                  >
                    Last 12 Months
                  </button>
                  <button
                    onClick={() => {
                      setFilterType("custom");
                      setOpenHeaderMenu(false);
                    }}
                    className={`text-left px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer ${
                      filterType === "custom" ? "bg-rose-500/20 text-rose-400 font-semibold" : "text-gray-300 hover:bg-neutral-800"
                    }`}
                  >
                    Custom Date Range
                  </button>
                  <button
                    onClick={() => {
                      setFilterType("all_time");
                      setOpenHeaderMenu(false);
                    }}
                    className={`text-left px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer ${
                      filterType === "all_time" ? "bg-rose-500/20 text-rose-400 font-semibold" : "text-gray-300 hover:bg-neutral-800"
                    }`}
                  >
                    All Time
                  </button>

                  <div className="border-t border-neutral-800 pt-1.5 mt-1">
                    <button
                      onClick={() => {
                        setOpenHeaderMenu(false);
                        handleDownloadClick();
                      }}
                      className="flex items-center gap-2 w-full text-left px-2.5 py-1.5 rounded-lg font-semibold text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
                    >
                      <LuDownload size={14} /> Download Excel
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Custom Date Inputs if custom filter selected */}
        {filterType === "custom" && (
          <div className="flex flex-wrap items-center gap-2 bg-neutral-900/80 p-2.5 rounded-xl border border-neutral-700/80 text-xs">
            <span className="text-gray-400 font-medium">From:</span>
            <input
              type="date"
              value={customStartDate}
              onChange={(e) => setCustomStartDate(e.target.value)}
              className="bg-neutral-800 border border-neutral-700 rounded-lg px-2.5 py-1 text-white focus:outline-none focus:border-rose-500"
            />
            <span className="text-gray-400 font-medium">To:</span>
            <input
              type="date"
              value={customEndDate}
              onChange={(e) => setCustomEndDate(e.target.value)}
              className="bg-neutral-800 border border-neutral-700 rounded-lg px-2.5 py-1 text-white focus:outline-none focus:border-rose-500"
            />
          </div>
        )}
      </div>

      {/* Table Header */}
      <div className="hidden sm:grid grid-cols-[5fr_3fr_4fr_1fr] py-3 px-4 border-b border-neutral-700 text-gray-400 bg-neutral-900/60 rounded-xl mt-4 text-xs font-semibold uppercase tracking-wider">
        <p>Category</p>
        <p className="text-center">Date</p>
        <p className="text-center">Amount</p>
        <p className="text-right">Action</p>
      </div>

      {/* Transactions */}
      <div className="flex flex-col divide-y divide-neutral-700/50 mt-2" ref={menuRef}>
        {expenseList.length === 0 ? (
          <p className="text-center py-8 text-sm text-gray-400">
            No expense records found for this period.
          </p>
        ) : (
          expenseList.map((expense) => (
            <div
              key={expense._id}
              className="py-3.5 px-3 sm:px-4 hover:bg-neutral-700/30 rounded-lg transition-all relative"
            >
              {/* Mobile View */}
              <div className="flex sm:hidden items-center justify-between gap-2">
                <div className="flex flex-col gap-0.5 min-w-0">
                  <TransactionsInfoCard
                    title={expense.category}
                    subtitle={expense.accountId?.name}
                    icon={expense.icon}
                    type="expense"
                    amount={expense.amount}
                    hideDeleteBtn
                    compact
                  />
                  <p className="text-[11px] font-medium text-gray-400 pl-1">
                    {moment(expense.date).format("Do MMM YYYY")}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0 relative">
                  <p className="font-semibold px-2.5 py-1 text-xs rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/20 whitespace-nowrap">
                    - ₹ {Number(expense.amount || 0).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </p>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setOpenMenuId(openMenuId === expense._id ? null : expense._id);
                    }}
                    className="text-gray-400 hover:text-white p-1.5 rounded-lg hover:bg-neutral-700 transition-colors cursor-pointer"
                    title="Actions"
                  >
                    <LuEllipsisVertical size={18} />
                  </button>

                  {openMenuId === expense._id && (
                    <div className="absolute right-0 top-9 z-30 bg-neutral-900 border border-neutral-700 rounded-xl shadow-2xl p-1 w-32 backdrop-blur-xl flex flex-col gap-1">
                      <button
                        onClick={() => {
                          setOpenMenuId(null);
                          onEdit(expense);
                        }}
                        className="flex items-center gap-2 px-3 py-2 text-xs text-gray-200 hover:bg-neutral-800 rounded-lg transition-colors cursor-pointer w-full text-left"
                      >
                        <LuPencil size={14} className="text-rose-400" />
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={() => {
                          setOpenMenuId(null);
                          onDelete(expense._id);
                        }}
                        className="flex items-center gap-2 px-3 py-2 text-xs text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors cursor-pointer w-full text-left"
                      >
                        <LuTrash2 size={14} />
                        <span>Delete</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Desktop View */}
              <div className="hidden sm:grid sm:grid-cols-[5fr_3fr_4fr_1fr] items-center gap-2 text-xs md:text-sm">
                {/* Expense Category */}
                <div className="flex items-center">
                  <TransactionsInfoCard
                    title={expense.category}
                    subtitle={expense.accountId?.name}
                    icon={expense.icon}
                    type="expense"
                    amount={expense.amount}
                    hideDeleteBtn
                    compact
                  />
                </div>

                {/* Date */}
                <div className="flex justify-center">
                  <p className="font-medium text-xs md:text-sm text-gray-300">
                    {moment(expense.date).format("Do MMM YYYY")}
                  </p>
                </div>

                {/* Amount */}
                <div className="flex justify-center">
                  <p className="font-bold px-3 py-1 text-xs md:text-sm rounded-lg w-fit bg-rose-500/10 text-rose-400 border border-rose-500/20">
                    - ₹ {Number(expense.amount || 0).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </p>
                </div>

                {/* Action 3-dots Menu */}
                <div className="flex justify-end relative">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setOpenMenuId(openMenuId === expense._id ? null : expense._id);
                    }}
                    className="text-gray-400 hover:text-white p-1.5 rounded-lg hover:bg-neutral-700 transition-colors cursor-pointer"
                    title="Actions"
                  >
                    <LuEllipsisVertical size={18} />
                  </button>

                  {openMenuId === expense._id && (
                    <div className="absolute right-0 top-9 z-30 bg-neutral-900 border border-neutral-700 rounded-xl shadow-2xl p-1 w-32 backdrop-blur-xl flex flex-col gap-1">
                      <button
                        onClick={() => {
                          setOpenMenuId(null);
                          onEdit(expense);
                        }}
                        className="flex items-center gap-2 px-3 py-2 text-xs text-gray-200 hover:bg-neutral-800 rounded-lg transition-colors cursor-pointer w-full text-left"
                      >
                        <LuPencil size={14} className="text-rose-400" />
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={() => {
                          setOpenMenuId(null);
                          onDelete(expense._id);
                        }}
                        className="flex items-center gap-2 px-3 py-2 text-xs text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors cursor-pointer w-full text-left"
                      >
                        <LuTrash2 size={14} />
                        <span>Delete</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ExpenseList;
