import React, { useState, useEffect } from "react";
import "./Chatbox.css";
import { Title } from "chart.js";

const DEFAULT_PROMPT = `
Bạn là một chuyên gia tài chính giỏi nhất thị trường. 
Trả lời lịch sự, nghiêm túc và đưa ra phân tích rõ ràng dựa trên dữ liệu cổ phiếu, xu hướng, tin tức và yếu tố kinh tế. 
Không nói lan man, hãy kết luận rõ có nên mua/bán hay giữ cổ phiếu.
`;

export default function Chatbox({ onClose }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ Load lịch sử từ localStorage khi mở Chatbox
  useEffect(() => {
    const saved = localStorage.getItem("chat_history");
    if (saved) {
      setMessages(JSON.parse(saved));
    } else {
      setMessages([
        { role: "system", content: DEFAULT_PROMPT },
        { role: "assistant", content: "Chào bạn, tôi có thể giúp gì về cổ phiếu hôm nay?" },
      ]);
    }
  }, []);

  // ✅ Tự động lưu vào localStorage mỗi khi messages thay đổi
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem("chat_history", JSON.stringify(messages));
    }
  }, [messages]);

  // ✅ Gửi tin nhắn
  const handleSend = async () => {
    if (!input.trim()) return;

    const newMessages = [...messages, { role: "user", content: input }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const userPrompt = `${DEFAULT_PROMPT}\n\n${input}`;
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/gemini-chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userPrompt }),
      });

      const data = await res.json();
      setMessages([...newMessages, { role: "assistant", content: data.reply }]);
    } catch (err) {
      setMessages([...newMessages, { role: "assistant", content: "⚠️ Lỗi khi gọi Gemini API." }]);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Reset cuộc trò chuyện
  const handleReset = () => {
    const initial = [
      { role: "system", content: DEFAULT_PROMPT },
      { role: "assistant", content: "Chào bạn, tôi có thể giúp gì về cổ phiếu hôm nay?" },
    ];
    setMessages(initial);
    localStorage.removeItem("chat_history");
  };

  return (
    <div className="chatbox card shadow position-fixed end-0 bottom-0 m-3" style={{ width: "350px", height: "500px", zIndex: 999 }}>
      <div className="card-header d-flex justify-content-between align-items-center">
        <div className="d-flex align-items-center">
          <img src="/avatar.png" alt="Bot Avatar" width="32" height="32" className="me-2 rounded-circle" />
          <strong>Chuyên Gia</strong>
        </div>
        <div>
          <button className="btn btn-sm btn-light me-2" onClick={handleReset}>⟲</button>
          <button className="btn btn-sm btn-light" onClick={onClose}>☓</button>
        </div>
      </div>

      <div className="card-body overflow-auto" style={{ maxHeight: "360px" }}>
        {messages.slice(1).map((msg, idx) => (
          <div key={idx} className={`mb-2 ${msg.role === "user" ? "text-end" : "text-start"}`}>
            <div className={`p-2 rounded ${msg.role === "user" ? "bg-primary text-white" : "bg-light"}`}>
              {msg.content}
            </div>
          </div>
        ))}
        {loading && <div className="text-muted small">Đang trả lời...</div>}
      </div>

      <div className="card-footer">
        <div className="input-group">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            type="text"
            className="form-control"
            placeholder="Nhập câu hỏi về cổ phiếu..."
          />
          <button className="btn btn-primary" onClick={handleSend}>Gửi</button>
        </div>
      </div>
    </div>
  );
}
