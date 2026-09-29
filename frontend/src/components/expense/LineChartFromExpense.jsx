import React, { useMemo, useState, memo } from "react";
import {
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
  AreaChart,
  Area,
} from "recharts";
import moment from "moment";

const LineChartFromExpense = memo(({ transactions = [] }) => {
  const now = moment();
  const [selectedMonth, setSelectedMonth] = useState(now.month());
  const [selectedYear, setSelectedYear] = useState(now.year());

  const chartData = useMemo(() => {
    const list = Array.isArray(transactions) ? transactions : [];
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
        expense: 0,
      };
    });

    list.forEach((txn) => {
      if (!txn.date) return;
      const txnDate = moment(txn.date);
      if (
        txnDate.year() === selectedYear &&
        txnDate.month() === selectedMonth
      ) {
        const dayIndex = txnDate.date() - 1;
        if (dailyTotals[dayIndex]) {
          dailyTotals[dayIndex].expense += Number(txn.amount) || 0;
        }
      }
    });

    return dailyTotals;
  }, [transactions, selectedMonth, selectedYear]);

  const years = useMemo(() => Array.from({ length: 5 }, (_, i) => now.year() - i), [now]);
  const months = useMemo(() => moment.monthsShort(), []);

  return (
    <div className="w-full text-white">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-neutral-700/60 pb-3 mb-4">
        <h6 className="text-sm font-semibold text-gray-300">
          Monthly Trend - {months[selectedMonth]} {selectedYear}
        </h6>
        <div className="flex gap-2">
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(Number(e.target.value))}
            className="bg-neutral-900 text-gray-200 text-xs px-2.5 py-1.5 rounded-lg border border-neutral-700 hover:border-rose-500 focus:outline-none transition-all"
          >
            {months.map((month, index) => (
              <option key={month} value={index} className="bg-neutral-900 text-white">
                {month}
              </option>
            ))}
          </select>

          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
            className="bg-neutral-900 text-gray-200 text-xs px-2.5 py-1.5 rounded-lg border border-neutral-700 hover:border-rose-500 focus:outline-none transition-all"
          >
            {years.map((year) => (
              <option key={year} value={year} className="bg-neutral-900 text-white">
                {year}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="w-full h-[250px] sm:h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="expenseGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#EF4444" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#EF4444" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
            <XAxis dataKey="date" stroke="#9CA3AF" tick={{ fontSize: 11 }} />
            <YAxis stroke="#9CA3AF" fontSize={11} />
            <Tooltip
              contentStyle={{
                backgroundColor: "#171717",
                borderColor: "#404040",
                borderRadius: "10px",
              }}
              formatter={(val) => [`₹ ${val}`, "Expenses"]}
              labelFormatter={(lbl, payload) => payload?.[0]?.payload?.fullDate || `Day ${lbl}`}
            />
            <Legend />
            <Area
              type="monotone"
              dataKey="expense"
              stroke="#EF4444"
              strokeWidth={2}
              fill="url(#expenseGradient)"
              name="Expenses"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
});

export default LineChartFromExpense;
