import "./history.css";
import { useEffect, useState, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { getTransactions } from "../api/transactions";
import { categories } from "../data/categories";
import { CurrencyContext } from "../context/CurrencyContext";

function History() {
  const navigate = useNavigate();
  const location = useLocation();

  const { currency } = useContext(CurrencyContext);

  const [transactions, setTransactions] = useState([]);
  const [filtered, setFiltered] = useState([]);

  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

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

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    getTransactions(token).then((res) => {
      const sorted = res.data.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
      setTransactions(sorted);
      setFiltered(sorted);
    });
  }, []);

  useEffect(() => {
    let temp = [...transactions];

    if (search.trim() !== "") {
      temp = temp.filter((t) =>
        t.note?.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (typeFilter !== "all") {
      temp = temp.filter((t) => t.type === typeFilter);
    }

    if (categoryFilter !== "all") {
      temp = temp.filter((t) => t.category === categoryFilter);
    }

    if (dateFrom) {
      temp = temp.filter(
        (t) => new Date(t.createdAt) >= new Date(dateFrom)
      );
    }

    if (dateTo) {
      temp = temp.filter(
        (t) => new Date(t.createdAt) <= new Date(dateTo + "T23:59:59")
      );
    }

    if (sortBy === "newest") {
      temp.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }
    if (sortBy === "oldest") {
      temp.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    }
    if (sortBy === "amountAsc") {
      temp.sort((a, b) => Number(a.amount) - Number(b.amount));
    }
    if (sortBy === "amountDesc") {
      temp.sort((a, b) => Number(b.amount) - Number(a.amount));
    }

    setFiltered(temp);
  }, [search, typeFilter, categoryFilter, dateFrom, dateTo, sortBy, transactions]);

  return (
    <div className="history-wrapper">

      {/* ---- Сайдбар ---- */}
      <aside className="sidebar">
        <h2 className="sidebar-title">FinanceFlow</h2>

        <nav className="sidebar-menu">
          {menuItems.map((item) => (
            <div
              key={item.path}
              className={`menu-item ${location.pathname === item.path ? "active" : ""}`}
              onClick={() => navigate(item.path)}
            >
              {item.label}
            </div>
          ))}
        </nav>

        <button className="logout-btn" onClick={logout}>🔒 Выйти</button>
      </aside>

      {/* ---- Контент ---- */}
      <main className="history-content">
        <div className="history-card">
          <h1 className="title">📅 История всех операций</h1>

          {/* Фильтры */}
          <div className="filters-grid">

            <input
              type="text"
              placeholder="🔍 Поиск по заметке..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
              <option value="all">Все типы</option>
              <option value="income">Доходы</option>
              <option value="expense">Расходы</option>
            </select>

            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option value="all">Все категории</option>
              {Object.keys(categories).map((key) => (
                <option key={key} value={key}>
                  {categories[key].icon} {categories[key].label}
                </option>
              ))}
            </select>

            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
            />

            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
            />

            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="newest">Сначала новые</option>
              <option value="oldest">Сначала старые</option>
              <option value="amountAsc">Сумма ↑</option>
              <option value="amountDesc">Сумма ↓</option>
            </select>
          </div>

          {/* Таблица */}
          <table className="history-table">
            <thead>
              <tr>
                <th>Категория</th>
                <th>Сумма</th>
                <th>Тип</th>
                <th>Заметка</th>
                <th>Дата</th>
              </tr>
            </thead>

            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan="5" className="empty">
                    Ничего не найдено 😔
                  </td>
                </tr>
              ) : (
                filtered.map((t) => (
                  <tr key={t._id}>
                    <td>
                      {categories[t.category]?.icon} {categories[t.category]?.label}
                    </td>

                    {/* 💰 валюта */}
                    <td>
                      {t.amount} {currency}
                    </td>

                    <td className={t.type === "income" ? "green" : "red"}>
                      {t.type === "income" ? "Доход" : "Расход"}
                    </td>

                    <td>{t.note || "-"}</td>
                    <td>{new Date(t.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}

export default History;
