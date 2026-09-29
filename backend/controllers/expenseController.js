import xlsx from "xlsx";
import expenseModel from "../models/Expense.js";

const addExpense = async (req, res) => {
    const userId = req.user.id;

    try {
        const { icon, category, amount, date } = req.body;
        if (!category || !amount || !date) {
            return res.json({ success: false, message: "All Fields Are Required" });
        }
        const newExpense = new expenseModel({
            userId,
            icon,
            category,
            amount: Number(amount),
            date: new Date(date)
        });
        await newExpense.save();
        res.json({ success: true, newExpense });
    } catch (error) {
        console.error("Add expense error:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

const getAllExpense = async (req, res) => {
    const userId = req.user.id;
    try {
        const expense = await expenseModel.find({ userId }).sort({ date: -1 }).lean();
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
        res.json({ success: true, message: "Expense Deleted Successfully" });
    } catch (error) {
        console.error("Delete expense error:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

const downloadExpenseExcel = async (req, res) => {
    const userId = req.user.id;
    try {
        const expense = await expenseModel.find({ userId }).sort({ date: -1 }).lean();

        const data = expense.map((item) => ({
            Category: item.category,
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