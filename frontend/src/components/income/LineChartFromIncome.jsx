import React, { useMemo, useState } from "react";
import {
  LineChart,
  Line,
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

const LineChartFromIncome = ({ transactions = [] }) => {
  const now = moment();
  const [selectedMonth, setSelectedMonth] = useState(now.month());
  const [selectedYear, setSelectedYear] = useState(now.year());

  const chartData = useMemo(() => {
    if (!Array.isArray(transactions)) return [];

    const startOfMonth = moment()
      .year(selectedYear)
      .month(selectedMonth)
      .startOf("month");
    const daysInMonth = startOfMonth.daysInMonth();

    const dailyTotals = Array.from({ length: daysInMonth }, (_, i) => {
      const date = startOfMonth.clone().date(i + 1);
      return {
        date: date.format("DD MMM"),
        income: 0,
      };
    });

    transactions.forEach((txn) => {
      const txnDate = moment(txn.date);
      if (
        txnDate.year() === selectedYear &&
        txnDate.month() === selectedMonth
      ) {
        const dayIndex = txnDate.date() - 1;
        if (dailyTotals[dayIndex]) {
          dailyTotals[dayIndex].income += Number(txn.amount) || 0;
        }
      }
    });

    return dailyTotals;
  }, [transactions, selectedMonth, selectedYear]);

  const years = Array.from({ length: 5 }, (_, i) => now.year() - i);
  const months = moment.months();

  return (
    <div className="h-[360px] sm:h-[400px] md:h-[500px] lg:h-[550px] text-white">
      <div className="flex border-b pb-4 justify-between items-center mb-4">
        <h2 className="text-lg md:text-xl font-semibold">
          Income Overview - {months[selectedMonth]} {selectedYear}
        </h2>
        <div className="flex gap-1 md:gap-2">
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(Number(e.target.value))}
            className="bg-black text-white md:p-2 rounded border border-white hover:bg-gray-800 focus:outline-none"
          >
            {months.map((month, index) => (
              <option key={month} value={index}>
                {month}
              </option>
            ))}
          </select>

          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
            className="bg-black text-white p-1 rounded border border-white hover:bg-gray-800 focus:outline-none"
          >
            {years.map((year) => (
              <option
                key={year}
                value={year}
                className="bg-black text-white hover:bg-gray-800"
              >
                {year}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="w-full h-[250px] sm:h-[350px] md:h-[450px] lg:h-[500px] md:p-5 lg:p-10 ">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={chartData}
            margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
          >
            <defs>
              <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#00FF00" stopOpacity={0.6} />
                <stop offset="100%" stopColor="#00FF00" stopOpacity={0.2} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" stroke="#444" />
            <XAxis
              dataKey="date"
              interval={2}
              stroke="#ccc"
              tick={{ angle: -90, dy: 30 }}
              height={70}
            />
            <YAxis stroke="#ccc" />
            <Tooltip
              contentStyle={{ backgroundColor: "#000", borderRadius: "8px" }}
            />
            <Legend />

            <Area
              type="monotone"
              dataKey="income"
              stroke="#00FF00"
              fill="url(#incomeGradient)"
              strokeWidth={2}
              name="Income"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default LineChartFromIncome;
