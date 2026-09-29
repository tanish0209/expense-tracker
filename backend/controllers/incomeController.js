import xlsx from "xlsx";
import incomeModel from "../models/Income.js";
import Account from "../models/Account.js";

const addIncome = async (req, res) => {
    const userId = req.user.id;

    try {
        const { icon, source, amount, date, accountId } = req.body;
        if (!source || !amount || !date) {
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
        const newIncome = new incomeModel({
            userId,
            accountId: targetAccount._id,
            icon,
            source,
            amount: numericAmount,
            date: new Date(date)
        });
        await newIncome.save();

        // Update target account balance
        targetAccount.balance = Number(targetAccount.balance || 0) + numericAmount;
        await targetAccount.save();

        res.json({ success: true, newIncome, updatedAccountBalance: targetAccount.balance });
    } catch (error) {
        console.error("Add income error:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

const getAllIncome = async (req, res) => {
    const userId = req.user.id;
    try {
        const income = await incomeModel
            .find({ userId })
            .populate("accountId", "name icon type color")
            .sort({ date: -1 })
            .lean();
        res.json({ success: true, income });
    } catch (error) {
        console.error("Get income error:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

const deleteIncome = async (req, res) => {
    const userId = req.user.id;
    try {
        const deletedItem = await incomeModel.findOneAndDelete({ _id: req.params.id, userId });
        if (!deletedItem) {
            return res.status(404).json({ success: false, message: "Income not found or unauthorized" });
        }

        // Reverse account balance update
        if (deletedItem.accountId) {
            const targetAccount = await Account.findOne({ _id: deletedItem.accountId, userId });
            if (targetAccount) {
                targetAccount.balance = Number(targetAccount.balance || 0) - Number(deletedItem.amount || 0);
                await targetAccount.save();
            }
        }

        res.json({ success: true, message: "Income Deleted Successfully" });
    } catch (error) {
        console.error("Delete income error:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

const downloadIncomeExcel = async (req, res) => {
    const userId = req.user.id;
    try {
        const income = await incomeModel.find({ userId }).populate("accountId", "name").sort({ date: -1 }).lean();

        const data = income.map((item) => ({
            Source: item.source,
            Account: item.accountId?.name || "N/A",
            Amount: item.amount,
            Date: item.date ? new Date(item.date).toLocaleDateString() : ""
        }));
        const wb = xlsx.utils.book_new();
        const ws = xlsx.utils.json_to_sheet(data);
        xlsx.utils.book_append_sheet(wb, ws, "Income");
        
        const buffer = xlsx.write(wb, { type: "buffer", bookType: "xlsx" });
        res.setHeader("Content-Disposition", 'attachment; filename="income_details.xlsx"');
        res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        return res.send(buffer);
    } catch (error) {
        console.error("Download income excel error:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

export { addIncome, getAllIncome, deleteIncome, downloadIncomeExcel };