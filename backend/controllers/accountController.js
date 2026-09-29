import Account from "../models/Account.js";
import Transfer from "../models/Transfer.js";

// @desc Get all accounts and total balance summary
export const getAccounts = async (req, res) => {
  try {
    const userId = req.user.id;
    let accounts = await Account.find({ userId }).sort({ isDefault: -1, createdAt: 1 }).lean();

    // Auto-seed default accounts if user has none
    if (!accounts || accounts.length === 0) {
      const defaultAccounts = await Account.insertMany([
        {
          userId,
          name: "Main Savings Bank",
          type: "savings",
          balance: 0,
          icon: "🏦",
          color: "from-indigo-600 to-blue-700",
          isDefault: true,
        },
        {
          userId,
          name: "Cash Wallet",
          type: "cash",
          balance: 0,
          icon: "💵",
          color: "from-emerald-600 to-teal-700",
          isDefault: false,
        },
      ]);
      accounts = defaultAccounts;
    }

    // Calculate aggregations
    let totalLiquidCash = 0;
    let totalCreditOwed = 0;

    accounts.forEach((acc) => {
      if (acc.type === "credit") {
        totalCreditOwed += Number(acc.balance || 0);
      } else {
        totalLiquidCash += Number(acc.balance || 0);
      }
    });

    const netAssets = totalLiquidCash - totalCreditOwed;

    return res.status(200).json({
      success: true,
      accounts,
      summary: {
        totalLiquidCash,
        totalCreditOwed,
        netAssets,
      },
    });
  } catch (error) {
    console.error("Error fetching accounts:", error);
    return res.status(500).json({ success: false, message: "Server error fetching accounts" });
  }
};

// @desc Add a new bank account or wallet
export const addAccount = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, type, balance, currency, creditLimit, accountNumberLast4, icon, color } = req.body;

    if (!name) {
      return res.status(400).json({ success: false, message: "Account name is required" });
    }

    const account = await Account.create({
      userId,
      name,
      type: type || "savings",
      balance: Number(balance) || 0,
      currency: currency || "INR",
      creditLimit: Number(creditLimit) || 0,
      accountNumberLast4: accountNumberLast4 || "",
      icon: icon || "💳",
      color: color || "from-violet-600 to-purple-700",
    });

    return res.status(201).json({
      success: true,
      message: "Account added successfully",
      account,
    });
  } catch (error) {
    console.error("Error adding account:", error);
    return res.status(500).json({ success: false, message: "Server error adding account" });
  }
};

// @desc Update an existing account
export const updateAccount = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const { name, type, balance, creditLimit, accountNumberLast4, icon, color } = req.body;

    const account = await Account.findOne({ _id: id, userId });
    if (!account) {
      return res.status(404).json({ success: false, message: "Account not found" });
    }

    if (name !== undefined) account.name = name;
    if (type !== undefined) account.type = type;
    if (balance !== undefined) account.balance = Number(balance);
    if (creditLimit !== undefined) account.creditLimit = Number(creditLimit);
    if (accountNumberLast4 !== undefined) account.accountNumberLast4 = accountNumberLast4;
    if (icon !== undefined) account.icon = icon;
    if (color !== undefined) account.color = color;

    await account.save();

    return res.status(200).json({
      success: true,
      message: "Account updated successfully",
      account,
    });
  } catch (error) {
    console.error("Error updating account:", error);
    return res.status(500).json({ success: false, message: "Server error updating account" });
  }
};

// @desc Delete an account
export const deleteAccount = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const account = await Account.findOneAndDelete({ _id: id, userId });
    if (!account) {
      return res.status(404).json({ success: false, message: "Account not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Account deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting account:", error);
    return res.status(500).json({ success: false, message: "Server error deleting account" });
  }
};

// @desc Transfer funds between accounts
export const transferFunds = async (req, res) => {
  try {
    const userId = req.user.id;
    const { fromAccountId, toAccountId, amount, date, note } = req.body;

    if (!fromAccountId || !toAccountId) {
      return res.status(400).json({ success: false, message: "Source and destination accounts are required" });
    }

    if (fromAccountId === toAccountId) {
      return res.status(400).json({ success: false, message: "Cannot transfer to the same account" });
    }

    const transferAmount = Number(amount);
    if (!transferAmount || transferAmount <= 0) {
      return res.status(400).json({ success: false, message: "Transfer amount must be greater than 0" });
    }

    const fromAccount = await Account.findOne({ _id: fromAccountId, userId });
    const toAccount = await Account.findOne({ _id: toAccountId, userId });

    if (!fromAccount || !toAccount) {
      return res.status(404).json({ success: false, message: "One or both accounts were not found" });
    }

    // Deduct from source account and add to destination account
    fromAccount.balance = Number(fromAccount.balance || 0) - transferAmount;
    toAccount.balance = Number(toAccount.balance || 0) + transferAmount;

    await fromAccount.save();
    await toAccount.save();

    // Record Transfer Log
    const transferLog = await Transfer.create({
      userId,
      fromAccountId,
      toAccountId,
      amount: transferAmount,
      date: date ? new Date(date) : new Date(),
      note: note || "",
    });

    return res.status(200).json({
      success: true,
      message: `Successfully transferred ₹${transferAmount.toLocaleString()} from ${fromAccount.name} to ${toAccount.name}`,
      transfer: transferLog,
      updatedBalances: {
        fromAccount: { id: fromAccount._id, name: fromAccount.name, balance: fromAccount.balance },
        toAccount: { id: toAccount._id, name: toAccount.name, balance: toAccount.balance },
      },
    });
  } catch (error) {
    console.error("Error transferring funds:", error);
    return res.status(500).json({ success: false, message: "Server error executing transfer" });
  }
};

// @desc Get recent transfers list
export const getTransfers = async (req, res) => {
  try {
    const userId = req.user.id;
    const transfers = await Transfer.find({ userId })
      .populate("fromAccountId", "name icon type")
      .populate("toAccountId", "name icon type")
      .sort({ date: -1, createdAt: -1 })
      .limit(20)
      .lean();

    return res.status(200).json({
      success: true,
      transfers,
    });
  } catch (error) {
    console.error("Error fetching transfers:", error);
    return res.status(500).json({ success: false, message: "Server error fetching transfers" });
  }
};
