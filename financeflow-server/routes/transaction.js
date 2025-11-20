import express from "express";
import {
  addTransaction,
  getTransactions,
  updateTransaction,
  deleteTransaction
} from "../controllers/transactionController.js";

import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// Добавить транзакцию
router.post("/add", authMiddleware, addTransaction);

// Получить все транзакции
router.get("/", authMiddleware, getTransactions);

// Обновить транзакцию
router.put("/:id", authMiddleware, updateTransaction);

// Удалить транзакцию
router.delete("/:id", authMiddleware, deleteTransaction);

export default router;
