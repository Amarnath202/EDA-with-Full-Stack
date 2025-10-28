import React, { useState } from "react";

const ModelsPage = () => {
  const [formData, setFormData] = useState({
    state: "",
    district: "",
    season: "",
    crop: "",
    production: "",
    zn: "",
    fe: "",
  });

  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setPrediction(null);

    try {
      const response = await fetch("http://localhost:5000/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setPrediction(data);
      } else {
        setError(data.error || "Server error");
      }
    } catch (err) {
      setError(err.message);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-slate-900 p-6 flex justify-center items-start">
      <div className="w-full max-w-3xl bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-8 shadow-lg">
        <h1 className="text-4xl font-bold text-white text-center mb-6">
          Crop Price Prediction
        </h1>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            name="state"
            placeholder="State"
            value={formData.state}
            onChange={handleChange}
            className="p-3 rounded-lg border border-white/30 bg-white/10 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
          <input
            name="district"
            placeholder="District"
            value={formData.district}
            onChange={handleChange}
            className="p-3 rounded-lg border border-white/30 bg-white/10 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
          <input
            name="season"
            placeholder="Season"
            value={formData.season}
            onChange={handleChange}
            className="p-3 rounded-lg border border-white/30 bg-white/10 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
          <input
            name="crop"
            placeholder="Crop"
            value={formData.crop}
            onChange={handleChange}
            className="p-3 rounded-lg border border-white/30 bg-white/10 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
          <input
            name="production"
            type="number"
            placeholder="Production (tonnes)"
            value={formData.production}
            onChange={handleChange}
            className="p-3 rounded-lg border border-white/30 bg-white/10 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
          <input
            name="zn"
            type="number"
            placeholder="Zinc (Zn)"
            value={formData.zn}
            onChange={handleChange}
            className="p-3 rounded-lg border border-white/30 bg-white/10 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
          <input
            name="fe"
            type="number"
            placeholder="Iron (Fe)"
            value={formData.fe}
            onChange={handleChange}
            className="p-3 rounded-lg border border-white/30 bg-white/10 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
         

          <button
            type="submit"
            className="col-span-1 md:col-span-2 bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 rounded-lg transition-all duration-300 shadow-lg"
          >
            {loading ? "Predicting..." : "Predict"}
          </button>
        </form>

        {error && <p className="text-red-400 mt-4 text-center">{error}</p>}

        {prediction && (
          <div className="mt-8 bg-white/20 backdrop-blur-md rounded-xl p-6 text-white shadow-inner">
            <h2 className="text-2xl font-bold mb-4 text-center">Predicted Price</h2>
            <p className="text-lg mb-2">Per Quintal: ₹{prediction.predicted_price_quintal.toFixed(2)}</p>
            <p className="text-lg mb-2">Per Tonne: ₹{prediction.predicted_price_tonne.toFixed(2)}</p>
            <p className="text-lg mb-2">Per Kg: ₹{prediction.predicted_price_kg.toFixed(2)}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ModelsPage;
