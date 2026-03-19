import { spawn } from "child_process";

export const getPrediction = (req, res) => {
  const expenses = req.body;

  // -----------------------------
  // 1️⃣ Sort by date
  // -----------------------------
  expenses.sort((a, b) => new Date(a.date) - new Date(b.date));

  // -----------------------------
  // 2️⃣ Group by DAY (important fix)
  // -----------------------------
  const dayMap = {};

  expenses.forEach(e => {
    const day = new Date(e.date).getDate();
    dayMap[day] = (dayMap[day] || 0) + e.amount;
  });

  // Convert to arrays
  const days = Object.keys(dayMap).map(Number);
  const amounts = Object.values(dayMap);

  // -----------------------------
  // 3️⃣ Handle LOW DATA case
  // -----------------------------
  if (days.length < 2) {
    return res.json({
      predicted_spending: amounts[0] || 0
    });
  }

  // -----------------------------
  // 4️⃣ Call Python ML
  // -----------------------------
  const py = spawn("python", ["ml/predict.py"]);

  const input = JSON.stringify({ days, amounts });
  py.stdin.write(input);
  py.stdin.end();

  let result = "";

  py.stdout.on("data", (data) => {
    result += data.toString();
  });

  py.stderr.on("data", (data) => {
    console.error("Python Error:", data.toString());
  });

  // -----------------------------
  // 5️⃣ Send result
  // -----------------------------
  py.on("close", () => {
    try {
      const output = JSON.parse(result);

      res.json({
        predicted_spending: Math.round(output.predicted_total)
      });
    } catch (err) {
      console.error("Parsing Error:", err);
      res.status(500).json({ error: "Prediction failed" });
    }
  });
};