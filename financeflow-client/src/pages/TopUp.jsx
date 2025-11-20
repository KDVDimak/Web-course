import React, { useState } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import './TopUp.css';

function TopUp() {
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);

  const handleTopUp = async () => {
    const value = Number(amount);
    if (value <= 0) return alert("Введите корректную сумму");

    try {
      setLoading(true);

      const token = localStorage.getItem("token");
      const user = JSON.parse(localStorage.getItem("user"));

      const userId = user?.id;

      if (!userId) {
        alert("Ошибка: userId отсутствует");
        return;
      }

      const res = await axios.post(
  "https://financeflow-server-029q.onrender.com/api/payment/create-session",
  { amount: value, userId },
  { headers: { Authorization: `Bearer ${token}` } }
);


      if (res.data.url) window.location.href = res.data.url;

    } catch (err) {
      console.error(err);
      alert("Ошибка при создании оплаты");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-wrapper">
      <Sidebar />
      <main className="dashboard-content">

        <div className="topup-card">
          <h2>Пополнение баланса</h2>

          <input
            type="number"
            placeholder="Введите сумму"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />

          <button onClick={handleTopUp} disabled={loading}>
            {loading ? "Создание..." : "Пополнить"}
          </button>
        </div>

      </main>
    </div>
  );
}

export default TopUp;


