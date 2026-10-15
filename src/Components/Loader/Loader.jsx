import React from "react";
import classes from "./Loader.module.css";
import { FadeLoader } from "react-spinners";

function Loader() {
  return (
    <div className={classes.loader_container}
    style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "50vh" }}>
      <div className={classes.loader}>
        <FadeLoader color="#36d7b7" />
      </div>
    </div>
  );
}

export default Loader;
