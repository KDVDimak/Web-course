// src/api/transactions.js
import api from "./api";

// Добавление
export const addTransaction = (data) => {
  return api.post("/transactions/add", data);
};

// Получение всех
export const getTransactions = () => {
  return api.get("/transactions");
};

// Обновление
export const updateTransaction = (id, data) => {
  return api.put(`/transactions/${id}`, data);
};

// Удаление
export const deleteTransaction = (id) => {
  return api.delete(`/transactions/${id}`);
};
