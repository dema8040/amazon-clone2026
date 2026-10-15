
const { onRequest } = require("firebase-functions/v2/https");
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const Stripe = require("stripe");

// Load environment variables
dotenv.config();

console.log(
  "Stripe key loaded:",
  process.env.STRIPE_SECRET_KEY ? "YES" : "NO"
);

// Create Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const app = express();

app.use(cors({ origin: true }));
app.use(express.json());

// Test API
app.get("/", (req, res) => {
  res.status(200).json({
    message: "success!",
  });
});

// Create Payment Intent
app.post("/payment/create", async (req, res) => {
  try {
    const total = Number(req.query.total);

    if (!total || total <= 0) {
      return res.status(400).json({
        message: "total must be greater than 0",
      });
    }

    console.log(
      "Payment request received for this amount >>>",
      total
    );

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(total),
      currency: "usd",
    });

    console.log(
      "Payment Intent created:",
      paymentIntent.id
    );

    return res.status(201).json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.error("Stripe Error:", error.message);

    return res.status(500).json({
      message: "Payment creation failed",
      error: error.message,
    });
  }
});

// Export Firebase Function
exports.api = onRequest(app);
