import "./dashboard.css";
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState, useContext } from "react";


import {
  getTransactions,
  updateTransaction,
  deleteTransaction,
} from "../api/transactions";

import ChartBlock from "../components/ChartBlock";
import MonthlyChart from "../components/MonthlyChart";
import EditModal from "../components/EditModal";
import { categories } from "../data/categories";
import { CurrencyContext } from "../context/CurrencyContext";

function Dashboard() {
  const navigate = useNavigate();
  const location = useLocation();

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const { currency } = useContext(CurrencyContext);

  const [transactions, setTransactions] = useState([]);
  const [filtered, setFiltered] = useState([]);

  const [stats, setStats] = useState({
    income: 0,
    expense: 0,
    balance: 0,
  });

  const [typeFilter, setTypeFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");

  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);

  const menuItems = [
  { label: "🏠 Главная", path: "/dashboard" },
  { label: "💰 Баланс", path: "/balance" },
  { label: "📈 Доходы", path: "/incomes" },
  { label: "📉 Расходы", path: "/expenses" },
  { label: "📅 История", path: "/history" },
  { label: "⚙️ Настройки", path: "/settings" },
  { label: "💳 Пополнить", path: "/topup" },

  
  ...(user.role === "admin"
    ? [
        { label: "🛠 Админ-панель", path: "/admin" },
        { label: "👥 Пользователи", path: "/admin/users" },
        { label: "💼 Транзакции", path: "/admin/transactions" },
      ]
    : []),
];


  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const loadTransactions = () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    getTransactions(token)
      .then((res) => {
        const data = res.data.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );

        setTransactions(data);
        setFiltered(data);

        const income = data
          .filter((t) => t.type === "income")
          .reduce((s, t) => s + Number(t.amount), 0);

        const expense = data
          .filter((t) => t.type === "expense")
          .reduce((s, t) => s + Number(t.amount), 0);

        setStats({
          income,
          expense,
          balance: income - expense,
        });
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    loadTransactions();
  }, []);

  useEffect(() => {
    const reload = () => loadTransactions();
    window.addEventListener("storage", reload);
    return () => window.removeEventListener("storage", reload);
  }, []);

  useEffect(() => {
    let temp = [...transactions];
    const now = new Date();

    if (typeFilter !== "all") temp = temp.filter((t) => t.type === typeFilter);

    if (dateFilter === "7") {
      temp = temp.filter(
        (t) => now - new Date(t.createdAt) <= 7 * 24 * 60 * 60 * 1000
      );
    }

    if (dateFilter === "30") {
      temp = temp.filter(
        (t) => now - new Date(t.createdAt) <= 30 * 24 * 60 * 60 * 1000
      );
    }

    if (dateFilter === "month") {
      temp = temp.filter((t) => {
        const d = new Date(t.createdAt);
        return (
          d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
        );
      });
    }

    setFiltered(temp);
  }, [typeFilter, dateFilter, transactions]);

  const openEdit = (t) => {
    setSelectedTransaction(t);
    setModalOpen(true);
  };

  const handleSave = async (updated) => {
    try {
      const token = localStorage.getItem("token");
      await updateTransaction(token, updated._id, updated);
      setModalOpen(false);
      loadTransactions();
    } catch (err) {
      alert("Ошибка обновления");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Удалить транзакцию?")) return;
    try {
      const token = localStorage.getItem("token");
      await deleteTransaction(token, id);
      loadTransactions();
    } catch (err) {
      alert("Ошибка удаления");
    }
  };

  return (


    <div className="dashboard-wrapper">
      {/* ---- Сайдбар (как у тебя было) ---- */}
      <aside className="sidebar">
        <h2 className="sidebar-title">FinanceFlow</h2>

        <nav className="sidebar-menu">

  {/* обычные пункты */}
  <div
    className={`menu-item ${location.pathname === "/dashboard" ? "active" : ""}`}
    onClick={() => navigate("/dashboard")}
  >
    🏠 Главная
  </div>

  <div
    className={`menu-item ${location.pathname === "/balance" ? "active" : ""}`}
    onClick={() => navigate("/balance")}
  >
    💰 Баланс
  </div>

  <div
    className={`menu-item ${location.pathname === "/incomes" ? "active" : ""}`}
    onClick={() => navigate("/incomes")}
  >
    📈 Доходы
  </div>

  <div
    className={`menu-item ${location.pathname === "/expenses" ? "active" : ""}`}
    onClick={() => navigate("/expenses")}
  >
    📉 Расходы
  </div>

  <div
    className={`menu-item ${location.pathname === "/history" ? "active" : ""}`}
    onClick={() => navigate("/history")}
  >
    📅 История
  </div>

  <div
    className={`menu-item ${location.pathname === "/settings" ? "active" : ""}`}
    onClick={() => navigate("/settings")}
  >
    ⚙️ Настройки
  </div>

  <div
    className={`menu-item ${location.pathname === "/topup" ? "active" : ""}`}
    onClick={() => navigate("/topup")}
  >
    💳 Пополнить
  </div>

  {/* заголовок — ВСЕГДА ПЕРЕД админ-пунктами */}
  {user.role === "admin" && (
    <p
      style={{
        marginTop: "25px",
        marginBottom: "10px",
        fontWeight: "bold",
        color: "#ccc",
        fontSize: "14px",
      }}
    >
      Администрирование
    </p>
  )}

  {/* админские пункты */}
  {user.role === "admin" && (
    <>
      <div
        className={`menu-item ${location.pathname === "/admin" ? "active" : ""}`}
        onClick={() => navigate("/admin")}
      >
        🛠 Админ-панель
      </div>

      <div
        className={`menu-item ${location.pathname === "/admin/users" ? "active" : ""}`}
        onClick={() => navigate("/admin/users")}
      >
        👥 Пользователи
      </div>

      <div
        className={`menu-item ${location.pathname === "/admin/transactions" ? "active" : ""}`}
        onClick={() => navigate("/admin/transactions")}
      >
        💼 Транзакции
      </div>
    </>
  )}
</nav>


        <button className="logout-btn" onClick={logout}>
          🔒 Выйти
        </button>
      </aside>

      {/* ---- Контент ---- */}
      <main className="dashboard-content">
        <div className="dashboard-card">
          <h1 className="dash-title">
            Добро пожаловать, {user.email}! 🎉
          </h1>
          <p className="dash-subtitle">Твой финансовый обзор</p>

          {/* статистика */}
          <div className="stats-row">
            <div className="stat-card income-card">
              <h3>Доходы</h3>
              <p className="value">
                +{stats.income} {currency}
              </p>
            </div>

            <div className="stat-card expense-card">
              <h3>Расходы</h3>
              <p className="value">
                -{stats.expense} {currency}
              </p>
            </div>

            <div className="stat-card balance-card">
              <h3>Баланс</h3>
              <p className="value">
                {stats.balance} {currency}
              </p>
            </div>
          </div>

          {/* фильтры */}
          <div className="filters-row">
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
            >
              <option value="all">Все типы</option>
              <option value="income">Доход</option>
              <option value="expense">Расход</option>
            </select>

            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
            >
              <option value="all">За всё время</option>
              <option value="7">Последние 7 дней</option>
              <option value="30">Последние 30 дней</option>
              <option value="month">Текущий месяц</option>
            </select>
          </div>

          {/* таблица */}
          <h2 className="history-title">История операций</h2>

          <div className="transactions-table">
            <table>
              <thead>
                <tr>
                  <th>Категория</th>
                  <th>Сумма</th>
                  <th>Тип</th>
                  <th>Заметка</th>
                  <th>Дата</th>
                  <th>Действия</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="empty-row">
                      Нет данных 😔
                    </td>
                  </tr>
                ) : (
                  filtered.map((t) => (
                    <tr key={t._id}>
                      <td>
                        {categories[t.category]?.icon}{" "}
                        {categories[t.category]?.label}
                      </td>
                      <td>
                        {t.amount} {currency}
                      </td>
                      <td className={t.type === "income" ? "green" : "red"}>
                        {t.type === "income" ? "Доход" : "Расход"}
                      </td>
                      <td>{t.note || "-"}</td>
                      <td>{new Date(t.createdAt).toLocaleDateString()}</td>
                      <td className="actions-cell">
                        <button className="edit-btn" onClick={() => openEdit(t)}>
  <svg xmlns="http://www.w3.org/2000/svg"
       width="20" height="20" viewBox="0 0 24 24" fill="white">
    <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25z"/>
    <path d="M20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34a1 1 0 00-1.41 0l-1.83 
             1.83 3.75 3.75 1.83-1.83z"/>
  </svg>
</button>

                        <button
                          className="delete-btn"
                          onClick={() => handleDelete(t._id)}
                        >
                          🗑
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* диаграммы */}
<div className="charts-row">
  <div className="chart-card">
    <ChartBlock transactions={filtered} />
  </div>

  <div className="chart-card">
    <MonthlyChart transactions={filtered} />
  </div>
</div>

        </div>
      </main>

      {/* модалка */}
      <EditModal
        open={isModalOpen}
        onClose={() => setModalOpen(false)}
        transaction={selectedTransaction}
        onSave={handleSave}
      />
    </div>
    
  );
}



export default Dashboard;
