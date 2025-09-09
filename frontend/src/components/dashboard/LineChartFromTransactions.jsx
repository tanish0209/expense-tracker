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
  Area,
  AreaChart,
} from "recharts";
import moment from "moment";

const LineChartFromTransactions = ({ transactions }) => {
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
        date: date.format("DD MMM"),
        income: 0,
        expenses: 0,
      };
    });

    transactions.forEach((txn) => {
      const txnDate = moment(txn.date);
      if (
        txnDate.year() === selectedYear &&
        txnDate.month() === selectedMonth
      ) {
        const dayIndex = txnDate.date() - 1;
        if (txn.type === "income") {
          dailyTotals[dayIndex].income += txn.amount;
        } else if (txn.type === "expense") {
          dailyTotals[dayIndex].expenses += txn.amount;
        }
      }
    });

    return dailyTotals;
  }, [transactions, selectedMonth, selectedYear]);

  const years = Array.from({ length: 5 }, (_, i) => now.year() - i);
  const months = moment.months();
  return (
    <div className="card h-[400px] sm:h-[450px] md:h-[550px] lg:h-[600px] text-white">
      <div className="flex border-b pb-4 justify-between items-center mb-4">
        <h2 className="text-lg md:text-xl font-semibold">
          Daily Income vs Expenses - {months[selectedMonth]} {selectedYear}
        </h2>
        <div className="flex gap-1 md:gap-2">
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(Number(e.target.value))}
            className="bg-black text-white md:p-2 rounded border border-white hover:bg-gray-800 focus:outline-none"
          >
            {months.map((m, i) => (
              <option
                value={i}
                key={m}
                className="bg-black text-white hover:bg-gray-800"
              >
                {m}
              </option>
            ))}
          </select>

          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
            className="bg-black text-white p-1 rounded border border-white hover:bg-gray-800 focus:outline-none"
          >
            {years.map((y) => (
              <option
                value={y}
                key={y}
                className="bg-black text-white hover:bg-gray-800"
              >
                {y}
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
              <linearGradient id="greenShadow" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="lime" stopOpacity={0.8} />
                <stop offset="100%" stopColor="lime" stopOpacity={0.2} />
              </linearGradient>
              <linearGradient id="redShadow" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="red" stopOpacity={0.8} />
                <stop offset="100%" stopColor="red" stopOpacity={0.2} />
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
              stroke="lime"
              fill="url(#greenShadow)"
              fillOpacity={0.8}
              name="Income"
            />
            <Area
              type="monotone"
              dataKey="expenses"
              stroke="red"
              fill="url(#redShadow)"
              fillOpacity={0.8}
              name="Expenses"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default LineChartFromTransactions;
