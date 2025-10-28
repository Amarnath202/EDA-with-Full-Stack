# ===============================
# STEP 1 — Import libraries
# ===============================
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics import r2_score, mean_squared_error
from xgboost import XGBRegressor
import joblib
import pickle
import os

# ===============================
# STEP 2 — Load dataset
# ===============================
# CSV is inside the same folder as this script
csv_path = os.path.join(os.path.dirname(__file__), "bigdata.csv")
df = pd.read_csv(csv_path)

# Clean column names (remove quotes and extra spaces)
df.columns = df.columns.str.strip().str.replace("'", "")

# Drop rows with missing values in selected columns
df = df.dropna(subset=['Modal_Price', 'State', 'District', 'Season', 'Crop', 'Production', 'Zn', 'Fe'])

# ===============================
# STEP 3 — Feature selection
# ===============================
features = ['State', 'District', 'Season', 'Crop', 'Production', 'Zn', 'Fe']
target = 'Modal_Price'

X = df[features]
y = df[target]

# ===============================
# STEP 4 — Encode categorical features
# ===============================
encoders = {}
for col in ['State', 'District', 'Season', 'Crop']:
    le = LabelEncoder()
    X[col] = le.fit_transform(X[col])
    encoders[col] = le

# ===============================
# STEP 5 — Split the dataset
# ===============================
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# ===============================
# STEP 6 — Train XGBoost model
# ===============================
model = XGBRegressor(
    n_estimators=300,
    learning_rate=0.1,
    max_depth=6,
    subsample=0.8,
    colsample_bytree=0.8,
    random_state=42
)
model.fit(X_train, y_train)

# ===============================
# STEP 7 — Evaluate model
# ===============================
y_pred = model.predict(X_test)
r2 = r2_score(y_test, y_pred)
rmse = np.sqrt(mean_squared_error(y_test, y_pred))
print(f"✅ Model trained successfully!")
print(f"R² Score: {r2:.3f}")
print(f"RMSE: {rmse:.2f}")

# ===============================
# STEP 8 — Save model and encoders
# ===============================
joblib.dump(model, "crop_price_model.pkl")
print("✅ Model saved as crop_price_model.pkl")

for name, encoder in encoders.items():
    with open(f"{name}_encoder.pkl", "wb") as f:
        pickle.dump(encoder, f)
        print(f"✅ Saved encoder: {name}_encoder.pkl")

print("\nAll model assets saved successfully!")
