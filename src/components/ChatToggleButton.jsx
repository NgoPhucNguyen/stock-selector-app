import React from "react";

export default function ChatToggleButton({ onClick }) {
  return (
    <button
      className="btn btn-light rounded-circle position-fixed bottom-0 end-0 m-4 shadow d-flex align-items-center justify-content-center p-0"
      style={{ width: "60px", height: "60px", zIndex: 998 }}
      onClick={onClick}
      title="Tâm sự với chuyên gia"
    >
      <img
        src="/avatar.png"
        alt="Chatbot Avatar"
        style={{
          width: "100%",
          height: "100%",
          borderRadius: "50%",
          objectFit: "cover"
        }}
      />
    </button>
  );
}
