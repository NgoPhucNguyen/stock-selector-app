import React, { useState, useEffect } from "react";
import StockFilterDropdown from "./components/StockFilterDropdown";
import StockChart from "./components/StockChart";
import LoadingOverlay from "./components/LoadingOverlay";
import ChatToggleButton from "./components/ChatToggleButton";
import Chatbox from "./components/Chatbox";
import NewsTabs from "./components/NewsTab";
import StockPrediction from "./components/StockPrediction";
import Sidebar from "./components/Sidebar";

function App() {
  const [chartData, setChartData] = useState({});
  const [newsData, setNewsData] = useState({});
  const [loadingChart, setLoadingChart] = useState(false);
  const [loadingNews, setLoadingNews] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [activeSection, setActiveSection] = useState("chart");

  useEffect(() => {
    const sections = ["chart", "predict", "news"];
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
            break;
          }
        }
      },
      { threshold: 0.3 }
    );

    for (const id of sections) {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    handleFilterSubmit({ symbols: ["AAPL"], period: "1mo" });
  }, []);

const handleFilterSubmit = async ({ symbols, period }) => {
  setLoadingChart(true);
  setLoadingNews(true);
  setNewsData({});

  try {
    const chartRes = await fetch(`${import.meta.env.VITE_API_BASE_URL}/get-chart-data`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ symbols, period }),
    });

    const newsRes = await fetch(`${import.meta.env.VITE_API_BASE_URL}/get-news`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ symbols }),
    });

    const chartJson = await chartRes.json();
    const newsJson = await newsRes.json();

    setChartData(chartJson);

    const grouped = {};
    for (const article of newsJson) {
      if (!grouped[article.symbol]) grouped[article.symbol] = [];
      grouped[article.symbol].push(article);
    }
    setNewsData(grouped);

  } catch (err) {
    console.error("❌ Lỗi khi lấy dữ liệu:", err);
    alert("Đã có lỗi khi lấy dữ liệu từ server.");
  } finally {
    setLoadingChart(false);
    setLoadingNews(false);
  }
};


return (
  <div style={{ display: "flex", height: "100vh" }}>
    {/* ===== Sidebar cố định trái ===== */}
    <div style={{ width: "70px", background: "#111", minHeight: "100vh", position: "fixed" }}>
      <Sidebar activeSection={activeSection} />
    </div>

    {/* ===== Nội dung chính ===== */}
    <div
      style={{
        marginLeft: "60px",  // Chừa chỗ cho Sidebar
        flexGrow: 1,
        padding: "20px",
      }}
    >
      {(loadingChart || loadingNews) && (
        <LoadingOverlay message="Đang tải dữ liệu..." />
      )}

      <h1 className="mb-4 text-center">STOCK WEB</h1>

      {/* Biểu đồ */}
      <div id="chart">
        <StockFilterDropdown onFilterSubmit={handleFilterSubmit} />
        {Object.keys(chartData).length > 0 && (
          <div className="mt-5 d-flex justify-content-center">
            <StockChart chartData={chartData} />
          </div>
        )}
      </div>

      {/* Dự đoán */}
      <div id="predict" className="me-5" style={{ minHeight: "300px", paddingLeft: "30px"}}>
        <StockPrediction />
      </div>

      {/* Tin tức */}
      <div id="news" className="mt-5 d-flex justify-content-center" style={{paddingBottom: "30px"}}> 
        {Object.keys(newsData).length > 0 && <NewsTabs newsData={newsData} />}
      </div>

      {/* Chatbot */}
      {!showChat && <ChatToggleButton onClick={() => setShowChat(true)} />}
      {showChat && (
        <div
          style={{
            position: "fixed",
            bottom: "80px",
            right: "20px",
            zIndex: 999,
            width: "320px",
            height: "460px",
          }}
        >
          <Chatbox onClose={() => setShowChat(false)} />
        </div>
      )}
    </div>
  </div>
);

}

export default App;
