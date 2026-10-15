import React, { useContext } from "react";
import LayOut from "../../Components/Layout/Layout";
import ProductCard from "../../Components/Product/ProductCard";
import CurrencyFormat from "../../Components/CurrencyFormat/CurrencyFormat";
import { DataContext } from "../../Components/DataProvider/DataProvider";
import { type } from "../../Utility/action.type";
import { Link } from "react-router-dom";
import classes from "./Cart.module.css";

function Cart() {
  const [{ basket, user }, dispatch] = useContext(DataContext);

  // Calculate total price
  const total = basket.reduce((amount, item) => {
    return amount + item.price * (item.quantity || 1);
  }, 0);

  // Calculate total number of items
  const totalItems = basket.reduce((amount, item) => {
    return amount + (item.quantity || 1);
  }, 0);

  // Increase quantity
  const increment = (item) => {
    dispatch({
      type: type.ADD_TO_BASKET,
      item,
    });
  };

  // Decrease quantity
  const decrement = (id) => {
    dispatch({
      type: type.REMOVE_FROM_BASKET,
      id,
    });
  };

  return (
    <LayOut>
      <section className={classes.container}>
        {/* Shopping Basket */}
        <div className={classes.cart_container}>
          <h2>Hello {user?.email || ""}</h2>
        </div>

        <div>
          <h3>Your Shopping Basket</h3>
          <hr />

          {basket?.length === 0 ? (
            <p>Oops! No items in your cart.</p>
          ) : (
            basket?.map((item) => {
              return (
                <section key={item.id}>
                  <ProductCard
                    product={item}
                    renderDesc={true}
                    renderAdd={false}
                    flex={true}
                  />

                  <div className={classes.btn_container}>
                    <button
                      className={classes.btn}
                      onClick={() => increment(item)}
                    >
                      +
                    </button>

                    <span>{item.quantity || 1}</span>

                    <button onClick={() => decrement(item.id)}>-</button>
                  </div>
                </section>
              );
            })
          )}

          <hr />

          <h2>Total Items: {totalItems}</h2>

          <h2>Total Price: ${total.toFixed(2)}</h2>
        </div>

        {/* Subtotal */}
        {basket.length > 0 && (
          <div className={classes.subtotal}>
            <div>
              <p>Subtotal ({totalItems} items)</p>

              <CurrencyFormat amount={total} />
            </div>

            <div>
              <span>
                <input type="checkbox" />
                <small>This order contains a gift</small>
              </span>

              <br />
              <br />

              <Link to="/payment">Continue to Checkout</Link>
            </div>
          </div>
        )}
      </section>
    </LayOut>
  );
}

export default Cart;
