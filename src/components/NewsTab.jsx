import React from "react";
import { Tab, Tabs } from "react-bootstrap";

export default function NewsTabs({ newsData }) {
  if (!newsData || Object.keys(newsData).length === 0) return null;

  const symbols = Object.keys(newsData);

  return (
    <div className="mt-4">
      <h4>Tin Tức Liên Quan</h4>
      <Tabs
        defaultActiveKey={symbols[0]}
        id="news-tabs"
        key={symbols.join("-")} // 🔁 Remount tab mỗi khi symbols đổi
      >
        {symbols.map((symbol) => (
          <Tab eventKey={symbol} title={symbol} key={symbol}>
            <ul className="list-group mt-3">
              {newsData[symbol]
                .sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt))
                .map((a, i) => (
                  <li key={i} className="list-group-item">
                    <a href={a.url} target="_blank" rel="noopener noreferrer">
                      {a.title}
                    </a>
                    <div className="text-muted small">
                      {a.source} – {new Date(a.publishedAt).toLocaleString()} {" | "}
                      <strong className={
                        a.sentiment === "Positive" ? "text-success" :
                        a.sentiment === "Negative" ? "text-danger" :
                        "text-secondary"
                      }>
                        {a.sentiment === "Positive" && "👍 "}
                        {a.sentiment === "Negative" && "👎 "}
                        {a.sentiment === "Neutral" && "😐 "}
                        {a.sentiment}
                      </strong>
                    </div>
                  </li>
                ))}
            </ul>
          </Tab>
        ))}
      </Tabs>
    </div>
  );
}
