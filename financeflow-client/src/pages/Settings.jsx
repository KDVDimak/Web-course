import "./settings.css";
import { useNavigate, useLocation } from "react-router-dom";
import { useState, useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";
import { CurrencyContext } from "../context/CurrencyContext";

function Settings() {
  const navigate = useNavigate();
  const location = useLocation();

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const { theme, toggleTheme } = useContext(ThemeContext);
  const { currency, setCurrency } = useContext(CurrencyContext);

  const [name, setName] = useState(user.name || "");
  const [email, setEmail] = useState(user.email || "");

  const menuItems = [
    { label: "🏠 Главная", path: "/dashboard" },
    { label: "💰 Баланс", path: "/balance" },
    { label: "📈 Доходы", path: "/incomes" },
    { label: "📉 Расходы", path: "/expenses" },
    { label: "📅 История", path: "/history" },
    { label: "⚙ Настройки", path: "/settings" },
  ];

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const saveChanges = () => {
    const updated = { ...user, name, email };
    localStorage.setItem("user", JSON.stringify(updated));
    alert("Изменения сохранены!");
  };

  return (
    <div className="settings-wrapper">
      {/* sidebar */}
      <aside className="sidebar">
        <h2 className="sidebar-title">FinanceFlow</h2>

        <nav className="sidebar-menu">
          {menuItems.map((item) => (
            <div
              key={item.path}
              className={
                "menu-item " +
                (location.pathname === item.path ? "active" : "")
              }
              onClick={() => navigate(item.path)}
            >
              {item.label}
            </div>
          ))}
        </nav>

        <button className="logout-btn" onClick={logout}>🔒 Выйти</button>
      </aside>

      {/* content */}
      <main className="page-container settings-content">
        <div className="settings-card">
          <h1 className="settings-title">⚙ Настройки</h1>

          {/* Имя */}
          <div className="form-group">
            <label>Ваше имя</label>
            <input
              type="text"
              value={name}
              placeholder="Введите имя"
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          {/* Email */}
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              placeholder="Введите email"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* Currency */}
          <div className="form-group">
            <label>Основная валюта</label>
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
            >
              <option value="₴">₴ — Гривна</option>
              <option value="$">$ — Доллар</option>
              <option value="€">€ — Евро</option>
              <option value="zł">zł — Злотый</option>
            </select>
          </div>

          <button className="save-btn" onClick={saveChanges}>
            💾 Сохранить изменения
          </button>

        </div>
      </main>
    </div>
  );
}

export default Settings;
