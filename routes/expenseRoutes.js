import express from "express";
import {
  getExpenses,
  addExpense,
  deleteExpense,
  clearExpenses
} from "../controllers/expenseController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// 🔐 Protect ALL routes
router.use(protect);

// routes
router.get("/", getExpenses);
router.post("/", addExpense);
router.delete("/:id", deleteExpense);
router.delete("/", clearExpenses);

export default router;