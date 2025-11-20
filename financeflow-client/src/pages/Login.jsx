import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../api/auth";
import "./auth.css";  

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!email || !password) {
      alert("Заполните все поля!");
      return;
    }

    try {
      const res = await loginUser(email, password);

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      alert("Вход выполнен!");
      navigate("/dashboard");
    } catch (err) {
      alert(err.response?.data?.message || "Ошибка входа");
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1 className="title">FinanceFlow</h1>
        <p className="subtitle">Войдите в личный кабинет</p>

        <div className="input-group">
          <label>Email</label>
          <input
            type="email"
            placeholder="example@gmail.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="input-group">
          <label>Пароль</label>
          <input
            type="password"
            placeholder="Введите пароль"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button className="btn-login" onClick={handleLogin}>
          Войти
        </button>

        <p className="register-text">
          Нет аккаунта?{" "}
          <span onClick={() => navigate("/register")}>
            Зарегистрироваться
          </span>
        </p>
      </div>
    </div>
  );
}

export default Login;
