import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const router = express.Router();

// =======================
//      REGISTER
// =======================
router.post("/register", async (req, res) => {
  try {
    const { email, password, confirmPassword } = req.body;

    console.log("REGISTER BODY:", req.body);

    // --- Проверки ---
    if (!email || !password || !confirmPassword) {
      return res.status(400).json({ message: "Заполните все поля" });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Пароли не совпадают" });
    }

    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).json({ message: "Email уже занят" });
    }

    // --- Хеширование ---
    const hash = await bcrypt.hash(password, 10);

    // --- Создание пользователя ---
    const user = await User.create({ email, password: hash });

    res.json({
      message: "Регистрация успешна",
      user: {
        id: user._id,
        email: user.email,
      },
    });
  } catch (err) {
    console.error("REGISTER ERROR:", err);

    // ВАЖНО: вывод Mongoose ошибки, чтобы понимать, что именно сломалось
    return res.status(500).json({ message: "Ошибка сервера", error: err.message });
  }
});

// =======================
//        LOGIN
// =======================
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log("LOGIN BODY:", req.body);

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Неверный email или пароль" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Неверный email или пароль" });
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      message: "Успешный вход",
      token,
      user: {
        id: user._id,
        email: user.email,
      },
    });

  } catch (err) {
    console.error("LOGIN ERROR:", err);
    return res.status(500).json({ message: "Ошибка сервера", error: err.message });
  }
});

export default router;
