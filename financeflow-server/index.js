// financeflow-server/index.js
import dotenv from "dotenv";
dotenv.config();

import express from "express";
import mongoose from "mongoose";
import cors from "cors";

// ❌ СТАРЫЙ СЛОМАННЫЙ РОУТ — БОЛЬШЕ НЕ ИСПОЛЬЗУЕМ
// import authRoutes from "./routes/auth.js";

// ✅ ПОДКЛЮЧАЕМ НОВЫЙ РАБОЧИЙ РОУТ
import authRoutes from "./controllers/authController.js";

import transactionRoutes from "./routes/transaction.js";
import paymentRoutes from "./routes/payment.js";
import webhookRoutes from "./routes/webhook.js";
import adminRoutes from "./routes/admin.js";

const app = express();

app.use(cors());
app.use(express.json());

// обычные роуты
app.use("/api/auth", authRoutes);   // <- ТЕПЕРЬ ЭТО РАБОЧИЙ РОУТ
app.use("/api/transactions", transactionRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/webhook", webhookRoutes);

// админские
app.use("/api/admin", adminRoutes);

const PORT = process.env.PORT || 5001;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Mongo connected");
    app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
  })
  .catch((err) => console.error("Mongo error", err));
