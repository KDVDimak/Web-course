import { useEffect } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import "./TopUpSuccess.css";

export default function TopUpSuccess() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    const params = new URLSearchParams(location.search);
    let session_id = params.get("session_id")?.trim();

    if (!session_id) {
      console.error("session_id отсутствует!");
      return;
    }

    session_id = session_id.replace(/[^a-zA-Z0-9_]/g, "");

    if (!session_id) {
      console.error("session_id стал пустым после очистки!");
      return;
    }

    axios
      .post(
        "https://financeflow-server-029q.onrender.com/api/payment/confirm",
        { session_id },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then((res) => {
        console.log("Пополнение подтверждено:", res.data);

        localStorage.setItem("forceReload", Date.now());

        setTimeout(() => navigate("/dashboard"), 2000);
      })
      .catch((err) => {
        console.error("Ошибка:", err);
        alert("Ошибка подтверждения оплаты");
      });
  }, [location, navigate]);

  return (
    <div className="success-container">
      <div className="success-icon">✔</div>
      <h1>Платёж успешно проведён!</h1>
      <p>Обновляем данные…</p>
    </div>
  );
}

