// src/components/StockPrediction.jsx
import React, { useState } from "react";

export default function StockPrediction() {
  const [symbol, setSymbol] = useState("");
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);

  const handlePredict = async () => {
    setLoading(true);
    setPrediction(null);
    try {
      const res = await fetch("http://localhost:5000/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ symbol }),
      });
      const data = await res.json();
      setPrediction(data);
    } catch (err) {
      alert("❌ Lỗi khi gọi API dự đoán");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-5" id="predict">
      <h4 className="mb-3">📈 Dự Đoán Giá Cổ Phiếu</h4>
      <div className="input-group mb-3" style={{ maxWidth: 400 }}>
        <input
          type="text"
          className="form-control"
          placeholder="Nhập mã cổ phiếu ... (ví dụ: AAPL)"
          value={symbol}
          onChange={(e) => setSymbol(e.target.value.toUpperCase())}
        />
        <button className="btn btn-primary" onClick={handlePredict} disabled={loading}>
          {loading ? "Đang dự đoán..." : "Dự đoán"}
        </button>
      </div>

      {prediction && (
        <div className="alert alert-info">
          <strong>Dự đoán:</strong> Giá tiếp theo cho {symbol} là <strong>${prediction.price}</strong>
        </div>
      )}
    </div>
  );
}
