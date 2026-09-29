import xlsx from "xlsx";
import expenseModel from "../models/Expense.js";
import Account from "../models/Account.js";

const addExpense = async (req, res) => {
    const userId = req.user.id;

    try {
        const { icon, category, amount, date, accountId } = req.body;
        if (!category || !amount || !date) {
            return res.json({ success: false, message: "All Fields Are Required" });
        }

        // Find or fallback to target account
        let targetAccount = null;
        if (accountId) {
            targetAccount = await Account.findOne({ _id: accountId, userId });
        }
        if (!targetAccount) {
            targetAccount = await Account.findOne({ userId }).sort({ isDefault: -1, createdAt: 1 });
            if (!targetAccount) {
                targetAccount = await Account.create({
                    userId,
                    name: "Main Savings Bank",
                    type: "savings",
                    balance: 0,
                    icon: "🏦",
                    isDefault: true,
                });
            }
        }

        const numericAmount = Number(amount);
        const newExpense = new expenseModel({
            userId,
            accountId: targetAccount._id,
            icon,
            category,
            amount: numericAmount,
            date: new Date(date)
        });
        await newExpense.save();

        // Deduct from liquid account balance (or increment if credit card balance is debt)
        if (targetAccount.type === "credit") {
            targetAccount.balance = Number(targetAccount.balance || 0) + numericAmount;
        } else {
            targetAccount.balance = Number(targetAccount.balance || 0) - numericAmount;
        }
        await targetAccount.save();

        res.json({ success: true, newExpense, updatedAccountBalance: targetAccount.balance });
    } catch (error) {
        console.error("Add expense error:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

const getAllExpense = async (req, res) => {
    const userId = req.user.id;
    try {
        const expense = await expenseModel
            .find({ userId })
            .populate("accountId", "name icon type color")
            .sort({ date: -1 })
            .lean();
        res.json({ success: true, expense });
    } catch (error) {
        console.error("Get expenses error:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

const deleteExpense = async (req, res) => {
    const userId = req.user.id;
    try {
        const deletedItem = await expenseModel.findOneAndDelete({ _id: req.params.id, userId });
        if (!deletedItem) {
            return res.status(404).json({ success: false, message: "Expense not found or unauthorized" });
        }

        // Restore account balance
        if (deletedItem.accountId) {
            const targetAccount = await Account.findOne({ _id: deletedItem.accountId, userId });
            if (targetAccount) {
                if (targetAccount.type === "credit") {
                    targetAccount.balance = Number(targetAccount.balance || 0) - Number(deletedItem.amount || 0);
                } else {
                    targetAccount.balance = Number(targetAccount.balance || 0) + Number(deletedItem.amount || 0);
                }
                await targetAccount.save();
            }
        }

        res.json({ success: true, message: "Expense Deleted Successfully" });
    } catch (error) {
        console.error("Delete expense error:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

const downloadExpenseExcel = async (req, res) => {
    const userId = req.user.id;
    try {
        const expense = await expenseModel.find({ userId }).populate("accountId", "name").sort({ date: -1 }).lean();

        const data = expense.map((item) => ({
            Category: item.category,
            Account: item.accountId?.name || "N/A",
            Amount: item.amount,
            Date: item.date ? new Date(item.date).toLocaleDateString() : ""
        }));
        const wb = xlsx.utils.book_new();
        const ws = xlsx.utils.json_to_sheet(data);
        xlsx.utils.book_append_sheet(wb, ws, "Expense");
        
        const buffer = xlsx.write(wb, { type: "buffer", bookType: "xlsx" });
        res.setHeader("Content-Disposition", 'attachment; filename="expense_details.xlsx"');
        res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        return res.send(buffer);
    } catch (error) {
        console.error("Download expense excel error:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

export { addExpense, getAllExpense, deleteExpense, downloadExpenseExcel };