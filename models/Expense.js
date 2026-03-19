// -----------------------------
// Import mongoose
// -----------------------------
import mongoose from "mongoose";

// -----------------------------
// Create Expense Schema
// -----------------------------
const expenseSchema = new mongoose.Schema({

  // 🔐 Link expense to a specific user
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  // expense title
  title: {
    type: String,
    required: true
  },

  // amount spent
  amount: {
    type: Number,
    required: true
  },

  // category like Food / Transport
  category: {
    type: String,
    required: true
  },

  // date of expense
  date: {
    type: Date,
    default: Date.now
  }

});

// -----------------------------
// Create Expense Model
// -----------------------------
const Expense = mongoose.model("Expense", expenseSchema);

// -----------------------------
// Export model
// -----------------------------
export default Expense;