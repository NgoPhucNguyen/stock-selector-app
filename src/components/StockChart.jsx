import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend);


export default function StockChart({ chartData, loading = false }) {

  if (!chartData || Object.keys(chartData).length === 0) {
    return <p className="alert alert-warning">Chưa có dữ liệu hiển thị.</p>;
  }

  // Tự động tạo labels (giả sử tất cả mã cổ phiếu có cùng ngày)
  const labels = chartData[Object.keys(chartData)[0]].map(point => point.date);

  const datasets = Object.entries(chartData).map(([symbol, data], index) => ({
    label: symbol,
    data: data.map(point => point.close),
    fill: false,
    borderColor: COLORS[index % COLORS.length],
    tension: 0.2,
  }));

  const data = { labels, datasets };

  return (
    <div className="card p-3" style={{maxWidth: "800px", width:"100%"}}>
      <h5 className="text-center text-uppercase">The Chart</h5>
      <Line data={data} />
    </div>
  );
}

const COLORS = [
  "rgb(255, 99, 132)",   // Red
  "rgb(54, 162, 235)",   // Blue
  "rgb(255, 206, 86)",   // Yellow
  "rgb(75, 192, 192)",   // Teal
  "rgb(153, 102, 255)",  // Purple
  "rgb(255, 159, 64)",   // Orange
];
