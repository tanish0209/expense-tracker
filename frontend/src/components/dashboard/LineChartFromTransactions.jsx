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
    <div className="card h-[600px] text-white">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">
          Daily Income vs Expenses - {months[selectedMonth]} {selectedYear}
        </h2>
        <div className="flex gap-2">
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(Number(e.target.value))}
            className="bg-black text-white p-2 rounded border border-white hover:bg-gray-800 focus:outline-none"
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
            className="bg-black text-white p-2 rounded border border-white hover:bg-gray-800 focus:outline-none"
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

      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={chartData}
          margin={{ top: 50, right: 50, left: 50, bottom: 50 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#444" />
          <XAxis dataKey="date" interval={2} stroke="#ccc" />
          <YAxis stroke="#ccc" />
          <Tooltip
            contentStyle={{ backgroundColor: "#000", borderRadius: "8px" }}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="income"
            stroke="#00FF00"
            strokeWidth={2}
            name="Income"
          />
          <Line
            type="monotone"
            dataKey="expenses"
            stroke="#FF0000"
            strokeWidth={2}
            name="Expenses"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default LineChartFromTransactions;
