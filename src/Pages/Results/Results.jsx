import React, { useState, useEffect } from "react";
import classes from "./Results.module.css";
import LayOut from "../../Components/LayOut/LayOut";
import { useParams } from "react-router-dom";
import axios from "axios";
import { productUrl } from "../../Api/endepoints";
import ProductCard from "../../Components/Product/ProductCard";

function Results() {
  const [results, setResults] = useState([]);
  const { categoryName } = useParams();

  useEffect(() => {
    axios
      .get(`${productUrl}/products/category/${categoryName}`)
      .then((res) => {
        setResults(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [categoryName]);

  return (
    <LayOut>
      <section>
        <h1 style={{ padding: "30px" }}>{categoryName}</h1>

        <div className={classes.results}>
          {results.map((product) => (
            <ProductCard key={product.id}
            renderAdd={true}
             product={product} 
             renderDesc={false}
            />
          ))}
        </div>
      </section>
    </LayOut>
  );
}

export default Results;
