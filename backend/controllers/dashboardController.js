import incomeModel from "../models/Income.js";
import expenseModel from "../models/Expense.js";
import { isValidObjectId, Types } from "mongoose";

const getDashboardData = async (req, res) => {
    try {
        const userId = req.user.id;
        const userObjectId = new Types.ObjectId(String(userId));

        const totalIncome = await incomeModel.aggregate([
            { $match: { userId: userObjectId } },
            { $group: { _id: null, totalIncome: { $sum: "$amount" } } },

        ])


        const totalExpense = await expenseModel.aggregate([
            { $match: { userId: userObjectId } },
            { $group: { _id: null, totalIncome: { $sum: "$amount" } } },

        ])

        const last60DaysIncomeTransactions = await incomeModel.find({
            userId: userObjectId,
            date: { $gte: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000) }
        }).sort({ date: -1 })

        const incomeLast60Days = last60DaysIncomeTransactions.reduce(
            (sum, transaction) => sum + transaction.amount, 0
        )
        const last30DaysExpenseTransactions = await expenseModel.find({
            userId: userObjectId,
            date: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
        }).sort({ date: -1 })
        const expenseLast30Days = last30DaysExpenseTransactions.reduce(
            (sum, transaction) => sum + transaction.amount, 0
        )

        const lastTransactions = [
            ...(await incomeModel.find({ userId }).sort({ date: -1 }).limit(5)).map(
                (txn) => ({
                    ...txn.toObject(),
                    type: "income"
                })
            ),
            ...(await expenseModel.find({ userId }).sort({ date: -1 }).limit(5)).map(
                (txn) => ({
                    ...txn.toObject(),
                    type: "expense"
                })
            )
        ].sort((a, b) => (b.date - a.date))
        const allTransactions = [
            ...(await incomeModel.find({ userId }).sort({ date: -1 })).map(
                (txn) => ({
                    ...txn.toObject(),
                    type: "income"
                })
            ),
            ...(await expenseModel.find({ userId }).sort({ date: -1 })).map(
                (txn) => ({
                    ...txn.toObject(),
                    type: "expense"
                })
            )
        ].sort((a, b) => (b.date - a.date))

        return res.json({
            success: true,
            totalBalance: (totalIncome[0]?.totalIncome || 0) - (totalExpense[0]?.totalIncome || 0),
            totalIncome: totalIncome[0]?.totalIncome || 0,
            totalExpenses: totalExpense[0]?.totalIncome || 0,
            last30DaysExpenses: {
                total: expenseLast30Days,
                transactions: last30DaysExpenseTransactions
            },
            last60DaysIncome: {
                total: incomeLast60Days,
                transactions: last60DaysIncomeTransactions
            },
            recentTransactions: lastTransactions,
            allTransactions: allTransactions
        })
    } catch (error) {
        res.json({ success: false, message: "Server Error", error })
        console.log(error)
    }
}
export { getDashboardData };