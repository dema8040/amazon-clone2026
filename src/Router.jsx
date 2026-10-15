import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Landing from "./Pages/Landing/Landing";
import Auth from "./Pages/Auth/Auth";
import Payment from "./Pages/Payment/Payment";
import Orders from "./Pages/Orders/Orders";
import Cart from "./Pages/Cart/Cart";
import Results from "./Pages/Results/Results";
import ProductDetail from "./Pages/ProductDetail/ProductDetail";

import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";

import ProtectedRoute from "./Components/protectedRout/protectedRout";

const stripePromise = loadStripe(
  "pk_test_51UCJN40dXHLLjVfR89BnORSyvs1KZSGLGE9yOCrjQ10aODcgEd117tVNDBLD4s0yzztKhiQcQq0keZqFmxedlrPV00KrDKu8Vw",
);

function Routering() {
  return (
    <Router>
      <Routes>
        {/* Home page */}
        <Route path="/" element={<Landing />} />

        {/* Authentication */}
        <Route path="/auth" element={<Auth />} />
        <Route path="/signup" element={<Auth />} />

        {/* Protected payment page */}
        <Route
          path="/payment"
          element={
            <ProtectedRoute msg="You must log in to pay" redirect="/payment">
              <Elements stripe={stripePromise}>
                <Payment />
              </Elements>
            </ProtectedRoute>
          }
        />

        {/* Protected orders page */}
        <Route
          path="/orders"
          element={
            <ProtectedRoute
              msg="You must log in to view your orders"
              redirect="/orders"
            >
              <Orders />
            </ProtectedRoute>
          }
        />

        {/* Shopping cart */}
        <Route path="/cart" element={<Cart />} />

        {/* Category results */}
        <Route path="/category/:categoryName" element={<Results />} />

        {/* Product details */}
        <Route path="/products/:productId" element={<ProductDetail />} />

        {/* Fallback for unknown URLs */}
        <Route path="*" element={<Landing />} />
      </Routes>
    </Router>
  );
}

export default Routering;
