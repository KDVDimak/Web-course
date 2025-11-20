// routes/payment.js
import express from "express";
import Stripe from "stripe";
import dotenv from "dotenv";
import User from "../models/User.js";
import Transaction from "../models/Transaction.js";

dotenv.config();

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// 1️⃣ Создание Stripe Checkout Session
router.post("/create-session", async (req, res) => {
  try {
    const { amount, userId } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ error: "Неверная сумма" });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: { name: "FinanceFlow Top-Up" },
            unit_amount: amount * 100,
          },
          quantity: 1,
        },
      ],
      mode: "payment",

      // 👇 ИСПОЛЬЗУЕМ ТОЛЬКО session_id
      success_url: `${process.env.CLIENT_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/cancel`,

      // 👇 СЮДА КЛАДЁМ userId
      metadata: {
        userId: userId,
      },
    });

    res.json({ url: session.url });
  } catch (error) {
    console.error("Stripe error:", error);
    res.status(500).json({ error: "Ошибка создания сессии" });
  }
});
// 2️⃣ Проверка оплаты + запись транзакции
router.post("/confirm", async (req, res) => {
  try {
    const { session_id } = req.body;

    const session = await stripe.checkout.sessions.retrieve(session_id);

    if (session.payment_status !== "paid") {
      return res.status(400).json({ error: "Платёж не завершён" });
    }

    // ❗ правильный способ — из metadata
    const userId = session.metadata?.userId;

    if (!userId) {
      return res.status(400).json({ error: "User ID not found in session metadata" });
    }

    const amount = session.amount_total / 100;

    // 1. Находим пользователя
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    // 2. Пополняем баланс
    user.balance = (user.balance || 0) + amount;
    await user.save();

    // 3. Создаём транзакцию
    await Transaction.create({
      userId: user._id,
      type: "income",
      amount: amount,
      category: "topup",
      note: "Пополнение через Stripe",
    });

    return res.json({
      message: "Баланс пополнен",
      balance: user.balance,
    });
  } catch (error) {
    console.error("Verify payment error:", error);
    res.status(500).json({ error: "Ошибка подтверждения" });
  }
});

export default router;
