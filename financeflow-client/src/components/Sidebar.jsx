import { useNavigate, useLocation } from "react-router-dom";
import "./sidebar.css";

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  // читаем пользователя
  let user = {};
  try {
    user = JSON.parse(localStorage.getItem("user") || "{}");
  } catch {}

  const isAdmin = user?.role === "admin";

  const menu = [
    { label: "🏠 Главная", path: "/dashboard" },
    { label: "💰 Баланс", path: "/balance" },
    { label: "📈 Доходы", path: "/incomes" },
    { label: "📉 Расходы", path: "/expenses" },
    { label: "📅 История", path: "/history" },
    { label: "⚙ Настройки", path: "/settings" },
    { label: "💳 Пополнить", path: "/topup" },
  ];

  const adminMenu = [
    { label: "🛠 Админ-панель", path: "/admin" },
    { label: "👥 Пользователи", path: "/admin/users" },
    { label: "💼 Транзакции", path: "/admin/transactions" },
  ];

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <aside className="sidebar">
      <h2 className="sidebar-title">FinanceFlow</h2>

      <nav className="menu">

        {/* Пользовательское меню */}
        {menu.map((item) => (
          <div
            key={item.path}
            className={
              "menu-item " +
              (location.pathname.startsWith(item.path) ? "active" : "")
            }
            onClick={() => navigate(item.path)}
          >
            {item.label}
          </div>
        ))}

        {/* Если user.role === "admin", показываем блок */}
        {isAdmin && (
          <>
            <div className="menu-section-title">Администрирование</div>

            {adminMenu.map((item) => (
              <div
                key={item.path}
                className={
                  "menu-item " +
                  (location.pathname.startsWith(item.path) ? "active" : "")
                }
                onClick={() => navigate(item.path)}
              >
                {item.label}
              </div>
            ))}
          </>
        )}
      </nav>

      <button className="logout-btn" onClick={logout}>
        🔒 Выйти
      </button>
    </aside>
  );
}
