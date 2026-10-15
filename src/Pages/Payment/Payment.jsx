import React, { useContext, useState } from "react";
import classes from "./Payment.module.css";
import Layout from "../../Components/Layout/Layout";
import { DataContext } from "../../Components/DataProvider/DataProvider";
import ProductCard from "../../Components/Product/ProductCard";
import CurrencyFormat from "../../Components/CurrencyFormat/CurrencyFormat";
import { axiosInstance } from "../../Api/axios";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import { ClipLoader } from "react-spinners";
import { db } from "../../Utility/firebase";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

function Payment() {
  const [{ user, basket = [] }] = useContext(DataContext);

  const [cardError, setCardError] = useState("");
  const [processing, setProcessing] = useState(false);

  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();

  // Support either "amount" or "quantity" in basket items.
  const getQuantity = (item) => {
    const quantity = Number(item.amount ?? item.quantity ?? 1);
    return Number.isFinite(quantity) && quantity > 0 ? quantity : 1;
  };

  // Safely calculate the total number of products.
  const totalItems = basket.reduce((sum, item) => {
    return sum + getQuantity(item);
  }, 0);

  // Calculate the order total and identify invalid prices.
  const total = basket.reduce((sum, item) => {
    const price = Number(item.price);

    if (!Number.isFinite(price) || price < 0) {
      console.error("Invalid product price:", item);
      return sum;
    }

    return sum + price * getQuantity(item);
  }, 0);

  const hasInvalidPrice = basket.some((item) => {
    const price = Number(item.price);
    return !Number.isFinite(price) || price < 0;
  });

  // Display Stripe card validation errors.
  const handleChange = (event) => {
    setCardError(event.error ? event.error.message : "");
  };

  // Process payment and save the order.
  const handlePayment = async (event) => {
    event.preventDefault();
    setCardError("");

    if (!stripe || !elements) {
      setCardError("Stripe is loading. Please wait and try again.");
      return;
    }

    if (!user?.uid) {
      setCardError("Please sign in before making a payment.");
      return;
    }

    if (basket.length === 0) {
      setCardError("Your basket is empty. Add a product before checkout.");
      return;
    }

    if (hasInvalidPrice) {
      setCardError(
        "One or more products have an invalid price. Please check your basket.",
      );
      return;
    }

    if (!Number.isFinite(total) || total <= 0) {
      setCardError("Your order total must be greater than zero.");
      return;
    }

    const cardElement = elements.getElement(CardElement);

    if (!cardElement) {
      setCardError("Card information is not available.");
      return;
    }

    setProcessing(true);

    try {
      // 1. Create a Stripe PaymentIntent.
      // Stripe expects the amount in the smallest currency unit (cents for USD).
      const response = await axiosInstance.post(
        `/payment/create?total=${Math.round(total * 100)}`,
      );

      const clientSecret = response.data?.clientSecret;

      if (!clientSecret) {
        throw new Error(
          "The server did not return a payment client secret. Check the Functions emulator.",
        );
      }

      // 2. Confirm payment with the card.
      const { error, paymentIntent } = await stripe.confirmCardPayment(
        clientSecret,
        {
          payment_method: {
            card: cardElement,
            billing_details: {
              email: user.email || undefined,
            },
          },
        },
      );

      if (error) {
        setCardError(error.message || "Payment failed.");
        return;
      }

      if (paymentIntent?.status !== "succeeded") {
        setCardError(`Payment status: ${paymentIntent?.status || "unknown"}.`);
        return;
      }

      // 3. Save/update the user's Firestore document.
      const userRef = doc(db, "users", user.uid);

      await setDoc(
        userRef,
        {
          uid: user.uid,
          email: user.email || "",
          lastOrderAt: serverTimestamp(),
        },
        { merge: true },
      );

      // 4. Save the successful order under users/{uid}/orders/{orderId}.
      const orderRef = doc(db, "users", user.uid, "orders", paymentIntent.id);

      const orderItems = basket.map((item) => ({
        id: item.id ?? "",
        title: item.title ?? "",
        price: Number(item.price),
        quantity: getQuantity(item),
        image: item.image ?? "",
      }));

      await setDoc(orderRef, {
        basket: orderItems,
        total: total,
        amount: paymentIntent.amount,
        currency: paymentIntent.currency,
        created: paymentIntent.created,
        paymentStatus: paymentIntent.status,
        paymentIntentId: paymentIntent.id,
        customerEmail: user.email || "",
        createdAt: serverTimestamp(),
      });

      console.log("Payment successful:", paymentIntent.id);
      alert("Payment successful! Your order has been saved.");

      // Replace this route if your project uses a different orders page.
      navigate("/orders");
    } catch (error) {
      console.error("Payment error:", error);

      setCardError(
        error.response?.data?.message ||
          error.response?.data?.error ||
          error.message ||
          "Something went wrong while processing your payment.",
      );
    } finally {
      setProcessing(false);
    }
  };

  return (
    <Layout>
      <div className={classes.payment_header}>
        Checkout ({totalItems}) items
      </div>

      <section className={classes.payment}>
        {/* Delivery address */}
        <div className={classes.flex}>
          <h3>Delivery Address</h3>
        </div>

        <div>{user?.email || "Please sign in"}</div>
        <div>123 React Lane</div>
        <div>City, Country</div>

        <hr />

        {/* Review products */}
        <div className={classes.flex}>
          <h3>Review Items and delivery</h3>

          <div>
            {basket.map((item, index) => (
              <ProductCard
                key={item.id ?? item.productId ?? index}
                product={item}
                flex={true}
              />
            ))}
          </div>
        </div>

        <hr />

        {/* Payment method */}
        <div className={classes.flex}>
          <h3>Payment method</h3>

          <div className={classes.payment_card_container}>
            <div className={classes.payment__details}>
              <form onSubmit={handlePayment}>
                {cardError && (
                  <p role="alert" style={{ color: "red" }}>
                    {cardError}
                  </p>
                )}

                <CardElement onChange={handleChange} />

                <div className={classes.payment__price}>
                  <div>
                    <span
                      style={{
                        display: "flex",
                        gap: "10px",
                        alignItems: "center",
                      }}
                    >
                      <p>Total Order</p>
                      <CurrencyFormat amount={total} />
                    </span>
                  </div>

                  <button
                    type="submit"
                    disabled={
                      processing ||
                      !stripe ||
                      !elements ||
                      !user?.uid ||
                      basket.length === 0 ||
                      hasInvalidPrice ||
                      total <= 0
                    }
                  >
                    {processing ? (
                      <div className={classes.loading}>
                        <ClipLoader color="gray" size={12} />
                        <p>Please Wait...</p>
                      </div>
                    ) : (
                      "Pay Now"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}

export default Payment;
