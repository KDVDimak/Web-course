import User from "../models/User.js";
import Transaction from "../models/Transaction.js";

export const getUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch {
    res.status(500).json({ message: "Ошибка загрузки пользователей" });
  }
};

export const deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "Пользователь удалён" });
  } catch {
    res.status(500).json({ message: "Ошибка удаления" });
  }
};

export const getAllTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find().sort({ createdAt: -1 });
    res.json(transactions);
  } catch {
    res.status(500).json({ message: "Ошибка загрузки транзакций" });
  }
};

export const deleteTransactionAdmin = async (req, res) => {
  try {
    await Transaction.findByIdAndDelete(req.params.id);
    res.json({ message: "Транзакция удалена" });
  } catch {
    res.status(500).json({ message: "Ошибка удаления" });
  }
};
