import React, { useState, useEffect } from "react";
import EmojiPickerPop from "../EmojiPickerPop";
import API from "../../utils/api";

const AddExpenseForm = ({ onAddExpense }) => {
  const [expense, setExpense] = useState({
    category: "",
    amount: "",
    date: "",
    icon: "",
    accountId: "",
  });
  const [accounts, setAccounts] = useState([]);

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const res = await API.get("/api/v1/accounts/get");
        if (res.data?.success && res.data.accounts) {
          setAccounts(res.data.accounts);
          const defaultAcc = res.data.accounts.find((a) => a.isDefault) || res.data.accounts[0];
          if (defaultAcc) {
            setExpense((prev) => ({ ...prev, accountId: defaultAcc._id }));
          }
        }
      } catch (error) {
        console.error("Error loading accounts in form:", error);
      }
    };
    fetchAccounts();
  }, []);

  const handleChange = (key, value) => setExpense({ ...expense, [key]: value });

  return (
    <div className="space-y-4">
      <EmojiPickerPop
        icon={expense.icon}
        onSelect={(selectedIcon) => handleChange("icon", selectedIcon)}
      />

      <div>
        <label className="block text-xs font-semibold text-gray-300 mb-1">
          Pay From Account / Card *
        </label>
        <select
          value={expense.accountId}
          className="w-full bg-neutral-900 border border-neutral-700 rounded-xl text-sm text-white px-3 py-2.5 focus:outline-none focus:border-rose-500 transition-all"
          onChange={({ target }) => handleChange("accountId", target.value)}
        >
          {accounts.map((acc) => (
            <option key={acc._id} value={acc._id} className="bg-neutral-900">
              {acc.icon || "💳"} {acc.name} ({acc.type === "credit" ? "Owed" : "Bal"}: ₹{Number(acc.balance || 0).toLocaleString()})
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-xs font-semibold text-gray-300 mb-1">
          Expense Category *
        </label>
        <input
          value={expense.category}
          className="w-full bg-neutral-900 border border-neutral-700 rounded-xl text-sm text-white px-3 py-2.5 focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 transition-all placeholder:text-neutral-500"
          onChange={({ target }) => handleChange("category", target.value)}
          placeholder="e.g. Rent, Groceries, Utilities"
          type="text"
          required
        />
      </div>

      <div>
        <label className="block text-xs font-semibold text-gray-300 mb-1">
          Expense Amount (₹) *
        </label>
        <input
          value={expense.amount}
          className="w-full bg-neutral-900 border border-neutral-700 rounded-xl text-sm text-white px-3 py-2.5 focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 transition-all placeholder:text-neutral-500"
          onChange={({ target }) => handleChange("amount", target.value)}
          placeholder="e.g. 1500"
          type="number"
          required
        />
      </div>

      <div>
        <label className="block text-xs font-semibold text-gray-300 mb-1">
          Expense Date *
        </label>
        <input
          value={expense.date}
          className="w-full bg-neutral-900 border border-neutral-700 rounded-xl text-sm text-white px-3 py-2.5 focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 transition-all"
          onChange={({ target }) => handleChange("date", target.value)}
          type="date"
          required
        />
      </div>

      <div className="flex justify-end pt-2">
        <button
          type="button"
          className="w-full sm:w-auto bg-rose-600 hover:bg-rose-500 text-white text-sm font-semibold px-6 py-2.5 rounded-xl transition-all shadow-md cursor-pointer"
          onClick={() => onAddExpense(expense)}
        >
          Add Expense
        </button>
      </div>
    </div>
  );
};

export default AddExpenseForm;
