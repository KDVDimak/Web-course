import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../api/auth";
import "./auth.css";

function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const navigate = useNavigate();

  const handleRegister = async () => {
    if (!email || !password || !confirmPassword) {
      alert("Заполните все поля!");
      return;
    }

    if (password !== confirmPassword) {
      alert("Пароли не совпадают!");
      return;
    }

    try {
      await registerUser(email, password, confirmPassword);
      alert("Регистрация успешна!");
      navigate("/login");
    } catch (err) {
      alert(err.response?.data?.message || "Ошибка регистрации");
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1 className="title">Создать аккаунт</h1>

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

        <div className="input-group">
          <label>Подтверждение пароля</label>
          <input
            type="password"
            placeholder="Повторите пароль"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>

        <button className="btn-login" onClick={handleRegister}>
          Создать аккаунт
        </button>

        <p className="register-text">
          Уже есть аккаунт?{" "}
          <span onClick={() => navigate("/login")}>Войти</span>
        </p>
      </div>
    </div>
  );
}

export default Register;
