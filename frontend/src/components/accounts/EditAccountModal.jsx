import React, { useState, useEffect } from "react";
import Modal from "../Modal";
import { LuBriefcase, LuLandmark, LuCreditCard, LuWallet, LuCoins, LuBuilding2 } from "react-icons/lu";

const ACCOUNT_TYPES = [
  { label: "Salary Account", value: "salary" },
  { label: "Savings Account", value: "savings" },
  { label: "Checking Account", value: "checking" },
  { label: "Credit Card", value: "credit" },
  { label: "Digital Wallet", value: "wallet" },
  { label: "Physical Cash", value: "cash" },
  { label: "Crypto / Web3", value: "crypto" },
];

const GRADIENTS = [
  { label: "Indigo Blue", value: "from-indigo-600 to-blue-700" },
  { label: "Emerald Teal", value: "from-emerald-600 to-teal-700" },
  { label: "Purple Violet", value: "from-violet-600 to-purple-800" },
  { label: "Rose Pink", value: "from-rose-600 to-pink-700" },
  { label: "Amber Orange", value: "from-amber-500 to-orange-600" },
  { label: "Dark Slate", value: "from-neutral-700 to-neutral-900" },
];

const renderTypeOutlineIcon = (type) => {
  switch (type) {
    case "salary":
      return <LuBriefcase className="w-4 h-4 text-indigo-400" />;
    case "savings":
      return <LuLandmark className="w-4 h-4 text-emerald-400" />;
    case "checking":
      return <LuBuilding2 className="w-4 h-4 text-blue-400" />;
    case "credit":
      return <LuCreditCard className="w-4 h-4 text-rose-400" />;
    case "wallet":
      return <LuWallet className="w-4 h-4 text-amber-400" />;
    case "cash":
    case "crypto":
      return <LuCoins className="w-4 h-4 text-purple-400" />;
    default:
      return <LuLandmark className="w-4 h-4 text-gray-400" />;
  }
};

const EditAccountModal = ({ isOpen, onClose, account, onUpdateAccount }) => {
  const [formData, setFormData] = useState({
    name: "",
    type: "savings",
    balance: 0,
    creditLimit: "",
    accountNumberLast4: "",
    color: "from-indigo-600 to-blue-700",
  });

  useEffect(() => {
    if (account) {
      setFormData({
        name: account.name || "",
        type: account.type || "savings",
        balance: account.balance !== undefined ? account.balance : 0,
        creditLimit: account.creditLimit !== undefined ? String(account.creditLimit) : "",
        accountNumberLast4: account.accountNumberLast4 || "",
        color: account.color || "from-indigo-600 to-blue-700",
      });
    }
  }, [account]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!account) return;
    onUpdateAccount(account._id, {
      name: formData.name,
      type: formData.type,
      creditLimit: formData.type === "credit" ? Number(formData.creditLimit || 0) : 0,
      accountNumberLast4: formData.accountNumberLast4,
      color: formData.color,
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Account Details">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-gray-300 mb-1">
            Account Name *
          </label>
          <input
            type="text"
            required
            placeholder="e.g. Main Savings Bank, HDFC Card"
            className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-300 mb-1">
              {renderTypeOutlineIcon(formData.type)}
              <span>Account Type</span>
            </label>
            <select
              className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
              value={formData.type}
              onChange={(e) => {
                setFormData({
                  ...formData,
                  type: e.target.value,
                });
              }}
            >
              {ACCOUNT_TYPES.map((t) => (
                <option key={t.value} value={t.value} className="bg-neutral-900">
                  {t.label}
                </option>
              ))}
            </select>
          </div>

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

        {/* Readonly Balance Field */}
        <div>
          <label className="block text-xs font-semibold text-gray-300 mb-1">
            Account Balance (Read-Only)
          </label>
          <input
            type="text"
            disabled
            readOnly
            className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-sm text-gray-400 cursor-not-allowed font-semibold"
            value={`₹ ${Number(formData.balance || 0).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
          />
          <p className="text-[10px] text-gray-500 mt-1">
            * Account balance is managed automatically via income, expenses, and inter-account transfers.
          </p>
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
            Card Theme Gradient
          </label>
          <div className="grid grid-cols-3 gap-2">
            {GRADIENTS.map((g) => (
              <button
                key={g.value}
                type="button"
                className={`h-8 rounded-lg bg-gradient-to-r ${g.value} border-2 transition-all cursor-pointer ${
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
            className="px-4 py-2 text-xs font-semibold text-gray-400 hover:text-white transition-colors cursor-pointer"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-5 py-2 text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl transition-all shadow-md cursor-pointer"
          >
            Save Changes
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default EditAccountModal;
