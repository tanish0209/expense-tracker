import React, { useState } from "react";
import Modal from "../Modal";

const ACCOUNT_TYPES = [
  { label: "Savings Account", value: "savings", icon: "🏦" },
  { label: "Checking Account", value: "checking", icon: "🏛️" },
  { label: "Credit Card", value: "credit", icon: "💳" },
  { label: "Digital Wallet", value: "wallet", icon: "📱" },
  { label: "Physical Cash", value: "cash", icon: "💵" },
  { label: "Crypto / Web3", value: "crypto", icon: "🪙" },
];

const GRADIENTS = [
  { label: "Indigo Blue", value: "from-indigo-600 to-blue-700" },
  { label: "Emerald Teal", value: "from-emerald-600 to-teal-700" },
  { label: "Purple Violet", value: "from-violet-600 to-purple-800" },
  { label: "Rose Pink", value: "from-rose-600 to-pink-700" },
  { label: "Amber Orange", value: "from-amber-500 to-orange-600" },
  { label: "Dark Slate", value: "from-neutral-700 to-neutral-900" },
];

const AddAccountModal = ({ isOpen, onClose, onAddAccount }) => {
  const [formData, setFormData] = useState({
    name: "",
    type: "savings",
    balance: "",
    creditLimit: "",
    currency: "INR",
    accountNumberLast4: "",
    icon: "🏦",
    color: "from-indigo-600 to-blue-700",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onAddAccount(formData);
    setFormData({
      name: "",
      type: "savings",
      balance: "",
      creditLimit: "",
      currency: "INR",
      accountNumberLast4: "",
      icon: "🏦",
      color: "from-indigo-600 to-blue-700",
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add New Account / Wallet">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-gray-300 mb-1">
            Account Name *
          </label>
          <input
            type="text"
            required
            placeholder="e.g. HDFC Salary, Chase Checking, Amex Card"
            className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1">
              Account Type
            </label>
            <select
              className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
              value={formData.type}
              onChange={(e) => {
                const selected = ACCOUNT_TYPES.find((t) => t.value === e.target.value);
                setFormData({
                  ...formData,
                  type: e.target.value,
                  icon: selected?.icon || "💳",
                });
              }}
            >
              {ACCOUNT_TYPES.map((t) => (
                <option key={t.value} value={t.value} className="bg-neutral-900">
                  {t.icon} {t.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1">
              Currency
            </label>
            <select
              className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
              value={formData.currency}
              onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
            >
              <option value="INR" className="bg-neutral-900">₹ INR</option>
              <option value="USD" className="bg-neutral-900">$ USD</option>
              <option value="EUR" className="bg-neutral-900">€ EUR</option>
              <option value="GBP" className="bg-neutral-900">£ GBP</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1">
              {formData.type === "credit" ? "Current Credit Balance Owed" : "Initial Balance"} (₹)
            </label>
            <input
              type="number"
              step="any"
              placeholder="0.00"
              className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
              value={formData.balance}
              onChange={(e) => setFormData({ ...formData, balance: e.target.value })}
            />
          </div>

          {formData.type === "credit" && (
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">
                Credit Limit (₹)
              </label>
              <input
                type="number"
                step="any"
                placeholder="100000"
                className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
                value={formData.creditLimit}
                onChange={(e) => setFormData({ ...formData, creditLimit: e.target.value })}
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1">
              Last 4 Digits (Optional)
            </label>
            <input
              type="text"
              maxLength={4}
              placeholder="1234"
              className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
              value={formData.accountNumberLast4}
              onChange={(e) => setFormData({ ...formData, accountNumberLast4: e.target.value })}
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-300 mb-1">
            Card Theme Gradient
          </label>
          <div className="grid grid-cols-3 gap-2">
            {GRADIENTS.map((g) => (
              <button
                key={g.value}
                type="button"
                className={`h-8 rounded-lg bg-gradient-to-r ${g.value} border-2 transition-all ${
                  formData.color === g.value ? "border-white scale-105 shadow-md" : "border-transparent opacity-80"
                }`}
                onClick={() => setFormData({ ...formData, color: g.value })}
                title={g.label}
              />
            ))}
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-3 border-t border-neutral-800">
          <button
            type="button"
            className="px-4 py-2 text-xs font-semibold text-gray-400 hover:text-white transition-colors"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-5 py-2 text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl transition-all shadow-md"
          >
            Create Account
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default AddAccountModal;
