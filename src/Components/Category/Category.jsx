import React from "react";
import { CategoryInfos } from "./CatagoryFullInfos";
import CategoryCard from "./CategoryCard";
import classes from "./Category.module.css"

function Category() {
  return (
    <section className={classes.category_container}>
      {CategoryInfos.map((infos, index) => (
        <CategoryCard key={index} data={infos} />
      ))}
    </section>
  );
}

export default Category;
