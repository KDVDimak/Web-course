// financeflow-client/src/App.jsx
import { Routes, Route, Navigate, useLocation } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";

import Dashboard from "./pages/Dashboard";
import Balance from "./pages/Balance";
import Incomes from "./pages/Incomes";
import Expenses from "./pages/Expenses";
import History from "./pages/History";
import Settings from "./pages/Settings";
import TopUp from "./pages/TopUp";
import TopUpSuccess from "./pages/TopUpSuccess";

import ProtectedRoute from "./components/ProtectedRoute";
import Sidebar from "./components/Sidebar";

import AdminPanel from "./admin/AdminPanel.jsx";
import AdminUsersPanel from "./admin/AdminUsersPanel.jsx";   // ✔️ ПРАВИЛЬНО
import AdminTransactions from "./admin/AdminTransactions.jsx";
import AdminRoute from "./components/AdminRoute.jsx";

function App() {
  const location = useLocation();

  const noSidebar = ["/login", "/register"];
  const hideSidebar = noSidebar.includes(location.pathname);

  return (
    <div className="app-wrapper">
      {!hideSidebar && <Sidebar />}

      <div className="page-content">
        <Routes>
          {/* Public */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Redirect */}
          <Route path="/" element={<Navigate to="/dashboard" />} />

          {/* Private */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/balance"
            element={
              <ProtectedRoute>
                <Balance />
              </ProtectedRoute>
            }
          />

          <Route
            path="/incomes"
            element={
              <ProtectedRoute>
                <Incomes />
              </ProtectedRoute>
            }
          />

          <Route
            path="/expenses"
            element={
              <ProtectedRoute>
                <Expenses />
              </ProtectedRoute>
            }
          />

          <Route
            path="/history"
            element={
              <ProtectedRoute>
                <History />
              </ProtectedRoute>
            }
          />

          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            }
          />

          <Route
            path="/topup"
            element={
              <ProtectedRoute>
                <TopUp />
              </ProtectedRoute>
            }
          />

          <Route
            path="/success"
            element={
              <ProtectedRoute>
                <TopUpSuccess />
              </ProtectedRoute>
            }
          />

          <Route
            path="/topup-success"
            element={
              <ProtectedRoute>
                <TopUpSuccess />
              </ProtectedRoute>
            }
          />

          {/* ADMIN */}
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminPanel />
              </AdminRoute>
            }
          />

          <Route
            path="/admin/users"
            element={
              <AdminRoute>
                <AdminUsersPanel />   {/* ✔️ БЫЛО НЕПРАВИЛЬНО */}
              </AdminRoute>
            }
          />

          <Route
            path="/admin/transactions"
            element={
              <AdminRoute>
                <AdminTransactions />
              </AdminRoute>
            }
          />
        </Routes>
      </div>
    </div>
  );
}

export default App;
