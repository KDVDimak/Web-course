import Stripe from "stripe";
import User from "../models/User.js";
import Transaction from "../models/Transaction.js"; // ✅ ДОБАВЛЕНО

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

console.log("ENV KEY:", process.env.STRIPE_SECRET_KEY);
console.log("🔑 STRIPE SECRET LOADED:", process.env.STRIPE_SECRET_KEY);


// ===============================
// 1) Создание Stripe Checkout Session
// ===============================
export const createCheckoutSession = async (req, res) => {
  try {
    const { amount } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ message: "Некорректная сумма" });
    }

    // id пользователя из токена
    const userId = req.user.id;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: { name: "Пополнение кошелька FinanceFlow" },
            unit_amount: Math.round(amount * 100),
          },
          quantity: 1,
        },
      ],
      success_url: `${process.env.CLIENT_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/payment-cancel`,
      metadata: { userId },
    });

    return res.json({ url: session.url });

  } catch (err) {
    console.error("❌ Stripe create session error:", err);
    return res.status(500).json({ message: "Ошибка создания платежа" });
  }
};


// ===============================
// 2) Подтверждение оплаты
// ===============================
export const confirmTopUp = async (req, res) => {
  try {
    const { sessionId } = req.body;

    if (!sessionId) {
      return res.status(400).json({ message: "Не передан sessionId" });
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (!session || session.payment_status !== "paid") {
      return res.status(400).json({ message: "Платёж не завершён" });
    }

    const userId = session.metadata?.userId;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "Пользователь не найден" });

    const amount = session.amount_total / 100;

    // Обновление баланса
    user.walletBalance = (user.walletBalance || 0) + amount;
    await user.save();

    // 🔥 Создаём транзакцию "Пополнение"
    await Transaction.create({
   userId,
   amount,
   type: "income",
   category: "topup",
   note: "Stripe пополнение",
   });


    res.json({
      message: "Баланс пополнен",
      amount,
      walletBalance: user.walletBalance,
    });

  } catch (err) {
    console.error("❌ Stripe confirm error:", err);
    return res.status(500).json({ message: "Ошибка подтверждения платежа" });
  }
};
