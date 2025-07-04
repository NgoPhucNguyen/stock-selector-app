import React from "react";
import "./LoadingOverlay.css"; // optional: style đẹp hơn

const LoadingOverlay = ({ message = "Đang tải dữ liệu..." }) => {
  return (
    <div className="loading-overlay">
      <div className="spinner-border text-primary" role="status" />
      <div className="mt-3 text-dark fw-bold">{message}</div>
    </div>
  );
};

export default LoadingOverlay;
