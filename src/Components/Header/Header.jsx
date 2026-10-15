
import React, { useContext } from "react";
import { Link } from "react-router-dom";

import classes from "./Header.module.css";

import { SlLocationPin } from "react-icons/sl";
import { BiSearch, BiCart } from "react-icons/bi";

import LowerHeader from "./LowerHeader";

import { DataContext } from "../DataProvider/DataProvider";

const Header = () => {
  const [{ user, basket }] = useContext(DataContext);

  const totalItems = basket?.reduce(
    (amount, item) =>{  return amount + item.quantity; },
    0
  );

  return (
    <section className={classes.fixed}>
      <section className={classes.header_container}>

        {/* Logo */}
        <div className={classes.logo_container}>
          <Link to="/">
            <img
              src="https://pngimg.com/uploads/amazon/amazon_PNG25.png"
              alt="Amazon Logo"
            />
          </Link>
        </div>

        {/* Delivery */}
        <div className={classes.delivery}>
          <span>
            <SlLocationPin />
          </span>

          <div>
            <p>Deliver to</p>
            <span>Ethiopia</span>
          </div>
        </div>

        {/* Search */}
        <div className={classes.search}>
          <select>
            <option>All</option>
          </select>

          <input type="text" placeholder="Search Amazon" />

          <button>
            <BiSearch />
          </button>
        </div>

        {/* Right Side */}
        <div className={classes.order_container}>

          {/* Language */}
          <div className={classes.language}>
            <img
              src="https://i.ebayimg.com/images/g/D~gAAOSwXyNlO7Uh/s-l1600.webp"
              alt="US Flag"
              width="25"
            />

            <select>
              <option>EN</option>
            </select>
          </div>

          {/* Sign In */}
          <Link to="/signup">
            <div>
              <p>
                Hello, {user ? user.email : "Sign In"}
              </p>
              <span>Account & Lists</span>
            </div>
          </Link>

          {/* Orders */}
          <Link to="/orders">
            <div>
              <p>Returns</p>
              <span>& Orders</span>
            </div>
          </Link>

          {/* Cart */}
          <Link to="/cart" className={classes.cart}>
            <BiCart size={35} />
            <span>{totalItems}</span>
          </Link>

        </div>
      </section>

      <LowerHeader />
    </section>
  );
};

export default Header;

