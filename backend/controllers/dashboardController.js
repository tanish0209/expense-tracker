import incomeModel from "../models/Income.js";
import expenseModel from "../models/Expense.js";
import Account from "../models/Account.js";
import { Types } from "mongoose";

const getDashboardData = async (req, res) => {
    try {
        const userId = req.user.id;
        const userObjectId = new Types.ObjectId(String(userId));
        const SixtyDaysAgo = new Date(Date.now() - 60 * 24 * 60 * 60 * 1000);
        const ThirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

        // Execute queries in parallel for ultra-fast response times
        const [
            totalIncomeRes,
            totalExpenseRes,
            last60DaysIncomeTransactions,
            last30DaysExpenseTransactions,
            recentIncomeList,
            recentExpenseList,
            allIncomeList,
            allExpenseList,
            userAccountsRaw
        ] = await Promise.all([
            incomeModel.aggregate([
                { $match: { userId: userObjectId } },
                { $group: { _id: null, totalIncome: { $sum: "$amount" } } }
            ]),
            expenseModel.aggregate([
                { $match: { userId: userObjectId } },
                { $group: { _id: null, totalIncome: { $sum: "$amount" } } }
            ]),
            incomeModel.find({
                userId: userObjectId,
                date: { $gte: SixtyDaysAgo }
            }).sort({ date: -1 }).lean(),
            expenseModel.find({
                userId: userObjectId,
                date: { $gte: ThirtyDaysAgo }
            }).sort({ date: -1 }).lean(),
            incomeModel.find({ userId: userObjectId }).sort({ date: -1 }).limit(5).lean(),
            expenseModel.find({ userId: userObjectId }).sort({ date: -1 }).limit(5).lean(),
            incomeModel.find({ userId: userObjectId }).sort({ date: -1 }).lean(),
            expenseModel.find({ userId: userObjectId }).sort({ date: -1 }).lean(),
            Account.find({ userId: userObjectId }).sort({ isDefault: -1, createdAt: 1 }).lean()
        ]);

        let accounts = userAccountsRaw || [];
        if (accounts.length === 0) {
            accounts = await Account.insertMany([
                {
                    userId: userObjectId,
                    name: "Main Savings Bank",
                    type: "savings",
                    balance: 0,
                    icon: "🏦",
                    color: "from-indigo-600 to-blue-700",
                    isDefault: true,
                },
                {
                    userId: userObjectId,
                    name: "Cash Wallet",
                    type: "cash",
                    balance: 0,
                    icon: "💵",
                    color: "from-emerald-600 to-teal-700",
                    isDefault: false,
                },
            ]);
        }

        // Calculate Net Liquid Balance (Cash + Salary + Checking + Wallet, strictly excluding savings & investments)
        let totalLiquidBalance = 0;
        accounts.forEach((acc) => {
            const type = (acc.type || "").toLowerCase();
            const name = (acc.name || "").toLowerCase();
            const isLiquid =
                type === "cash" ||
                type === "wallet" ||
                type === "salary" ||
                type === "checking" ||
                name.includes("cash") ||
                name.includes("salary") ||
                name.includes("wallet") ||
                name.includes("checking");
            const isExcluded =
                (type === "savings" && !name.includes("salary")) ||
                type === "credit" ||
                type === "crypto" ||
                type === "investment";

            if (isLiquid && !isExcluded) {
                totalLiquidBalance += Number(acc.balance || 0);
            }
        });

        const totalIncomeVal = totalIncomeRes[0]?.totalIncome || 0;
        const totalExpenseVal = totalExpenseRes[0]?.totalIncome || 0;

        const incomeLast60Days = last60DaysIncomeTransactions.reduce(
            (sum, transaction) => sum + transaction.amount, 0
        );

        const expenseLast30Days = last30DaysExpenseTransactions.reduce(
            (sum, transaction) => sum + transaction.amount, 0
        );

        const lastTransactions = [
            ...recentIncomeList.map(txn => ({ ...txn, type: "income" })),
            ...recentExpenseList.map(txn => ({ ...txn, type: "expense" }))
        ].sort((a, b) => new Date(b.date) - new Date(a.date));

        const allTransactions = [
            ...allIncomeList.map(txn => ({ ...txn, type: "income" })),
            ...allExpenseList.map(txn => ({ ...txn, type: "expense" }))
        ].sort((a, b) => new Date(b.date) - new Date(a.date));

        return res.json({
            success: true,
            totalBalance: totalLiquidBalance,
            totalIncome: totalIncomeVal,
            totalExpenses: totalExpenseVal,
            accounts: accounts,
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
        });
    } catch (error) {
        console.error("Dashboard controller error:", error);
        return res.status(500).json({ success: false, message: "Server Error", error: error.message });
    }
};

export { getDashboardData };