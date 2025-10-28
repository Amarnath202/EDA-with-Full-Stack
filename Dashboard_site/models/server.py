# server.py
from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import pickle
import numpy as np
import os

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# ===============================
# Paths
# ===============================
base_path = os.path.dirname(__file__)

# Model
model_path = os.path.join(base_path, "crop_price_model.pkl")

# Encoders
state_enc_path = os.path.join(base_path, "State_encoder.pkl")
district_enc_path = os.path.join(base_path, "District_encoder.pkl")
season_enc_path = os.path.join(base_path, "Season_encoder.pkl")
crop_enc_path = os.path.join(base_path, "Crop_encoder.pkl")

# ===============================
# Load model and encoders
# ===============================
model = joblib.load(model_path)

with open(state_enc_path, "rb") as f:
    state_encoder = pickle.load(f)
with open(district_enc_path, "rb") as f:
    district_encoder = pickle.load(f)
with open(season_enc_path, "rb") as f:
    season_encoder = pickle.load(f)
with open(crop_enc_path, "rb") as f:
    crop_encoder = pickle.load(f)

# ===============================
# Prediction endpoint
# ===============================
@app.route("/predict", methods=["POST"])
def predict():
    try:
        data = request.get_json()

        state = data.get("state", "").strip()
        district = data.get("district", "").strip()
        season = data.get("season", "").strip()
        crop = data.get("crop", "").strip()
        production = float(data.get("production", 0))
        zn = float(data.get("zn", 0))
        fe = float(data.get("fe", 0))

        # Encode categorical values
        try:
            state_enc = state_encoder.transform([state])[0]
            district_enc = district_encoder.transform([district])[0]
            season_enc = season_encoder.transform([season])[0]
            crop_enc = crop_encoder.transform([crop])[0]
        except ValueError:
            return jsonify({"error": "One or more inputs not found in training data."}), 400

        # Prepare input array
        X_new = np.array([[state_enc, district_enc, season_enc, crop_enc, production, zn, fe]])

        # Predict
        predicted_price_quintal = float(model.predict(X_new)[0])  # Convert to Python float
        predicted_price_kg = predicted_price_quintal / 100
        predicted_price_tonne = predicted_price_quintal * 10

        return jsonify({
            "predicted_price_quintal": predicted_price_quintal,
            "predicted_price_kg": predicted_price_kg,
            "predicted_price_tonne": predicted_price_tonne
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500


# ===============================
# Run server
# ===============================
if __name__ == "__main__":
    app.run(debug=True, port=5001)
