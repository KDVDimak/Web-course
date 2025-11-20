// financeflow-client/src/admin/AdminTransactions.jsx
import { useEffect, useState } from "react";
import api from "../api/api"; // <— используем единый axios instance
import "./admin.css";

function AdminTransactions() {
  const [tx, setTx] = useState([]);

  const loadTx = async () => {
    try {
      const res = await api.get("/admin/transactions");
      setTx(res.data);
    } catch (err) {
      console.error(err);
      alert("Ошибка загрузки транзакций");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Удалить транзакцию?")) return;

    try {
      await api.delete(`/admin/transactions/${id}`);
      loadTx();
    } catch (err) {
      console.error(err);
      alert("Ошибка удаления транзакции");
    }
  };

  useEffect(() => {
    loadTx();
  }, []);

  return (
    <div className="admin-page">
      <h1 className="admin-title">Все транзакции</h1>

      <table className="admin-table">
        <thead>
          <tr>
            <th>Пользователь</th>
            <th>Сумма</th>
            <th>Тип</th>
            <th>Категория</th>
            <th>Дата</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {tx.map((t) => (
            <tr key={t._id}>
              <td>{t.user?.email || "—"}</td>
              <td>{t.amount}</td>
              <td>{t.type}</td>
              <td>{t.category}</td>
              <td>{new Date(t.createdAt).toLocaleDateString()}</td>
              <td>
                <button
                  className="admin-delete-btn"
                  onClick={() => handleDelete(t._id)}
                >
                  🗑 Удалить
                </button>
              </td>
            </tr>
          ))}

          {tx.length === 0 && (
            <tr>
              <td colSpan="6" className="admin-empty">
                Нет транзакций
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default AdminTransactions;
