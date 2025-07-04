import React from "react";

const StockCard = ({ symbol, name }) => {
  const price = (Math.random() * 100 + 100).toFixed(2);
  const change = (Math.random() * 4 - 2).toFixed(2);
  const isPositive = parseFloat(change) >= 0;

  return (
    <div className="card">
      <div className="card-header">
        <strong>{symbol}</strong> - {name}
      </div>
      <div className="card-body">
        <p className="card-text">Giá: ${price}</p>
        <p className={`card-text ${isPositive ? "text-success" : "text-danger"}`}>
          {isPositive ? "▲" : "▼"} {change}%
        </p>
        <button className="btn btn-success w-100">Dự đoán</button>
      </div>
    </div>
  );
};

export default StockCard;
