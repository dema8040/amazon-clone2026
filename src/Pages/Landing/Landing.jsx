// import Header from "../../Components/Header/Header";
import LayOut from "../../Components/LayOut/LayOut";
import CarouselEffect from "../../Components/Carousel/CarouselEffect";
import Category from "../../Components/Category/Category";
import Product from "../../Components/Product/Product";

function Landing() {
  return (
    <LayOut>
      {/* <Header /> */}
      <CarouselEffect />
      <Category />
      <Product />
    </LayOut>
  );
}

export default Landing;
