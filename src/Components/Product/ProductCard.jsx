import React, { useContext } from "react";
import Rating from "@mui/material/Rating";
import { Link } from "react-router-dom";
import CurrencyFormat from "../CurrencyFormat/CurrencyFormat";
import classes from "./Product.module.css";
import { DataContext } from "../DataProvider/DataProvider";
import { type } from "../../Utility/action.type";

function ProductCard({ product, flex, renderDesc, renderAdd }) {
  const { id, image, title, rating, price, description, category } =
    product || {};

  const [, dispatch] = useContext(DataContext);

  const addToCart = () => {
    const numericPrice = Number(price);

    if (!Number.isFinite(numericPrice) || numericPrice < 0) {
      console.error("Cannot add product with invalid price:", product);
      alert("This product has an invalid price. Please try another product.");
      return;
    }

    dispatch({
      type: type.ADD_TO_BASKET,
      item: {
        id,
        image,
        title,
        rating,
        price: numericPrice,
        description,
        category,
        amount: 1,
        quantity: 1,
      },
    });
  };

  return (
    <div
      className={`${classes.card_container} ${
        flex ? classes.product_flexed : ""
      }`}
    >
      <Link to={id != null ? `/products/${id}` : "#"}>
        <img
          src={image}
          alt={title || "Product"}
          className={classes.img_container}
        />
      </Link>

      <div className={classes.product_info}>
        <h3>{title || "Untitled product"}</h3>

        {renderDesc && <p className={classes.description}>{description}</p>}

        <div className={classes.rating}>
          <Rating value={Number(rating?.rate) || 0} precision={0.1} readOnly />
          <small>{rating?.count || 0}</small>
        </div>

        <div className={classes.price}>
          <CurrencyFormat amount={price} />
        </div>

        {flex && (
          <>
            <p className={classes.category}>
              <strong>Category:</strong> {category || "Uncategorized"}
            </p>
            <p className={classes.description}>{description}</p>
          </>
        )}

        {renderAdd && (
          <button type="button" className={classes.button} onClick={addToCart}>
            Add to Cart
          </button>
        )}
      </div>
    </div>
  );
}

export default ProductCard;
