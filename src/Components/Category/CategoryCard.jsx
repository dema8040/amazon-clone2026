import React from "react";
import { Link } from "react-router-dom";
import classes from "./Category.module.css";

function CategoryCard({ data }) {
  return (
    <div className={classes.category}>
      <Link to={`/category/${data.name}`}>
        <h2>{data.title}</h2>

        <img src={data.imageLink} alt={data.title} />

        <p>Shop Now</p>
      </Link>
    </div>
  );
}

export default CategoryCard;
