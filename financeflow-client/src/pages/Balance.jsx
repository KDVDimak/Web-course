import { useEffect, useState, useContext } from "react";
import { CurrencyContext } from "../context/CurrencyContext";
import { getTransactions } from "../api/transactions";
import "./balance.css";
import { categories } from "../data/categories";
import { Pie } from "react-chartjs-2";

function Balance() {
  const { currency } = useContext(CurrencyContext);

  const [transactions, setTransactions] = useState([]);
  const [stats, setStats] = useState({
    income: 0,
    expense: 0,
    balance: 0,
  });

  const load = () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    getTransactions(token).then((res) => {
      const data = res.data;
      setTransactions(data);

      const income = data.filter(t => t.type === "income")
                         .reduce((s, t) => s + Number(t.amount), 0);

      const expense = data.filter(t => t.type === "expense")
                          .reduce((s, t) => s + Number(t.amount), 0);

      setStats({
        income,
        expense,
        balance: income - expense,
      });
    });
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="page-container balance-page">
      <h1 className="balance-title">💰 Баланс</h1>

      <div className="balance-cards">
        <div className="balance-card income">
          <h3>Доходы</h3>
          <p>+{stats.income} {currency}</p>
        </div>

        <div className="balance-card expense">
          <h3>Расходы</h3>
          <p>-{stats.expense} {currency}</p>
        </div>

        <div className="balance-card total">
          <h3>Итоговый баланс</h3>
          <p>{stats.balance} {currency}</p>
        </div>
      </div>

      <h2 className="recent-title">Последние операции</h2>

      <div className="recent-list">
        {transactions.slice(0, 5).map(t => (
          <div className="recent-item" key={t._id}>
            <div className="recent-left">
              {categories[t.category]?.icon}
              <span>{categories[t.category]?.label}</span>
            </div>

            <div className={`recent-amount ${t.type === "income" ? "green" : "red"}`}>
              {t.type === "income" ? "+" : "-"}
              {t.amount} {currency}
            </div>

            <div className="recent-date">
              {new Date(t.createdAt).toLocaleDateString()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Balance;
