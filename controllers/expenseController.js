import Expense from "../models/Expense.js";

// ================= GET ALL EXPENSES =================
export const getExpenses = async (req, res) => {
  try {
    // only fetch logged-in user's expenses
    const expenses = await Expense.find({ user: req.user._id });

    res.json(expenses);

  } catch (err) {
    res.status(500).json({ message: "Failed to fetch expenses" });
  }
};

// ================= ADD EXPENSE =================
export const addExpense = async (req, res) => {
  try {
    const { title, amount, category } = req.body;

    const newExpense = await Expense.create({
      title,
      amount,
      category,
      user: req.user._id // 🔐 attach user
    });

    res.json(newExpense);

  } catch (err) {
    res.status(500).json({ message: "Failed to add expense" });
  }
};

// ================= DELETE ONE =================
export const deleteExpense = async (req, res) => {
  try {
    await Expense.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id // 🔐 only delete own expense
    });

    res.json({ message: "Deleted successfully" });

  } catch (err) {
    res.status(500).json({ message: "Delete failed" });
  }
};

// ================= CLEAR ALL =================
export const clearExpenses = async (req, res) => {
  try {
    await Expense.deleteMany({ user: req.user._id });

    res.json({ message: "All expenses cleared" });

  } catch (err) {
    res.status(500).json({ message: "Clear failed" });
  }
};