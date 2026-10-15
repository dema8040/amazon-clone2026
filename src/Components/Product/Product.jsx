import React, { useState, useEffect } from "react";
import axios from "axios";
import ProductCard from "./ProductCard";
import Loader from "../Loader/Loader";
import classes from "./Product.module.css";

function Product() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function fetchProducts() {
      try {
        const response = await axios.get("https://fakestoreapi.com/products");

        if (isMounted) {
          setProducts(response.data);
          console.log("Products loaded:", response.data);
        }
      } catch (err) {
        console.error("Error loading products:", err);

        if (isMounted) {
          setError("Unable to load products. Please refresh the page.");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    fetchProducts();

    return () => {
      isMounted = false;
    };
  }, []);

  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return <p role="alert">{error}</p>;
  }

  return (
    <section className={classes.products_container}>
      {products.map((singleProduct) => (
        <ProductCard
          key={singleProduct.id}
          product={singleProduct}
          renderAdd={true}
        />
      ))}
    </section>
  );
}

export default Product;
