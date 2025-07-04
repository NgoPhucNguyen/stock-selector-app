import React from "react";
import { FaChartLine, FaBrain, FaNewspaper } from "react-icons/fa";

export default function Sidebar({ activeSection }) {
  const iconStyle = (id) => ({
    color: activeSection === id ? "#00d1ff" : "#fff",
    transition: "color 0.3s",
  });

  return (
    <div
      className="d-flex flex-column align-items-center bg-dark text-white position-fixed"
      style={{ width: "60px", height: "100vh", top: 0, left: 0, zIndex: 1000 }}
    >
      <a href="#chart" className="my-3" title="Tạo biểu đồ">
        <FaChartLine size={24} style={iconStyle("chart")} />
      </a>
      <a href="#predict" className="my-3" title="Dự đoán">
        <FaBrain size={24} style={iconStyle("predict")} />
      </a>
      <a href="#news" className="my-3" title="Tin tức">
        <FaNewspaper size={24} style={iconStyle("news")} />
      </a>
    </div>
  );
}
