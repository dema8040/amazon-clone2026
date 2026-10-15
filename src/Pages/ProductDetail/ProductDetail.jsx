import React, { useState, useEffect } from "react";
import classes from "./ProductDetail.module.css";
import Layout from "../../Components/Layout/Layout";
import { useParams } from "react-router-dom";
import axios from "axios";
import { productUrl } from "../../Api/endepoints";
import ProductCard from "../../Components/Product/ProductCard";
import Loader from "../../Components/Loader/Loader";

function ProductDetail() {
  const { productId } = useParams();

  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function fetchProduct() {
      setIsLoading(true);
      setError("");

      try {
        const response = await axios.get(`${productUrl}/products/${productId}`);

        if (isMounted) {
          setProduct(response.data);
        }
      } catch (err) {
        console.error("Error loading product:", err);

        if (isMounted) {
          setError("Unable to load this product. Please try again.");
          setProduct(null);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    if (productId) {
      fetchProduct();
    } else {
      setError("Product ID is missing.");
      setIsLoading(false);
    }

    return () => {
      isMounted = false;
    };
  }, [productId]);

  return (
    <Layout>
      <div className={classes.product_detail}>
        {isLoading ? (
          <Loader />
        ) : error ? (
          <p role="alert">{error}</p>
        ) : product ? (
          <ProductCard product={product} flex={true} />
        ) : (
          <p>Product not found.</p>
        )}
      </div>
    </Layout>
  );
}

export default ProductDetail;
