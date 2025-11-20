import "./incomes.css";
import { useEffect, useState, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { getTransactions } from "../api/transactions";
import { categories } from "../data/categories";
import { CurrencyContext } from "../context/CurrencyContext";

function Incomes() {
  const navigate = useNavigate();
  const location = useLocation();

  const { currency } = useContext(CurrencyContext);

  const [incomes, setIncomes] = useState([]);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const menuItems = [
    { label: "🏠 Главная", path: "/dashboard" },
    { label: "💰 Баланс", path: "/balance" },
    { label: "📈 Доходы", path: "/incomes" },
    { label: "📉 Расходы", path: "/expenses" },
    { label: "📅 История", path: "/history" },
    { label: "⚙ Настройки", path: "/settings" },
  ];

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    getTransactions(token).then((res) => {
      const onlyIncome = res.data.filter((t) => t.type === "income");
      setIncomes(onlyIncome);
    });
  }, []);

  return (
    <div className="incomes-wrapper">
      
      {/* --- Сайдбар --- */}
      <aside className="sidebar">
        <h2 className="sidebar-title">FinanceFlow</h2>

        <nav className="sidebar-menu">
          {menuItems.map((item) => (
            <div
              key={item.path}
              className={
                "menu-item " + (location.pathname === item.path ? "active" : "")
              }
              onClick={() => navigate(item.path)}
            >
              {item.label}
            </div>
          ))}
        </nav>

        <button className="logout-btn" onClick={logout}>🔒 Выйти</button>
      </aside>

      {/* --- Контент --- */}
      <main className="incomes-content">
        <div className="incomes-card">
          <h1 className="title">📈 Доходы</h1>
          <p className="subtitle">Все поступления средств</p>

          <div className="table-wrapper">
            <table className="incomes-table">
              <thead>
                <tr>
                  <th>Категория</th>
                  <th>Сумма</th>
                  <th>Заметка</th>
                  <th>Дата</th>
                </tr>
              </thead>

              <tbody>
                {incomes.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="empty">
                      Доходов пока нет 😔
                    </td>
                  </tr>
                ) : (
                  incomes.map((t) => (
                    <tr key={t._id}>
                      <td>
                        {categories[t.category]?.icon}{" "}
                        {categories[t.category]?.label}
                      </td>

                      {/* 💰 Валюта работает */}
                      <td className="green">
                        +{t.amount} {currency}
                      </td>

                      <td>{t.note || "-"}</td>
                      <td>{new Date(t.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

        </div>
      </main>
    </div>
  );
}

export default Incomes;
