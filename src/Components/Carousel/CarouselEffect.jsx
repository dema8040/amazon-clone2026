import React from "react";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { img } from "./img/img/data";
import classes from "./Carousel.module.css";

function CarouselEffect() {
  return (
    <Carousel
      autoPlay={true}
      infiniteLoop={true}
      showIndicators={false}
      showThumbs={false}
    >
      {img.map((imageItemLink, index) => (
        <div key={index} className={classes.hero_img}>
          <img src={imageItemLink} alt="banner" />
        </div>
      ))}
    </Carousel>
  );
}

export default CarouselEffect;
