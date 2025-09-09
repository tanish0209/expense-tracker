import xlsx from "xlsx"
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
            icon, category, amount, date: new Date(date)
        });
        await newExpense.save();
        res.json({ success: true, newExpense });
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: "Server Error" });
    }
};

const getAllExpense = async (req, res) => {
    const userId = req.user.id;
    try {
        const expense = await expenseModel.find({ userId }).sort({ date: -1 });
        res.json({ success: true, expense })
    } catch (error) {
        res.json({ success: false, message: "Server Error" });
    }
};

const deleteExpense = async (req, res) => {

    try {
        await expenseModel.findByIdAndDelete(req.params.id);
        res.json({ success: true, message: "Expense Deleted Successfully" })
    } catch (error) {
        res.json({ success: false, message: "Server Error" });
    }
};

const downloadExpenseExcel = async (req, res) => {
    const userId = req.user.id;
    try {
        const expense = await expenseModel.find({ userId }).sort({ date: -1 });

        const data = expense.map((item) => ({
            Category: item.category,
            Amount: item.amount,
            Date: item.date
        }));
        const wb = xlsx.utils.book_new();
        const ws = xlsx.utils.json_to_sheet(data);
        xlsx.utils.book_append_sheet(wb, ws, "Expense");
        xlsx.writeFile(wb, 'expense_details.xlsx');
        res.download("expense_details.xlsx")
    } catch (error) {
        res.json({ success: false, message: "Server Error" });
    }
};

export { addExpense, getAllExpense, deleteExpense, downloadExpenseExcel };