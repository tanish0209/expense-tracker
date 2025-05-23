import express from "express";
import cors from 'cors';
import "dotenv/config";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import incomeRoutes from './routes/incomeRoutes.js'
import expenseRoutes from "./routes/ExpenseRoutes.js"
import Dashrouter from "./routes/dashboardRoutes.js";

const app = express();
const PORT = process.env.PORT || 3000;
//Middlewares
app.use(express.json());
app.use(cors());
connectDB();
app.use("/api/v1/auth", authRoutes)
app.use("/api/v1/income", incomeRoutes)
app.use("/api/v1/expense", expenseRoutes)
app.use("/api/v1/dashboard", Dashrouter)

app.listen(PORT, () => console.log(`Server Running on port: ${PORT}`))