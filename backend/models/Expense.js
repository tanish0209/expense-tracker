import mongoose from "mongoose";

const ExpenseSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    icon: { type: String },
    category: { type: String, required: true },
    amount: { type: Number, rerquired: true },
    date: { type: Date, default: Date.now }
}, { timestamps: true })

const expenseModel = mongoose.models.expense || mongoose.model("expense", ExpenseSchema);
export default expenseModel;