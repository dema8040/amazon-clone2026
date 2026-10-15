import React, { useContext, useEffect, useState } from "react";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { DataContext } from "../../Components/DataProvider/DataProvider";
import { db } from "../../Utility/firebase";
import Layout from "../../Components/Layout/Layout";
import CurrencyFormat from "../../Components/CurrencyFormat/CurrencyFormat";

function Orders() {
  const [{ user }] = useContext(DataContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function fetchOrders() {
      if (!user?.uid) {
        setOrders([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        const ordersRef = collection(db, "users", user.uid, "orders");
        const ordersQuery = query(ordersRef, orderBy("createdAt", "desc"));
        const snapshot = await getDocs(ordersQuery);

        if (!cancelled) {
          setOrders(
            snapshot.docs.map((document) => ({
              id: document.id,
              ...document.data(),
            })),
          );
        }
      } catch (err) {
        console.error("Failed to load orders:", err);

        if (!cancelled) {
          setError(
            "We couldn't load your orders. Check your Firestore rules and internet connection.",
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    fetchOrders();

    return () => {
      cancelled = true;
    };
  }, [user?.uid]);

  return (
    <Layout>
      <main style={{ padding: "24px", maxWidth: "1000px", margin: "0 auto" }}>
        <h1>Your Orders</h1>

        {loading && <p>Loading your orders...</p>}

        {!loading && !user && <p>Please log in to view your orders.</p>}

        {!loading && error && <p role="alert">{error}</p>}

        {!loading && !error && user && orders.length === 0 && (
          <p>You haven't placed any orders yet.</p>
        )}

        {!loading &&
          !error &&
          orders.map((order) => {
            const items = Array.isArray(order.items)
              ? order.items
              : Array.isArray(order.basket)
                ? order.basket
                : [];

            const total = Number(order.amount ?? order.total ?? 0);

            return (
              <section
                key={order.id}
                style={{
                  border: "1px solid #ddd",
                  borderRadius: "8px",
                  padding: "16px",
                  marginTop: "20px",
                }}
              >
                <h2>Order #{order.id}</h2>
                <p>
                  Status: {order.status || order.paymentStatus || "Unknown"}
                </p>

                {Number.isFinite(total) && total > 0 && (
                  <p>
                    <strong>Total: </strong>
                    <CurrencyFormat
                      amount={total > 100000 ? total / 100 : total}
                    />
                  </p>
                )}

                <h3>Products</h3>

                {items.length === 0 ? (
                  <p>No product details were saved for this order.</p>
                ) : (
                  <ul>
                    {items.map((item, index) => (
                      <li
                        key={item.id ?? index}
                        style={{ marginBottom: "12px" }}
                      >
                        <strong>{item.title || item.name || "Product"}</strong>
                        {" — Quantity: "}
                        {item.quantity ?? item.amount ?? 1}
                        {item.price != null && (
                          <>
                            {" — "}
                            <CurrencyFormat amount={Number(item.price)} />
                          </>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            );
          })}
      </main>
    </Layout>
  );
}

export default Orders;
