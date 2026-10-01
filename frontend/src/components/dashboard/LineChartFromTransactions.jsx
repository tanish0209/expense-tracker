import React, { useMemo, useState, memo } from "react";
import {
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
  Area,
  AreaChart,
} from "recharts";
import moment from "moment";

const LineChartFromTransactions = memo(({ transactions }) => {
  const now = moment();
  const [selectedMonth, setSelectedMonth] = useState(now.month());
  const [selectedYear, setSelectedYear] = useState(now.year());

  const chartData = useMemo(() => {
    if (!transactions || !Array.isArray(transactions)) return [];

    const startOfMonth = moment()
      .year(selectedYear)
      .month(selectedMonth)
      .startOf("month");
    const daysInMonth = startOfMonth.daysInMonth();

    const dailyTotals = Array.from({ length: daysInMonth }, (_, i) => {
      const date = startOfMonth.clone().date(i + 1);
      return {
        date: date.format("DD"),
        fullDate: date.format("DD MMM YYYY"),
        income: 0,
        expenses: 0,
      };
    });

    transactions.forEach((txn) => {
      if (!txn.date) return;
      const txnDate = moment(txn.date);
      if (
        txnDate.year() === selectedYear &&
        txnDate.month() === selectedMonth
      ) {
        const dayIndex = txnDate.date() - 1;
        if (dayIndex >= 0 && dayIndex < daysInMonth) {
          if (txn.type === "income") {
            dailyTotals[dayIndex].income += Number(txn.amount) || 0;
          } else if (txn.type === "expense") {
            dailyTotals[dayIndex].expenses += Number(txn.amount) || 0;
          }
        }
      }
    });

    return dailyTotals;
  }, [transactions, selectedMonth, selectedYear]);

  const years = useMemo(() => Array.from({ length: 5 }, (_, i) => now.year() - i), [now]);
  const months = useMemo(() => moment.monthsShort(), []);

  return (
    <div className="bg-neutral-800/80 border border-neutral-700/80 rounded-2xl p-4 md:p-6 shadow-xl text-white backdrop-blur-xl">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-neutral-700/60 pb-4 mb-4">
        <div>
          <h2 className="text-lg md:text-xl font-bold tracking-wide">
            Daily Income vs Expenses
          </h2>
          <p className="text-xs md:text-sm text-gray-400">
            {months[selectedMonth]} {selectedYear} overview
          </p>
        </div>
        <div className="flex gap-2">
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(Number(e.target.value))}
            className="bg-neutral-900 text-gray-200 text-sm px-3 py-1.5 rounded-xl border border-neutral-700 hover:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
          >
            {months.map((m, i) => (
              <option value={i} key={m} className="bg-neutral-900 text-white">
                {m}
              </option>
            ))}
          </select>

          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
            className="bg-neutral-900 text-gray-200 text-sm px-3 py-1.5 rounded-xl border border-neutral-700 hover:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
          >
            {years.map((y) => (
              <option value={y} key={y} className="bg-neutral-900 text-white">
                {y}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="w-full h-[280px] sm:h-[350px] md:h-[420px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={chartData}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            <defs>
              <linearGradient id="greenShadow" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10B981" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#10B981" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="redShadow" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#EF4444" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#EF4444" stopOpacity={0.0} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
            <XAxis
              dataKey="date"
              interval="preserveStartEnd"
              stroke="#9CA3AF"
              tick={{ fontSize: 12 }}
              dy={5}
            />
            <YAxis stroke="#9CA3AF" fontSize={12} />
            <Tooltip
              contentStyle={{
                backgroundColor: "#171717",
                borderColor: "#404040",
                borderRadius: "12px",
                boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.5)"
              }}
              itemStyle={{ fontSize: 13 }}
              formatter={(value, name) => [
                `₹ ${Number(value || 0).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
                name.charAt(0).toUpperCase() + name.slice(1),
              ]}
              labelFormatter={(label, payload) =>
                payload?.[0]?.payload?.fullDate || `Day ${label}`
              }
            />
            <Legend wrapperStyle={{ paddingTop: "10px" }} />

            <Area
              type="monotone"
              dataKey="income"
              stroke="#10B981"
              strokeWidth={2}
              fill="url(#greenShadow)"
              name="Income"
            />
            <Area
              type="monotone"
              dataKey="expenses"
              stroke="#EF4444"
              strokeWidth={2}
              fill="url(#redShadow)"
              name="Expenses"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
});

export default LineChartFromTransactions;
