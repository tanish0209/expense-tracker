import express from 'express';
import protect from '../middlewares/authMiddleware.js';
import { addIncome, deleteIncome, downloadIncomeExcel, getAllIncome } from '../controllers/incomeController.js';
const Incrouter = express.Router();

Incrouter.post("/add", protect, addIncome);
Incrouter.get("/get", protect, getAllIncome);
Incrouter.get("/downloadexcel", protect, downloadIncomeExcel);
Incrouter.delete("/delete/:id", protect, deleteIncome);
export default Incrouter;