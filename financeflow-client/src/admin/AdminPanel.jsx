// financeflow-client/src/admin/AdminPanel.jsx
import { Link } from "react-router-dom";
import "./admin.css";

function AdminPanel() {
  return (
    <div className="admin-page">
      <h1 className="admin-title">Админ-панель</h1>
      <p className="admin-subtitle">
        Здесь можно просматривать пользователей и транзакции.
      </p>

      <div className="admin-cards">
        <Link to="/admin/users" className="admin-card">
          👤 Пользователи
        </Link>
        <Link to="/admin/transactions" className="admin-card">
          💳 Транзакции
        </Link>
      </div>
    </div>
  );
}

export default AdminPanel;
