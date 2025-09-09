import express from 'express';
import protect from '../middlewares/authMiddleware.js';
import { addExpense, deleteExpense, downloadExpenseExcel, getAllExpense } from '../controllers/expenseController.js';

const Exprouter = express.Router();

Exprouter.post("/add", protect, addExpense);
Exprouter.get("/get", protect, getAllExpense);
Exprouter.get("/downloadexcel", protect, downloadExpenseExcel);
Exprouter.delete("/:id", protect, deleteExpense);
export default Exprouter;