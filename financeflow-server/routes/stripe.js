// routes/stripe.js
import express from "express";
import Stripe from "stripe";
import dotenv from "dotenv";
import User from "../models/User.js";

dotenv.config();

const router = express.Router();

// Инициализация Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// ================================
// 1️⃣ Создать Checkout Session
// ================================
router.post("/create-checkout-session", async (req, res) => {
  try {
    const { amount, userId } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ error: "Неверная сумма" });
    }

    // Создаём Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: { name: "Пополнение баланса FinanceFlow" },
            unit_amount: amount * 100, // Stripe принимает в центах
          },
          quantity: 1,
        },
      ],
      mode: "payment",

      // Куда перенаправлять после оплаты
      success_url: `${process.env.CLIENT_URL}/success?session_id={CHECKOUT_SESSION_ID}&user=${userId}`,
      cancel_url: `${process.env.CLIENT_URL}/cancel`,
    });

    res.json({ url: session.url });
  } catch (error) {
    console.error("Stripe Error:", error);
    res.status(500).json({ error: "Ошибка при создании сессии" });
  }
});

// ================================
// 2️⃣ Подтверждение платежа (пополнение баланса)
// ================================
router.post("/verify-payment", async (req, res) => {
  try {
    const { sessionId, userId } = req.body;

    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status !== "paid") {
      return res.status(400).json({ error: "Платёж не завершён" });
    }

    // Сумма в долларах
    const amountUSD = session.amount_total / 100;

    // Найти пользователя
    const user = await User.findById(userId);

    if (!user) return res.status(404).json({ error: "User not found" });

    // Пополнить баланс
    user.balance = (user.balance || 0) + amountUSD;

    await user.save();

    res.json({ message: "Баланс пополнен!", balance: user.balance });
  } catch (err) {
    console.error("Verify error:", err);
    res.status(500).json({ error: "Ошибка при подтверждении" });
  }
});

export default router;
