import "./EditModal.css";
import { categories } from "../data/categories";
import { useState, useEffect } from "react";

function EditModal({ open, onClose, transaction, onSave }) {
  const [form, setForm] = useState({
    amount: "",
    category: "",
    type: "",
    note: ""
  });

  useEffect(() => {
    if (transaction) {
      setForm({
        amount: transaction.amount,
        category: transaction.category,
        type: transaction.type,
        note: transaction.note || ""
      });
    }
  }, [transaction]);

  if (!open) return null;

  const handleSave = () => {
    const cleanData = {
      _id: transaction._id,
      amount: Number(form.amount),
      category: form.category,
      type: form.type,
      note: form.note?.trim() || "",
    };
    onSave(cleanData);
  };

  return (
    <div className="edit-popup" onClick={onClose}>
      <div className="edit-card" onClick={(e) => e.stopPropagation()}>
        
        <div className="edit-header">
          <h2>Редактировать транзакцию</h2>
          <button className="close-btn" onClick={onClose}>✖</button>
        </div>

        <label>Сумма</label>
        <input
          type="number"
          value={form.amount}
          onChange={(e) => setForm({ ...form, amount: e.target.value })}
        />

        <label>Категория</label>
        <select
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
        >
          {Object.entries(categories).map(([key, c]) => (
            <option key={key} value={key}>
              {c.icon} {c.label}
            </option>
          ))}
        </select>

        <label>Тип</label>
        <select
          value={form.type}
          onChange={(e) => setForm({ ...form, type: e.target.value })}
        >
          <option value="income">Доход</option>
          <option value="expense">Расход</option>
        </select>

        <label>Заметка</label>
        <textarea
          value={form.note}
          onChange={(e) => setForm({ ...form, note: e.target.value })}
        />

        <button className="save-btn" onClick={handleSave}>
          💾 Сохранить
        </button>

      </div>
    </div>
  );
}

export default EditModal;
