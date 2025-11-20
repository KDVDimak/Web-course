// financeflow-server/routes/admin.js
import express from "express";
import auth, { isAdmin } from "../middleware/authMiddleware.js";
import User from "../models/User.js";
import Transaction from "../models/Transaction.js";

const router = express.Router();

// === USERS ===
router.get("/users", auth, isAdmin, async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    console.error("ADMIN GET USERS ERROR:", err);
    res.status(500).json({ message: "Ошибка получения пользователей" });
  }
});

router.delete("/users/:id", auth, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    if (req.user._id.toString() === id) {
      return res
        .status(400)
        .json({ message: "Нельзя удалить самого себя" });
    }

    await User.findByIdAndDelete(id);
    await Transaction.deleteMany({ user: id });

    res.json({ message: "Пользователь удалён" });
  } catch (err) {
    console.error("ADMIN DELETE USER ERROR:", err);
    res.status(500).json({ message: "Ошибка удаления пользователя" });
  }
});

// === TRANSACTIONS ===
router.get("/transactions", auth, isAdmin, async (req, res) => {
  try {
    const tx = await Transaction.find()
      .populate("userId", "email")
      .sort({ createdAt: -1 });

    res.json(tx);
  } catch (err) {
    console.error("ADMIN GET TX ERROR:", err);
    res.status(500).json({ message: "Ошибка получения транзакций" });
  }
});

router.delete("/transactions/:id", auth, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    await Transaction.findByIdAndDelete(id);
    res.json({ message: "Транзакция удалена" });
  } catch (err) {
    console.error("ADMIN DELETE TX ERROR:", err);
    res.status(500).json({ message: "Ошибка удаления транзакции" });
  }
});

export default router;
