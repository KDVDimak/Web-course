// financeflow-client/src/admin/AdminUsersPanel.jsx
import { useEffect, useState } from "react";
import api from "../api/api";
import "./admin.css";

function AdminUsersPanel() {
  const [users, setUsers] = useState([]);

  const loadUsers = async () => {
    try {
      const res = await api.get("/admin/users");
      setUsers(res.data);
    } catch (err) {
      console.error(err);
      alert("Ошибка загрузки пользователей");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Удалить пользователя вместе с его транзакциями?"))
      return;

    try {
      await api.delete(`/admin/users/${id}`);
      loadUsers();
    } catch (err) {
      console.error(err);
      alert("Ошибка удаления пользователя");
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  return (
    <div className="admin-page">
      <h1 className="admin-title">Пользователи</h1>

      <table className="admin-table">
        <thead>
          <tr>
            <th>Email</th>
            <th>Role</th>
            <th>Premium</th>
            <th>Wallet</th>
            <th></th>
          </tr>
        </thead>

        <tbody>
          {users.map((u) => (
            <tr key={u._id}>
              <td>{u.email}</td>
              <td>{u.role}</td>
              <td>{u.isPremium ? "Yes" : "No"}</td>
              <td>{u.walletBalance}</td>
              <td>
                <button
                  className="admin-delete-btn"
                  onClick={() => handleDelete(u._id)}
                >
                  🗑 Удалить
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AdminUsersPanel;
