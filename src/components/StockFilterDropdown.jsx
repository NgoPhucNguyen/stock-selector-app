import React, { useState } from "react";

// Danh sách mã cổ phiếu và tên công ty
const stockList = [
  { symbol: "AAPL", name: "Apple Inc." },
  { symbol: "TSLA", name: "Tesla Inc." },
  { symbol: "GOOGL", name: "Alphabet Inc." },
  { symbol: "MSFT", name: "Microsoft Corp." },
  { symbol: "AMZN", name: "Amazon.com Inc." },
  { symbol: "META", name: "Meta Platforms" },
  { symbol: "NFLX", name: "Netflix Inc." },
  { symbol: "NVDA", name: "NVIDIA Corp." },
  { symbol: "BRK-B", name: "Berkshire Hathaway" },
];

// Thời gian
const timePresets = [
  { label: "7 ngày gần nhất", value: "7d" },
  { label: "1 tháng gần nhất", value: "1mo" },
  { label: "3 tháng gần nhất", value: "3mo" },
  { label: "6 tháng gần nhất", value: "6mo" },
  { label: "1 năm gần nhất", value: "1y" },
];

// Loại giá
const priceOptions = [
  { label: "Giá mở cửa", value: "Open" },
  { label: "Giá cao nhất", value: "High" },
  { label: "Giá thấp nhất", value: "Low" },
  { label: "Giá đóng cửa", value: "Close" },
  { label: "Giá điều chỉnh", value: "Adj Close" },
];

export default function StockFilterDropdown({ onFilterSubmit }) {
  const [selectedStocks, setSelectedStocks] = useState(["AAPL"]);
  const [selectedPeriod, setSelectedPeriod] = useState("1mo");
  const [selectedPrices, setSelectedPrices] = useState(["Close"]);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleStock = (symbol) => {
    setSelectedStocks((prev) =>
      prev.includes(symbol)
        ? prev.filter((s) => s !== symbol)
        : prev.length < 3
        ? [...prev, symbol]
        : prev
    );
  };

  const togglePrice = (price) => {
    setSelectedPrices((prev) =>
      prev.includes(price)
        ? prev.filter((p) => p !== price)
        : prev.length < 3
        ? [...prev, price]
        : prev
    );
  };

  const handleSubmit = () => {
    if (selectedStocks.length === 0) {
      alert("Vui lòng chọn ít nhất 1 mã cổ phiếu.");
      return;
    }
    if (selectedPrices.length === 0) {
      alert("Vui lòng chọn ít nhất 1 loại giá.");
      return;
    }

    onFilterSubmit({
      symbols: selectedStocks,
      period: selectedPeriod,
      price_fields: selectedPrices,
    });

    setDropdownOpen(false);
  };
// Reset 
  const handleReset = () => {
    setSelectedStocks([]);
    setSelectedPeriod([]);
    setSelectedPrices([]);
  };

  return (
    <div className="container text-center mt-4">
      <button className="btn btn-primary" onClick={() => setDropdownOpen(!dropdownOpen)}>
        📊 Bộ Lọc Cổ Phiếu
      </button>

      {dropdownOpen && (
        <div className="bg-white border rounded shadow p-4 mt-3 mx-auto" style={{ maxWidth: 960 }}>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5 className="m-0 text-uppercase">Bộ lọc cổ phiếu</h5>
            <button className="btn-close" onClick={() => setDropdownOpen(false)} />
          </div>

          <div className="row">
            {/* Mã cổ phiếu */}
            <div className="col-md-6 mb-4">
              <h6 className="text-uppercase">Chọn mã cổ phiếu (tối đa 3)</h6>
              {stockList.map(({ symbol, name }, idx) => (
                <div className="form-check text-start" key={idx}>
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id={`stock-${symbol}`}
                    checked={selectedStocks.includes(symbol)}
                    onChange={() => toggleStock(symbol)}
                    disabled={!selectedStocks.includes(symbol) && selectedStocks.length >= 3}
                  />
                  <label className="form-check-label" htmlFor={`stock-${symbol}`}>
                    <strong>{symbol}</strong> — {name}
                  </label>
                </div>
              ))}
            </div>

            {/* Thời gian và giá */}
            <div className="col-md-6">
              <h6 className="text-uppercase">Chọn thời gian</h6>
              <select
                className="form-select mb-3"
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
              >
                {timePresets.map((t, idx) => (
                  <option key={idx} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>

              <h6 className="text-uppercase">Loại giá (tối đa 3)</h6>
              <div className="row">
                {priceOptions.map((p, idx) => (
                  <div className="col-6" key={idx}>
                    <div className="form-check text-start">
                      <input
                        type="checkbox"
                        className="form-check-input"
                        id={`price-${p.value}`}
                        checked={selectedPrices.includes(p.value)}
                        onChange={() => togglePrice(p.value)}
                        disabled={!selectedPrices.includes(p.value) && selectedPrices.length >= 3}
                      />
                      <label className="form-check-label" htmlFor={`price-${p.value}`}>
                        {p.label}
                      </label>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 d-flex justify-content-between">
                <button onClick={handleReset} className="btn btn-dark w-45">
                  ⟲ Đặt Lại
                </button>
                <button onClick={handleSubmit} className="btn btn-success w-45">
                  📈 Tạo Biểu Đồ
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
