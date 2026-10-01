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
    const { startDate, endDate } = req.query;
    try {
        let filter = { userId };
        if (startDate && endDate) {
            filter.date = {
                $gte: new Date(startDate),
                $lte: new Date(endDate)
            };
        }
        const income = await incomeModel.find(filter).populate("accountId", "name").sort({ date: -1 }).lean();

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

const updateIncome = async (req, res) => {
    const userId = req.user.id;
    const { id } = req.params;
    const { icon, source, amount, date, accountId } = req.body;

    try {
        const existingIncome = await incomeModel.findOne({ _id: id, userId });
        if (!existingIncome) {
            return res.status(404).json({ success: false, message: "Income not found" });
        }

        const oldAmount = Number(existingIncome.amount || 0);
        const oldAccountId = existingIncome.accountId;

        const newAmount = amount !== undefined ? Number(amount) : oldAmount;
        let newAccountId = oldAccountId;

        if (accountId) {
            const accExists = await Account.findOne({ _id: accountId, userId });
            if (accExists) {
                newAccountId = accExists._id;
            }
        }

        // Adjust account balances if accountId or amount changed
        if (String(oldAccountId) === String(newAccountId)) {
            const diff = newAmount - oldAmount;
            if (diff !== 0 && oldAccountId) {
                const targetAccount = await Account.findOne({ _id: oldAccountId, userId });
                if (targetAccount) {
                    targetAccount.balance = Number(targetAccount.balance || 0) + diff;
                    await targetAccount.save();
                }
            }
        } else {
            if (oldAccountId) {
                const oldAccount = await Account.findOne({ _id: oldAccountId, userId });
                if (oldAccount) {
                    oldAccount.balance = Number(oldAccount.balance || 0) - oldAmount;
                    await oldAccount.save();
                }
            }
            if (newAccountId) {
                const newAccount = await Account.findOne({ _id: newAccountId, userId });
                if (newAccount) {
                    newAccount.balance = Number(newAccount.balance || 0) + newAmount;
                    await newAccount.save();
                }
            }
        }

        if (icon !== undefined) existingIncome.icon = icon;
        if (source !== undefined) existingIncome.source = source;
        if (amount !== undefined) existingIncome.amount = newAmount;
        if (date !== undefined) existingIncome.date = new Date(date);
        existingIncome.accountId = newAccountId;

        await existingIncome.save();

        res.json({ success: true, message: "Income Updated Successfully", updatedIncome: existingIncome });
    } catch (error) {
        console.error("Update income error:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

export { addIncome, getAllIncome, deleteIncome, downloadIncomeExcel, updateIncome };