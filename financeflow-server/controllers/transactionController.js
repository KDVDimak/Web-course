import Transaction from "../models/Transaction.js";

// ===========================
//  ADD TRANSACTION
// ===========================
export const addTransaction = async (req, res) => {
  try {
    console.log("🔥 addTransaction called");

    const { amount, category, type, note } = req.body;
    const userId = req.user.id;

    if (!amount) {
      return res.status(400).json({ message: "Укажите сумму" });
    }

    const tx = await Transaction.create({
      amount,
      category,
      type,
      note,
      userId,
    });

    res.json({ message: "Транзакция добавлена!", tx });
  } catch (err) {
    console.error("❌ ERROR addTransaction:", err);
    res.status(500).json({ message: "Ошибка сервера", error: err.message });
  }
};

// ===========================
//  GET TRANSACTIONS
// ===========================
export const getTransactions = async (req, res) => {
  try {
    const userId = req.user.id;
    const list = await Transaction.find({ userId }).sort({ createdAt: -1 });
    res.json(list);
  } catch (err) {
    console.error("❌ ERROR getTransactions:", err);
    res.status(500).json({ message: "Ошибка получения списка" });
  }
};

// ===========================
//  UPDATE TRANSACTION
// ===========================
export const updateTransaction = async (req, res) => {
  try {
    const { id } = req.params;

    const updated = await Transaction.findOneAndUpdate(
      { _id: id, userId: req.user.id }, // ← исправлено!
      req.body,
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Транзакция не найдена" });
    }

    res.json(updated);

  } catch (error) {
    console.error("❌ UPDATE ERROR:", error);
    res.status(500).json({ message: "Ошибка обновления" });
  }
};

// ===========================
//  DELETE TRANSACTION
// ===========================
export const deleteTransaction = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await Transaction.findOneAndDelete({
      _id: id,
      userId: req.user.id, // ← исправлено!
    });

    if (!deleted) {
      return res.status(404).json({ message: "Не найдено" });
    }

    res.json({ message: "Удалено" });

  } catch (error) {
    console.error("❌ DELETE ERROR:", error);
    res.status(500).json({ message: "Ошибка удаления" });
  }
};

