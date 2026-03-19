import sys
import json
import numpy as np
from sklearn.linear_model import LinearRegression

# -----------------------------
# STEP 1: Read data
# -----------------------------
data = json.loads(sys.stdin.read())

days = np.array(data["days"]).reshape(-1, 1)
amounts = np.array(data["amounts"])

# -----------------------------
# STEP 2: Convert to cumulative
# -----------------------------
cumulative = np.cumsum(amounts)

# -----------------------------
# STEP 3: Train model
# -----------------------------
model = LinearRegression()
model.fit(days, cumulative)

# -----------------------------
# STEP 4: Predict total at day 30
# -----------------------------
prediction = model.predict([[30]])

# -----------------------------
# STEP 5: Return result
# -----------------------------
result = {
    "predicted_total": round(float(prediction[0]), 2)
}

print(json.dumps(result))