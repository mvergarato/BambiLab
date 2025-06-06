// src/components/BuySong.jsx
import React, { useState } from "react";

const BuySong = ({ songId, userId }) => {
  const [message, setMessage] = useState("");

  const handleBuy = async () => {
    const response = await fetch("http://localhost:3000/api/purchases", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ songId, userId }),
    });

    const data = await response.json();
    if (response.ok) {
      setMessage("✅ Compra realizada con éxito");
    } else {
      setMessage("❌ Error: " + data.error);
    }
  };

  return (
    <div>
      <button onClick={handleBuy}>🛒 Comprar</button>
      <p>{message}</p>
    </div>
  );
};

export default BuySong;
