import { React, useState } from "react";
import "../style/home.scss";
import vid from "../assets/vid3.mp4";
import poster from "../assets/frame_1.jpg";
import data from "./data.json";
import { useDispatch } from "react-redux";
import { toast } from "react-hot-toast";
import Filter from "./Filter";

const Home = () => {
  const dispatch = useDispatch();
  const [foodItems, setFoodItems] = useState(data);

  const addToCartHandler = (options) => {
    dispatch({ type: "addToCart", payload: options });

    toast.success("added to cart successfully");
    dispatch({ type: "calculatePrice" });
    dispatch({ type: "totalqty" });
  };

  function handleShowAllItems() {
    setFoodItems(data);
  }
  function handleveg() {
    let cat = data.filter((d) => d.category === "veg");
    setFoodItems(cat);
  }

  function handlenonveg() {
    let cat = data.filter((d) => d.category === "non-veg");
    setFoodItems(cat);
  }

  function handlechinese() {
    let cat = data.filter((d) => d.category === "chinese");
    setFoodItems(cat);
  }

  function handledessert() {
    let cat = data.filter((d) => d.category === "dessert");
    setFoodItems(cat);
  }

  function handlelowprice() {
    let sortlow = [...foodItems].sort((a, b) => a.price - b.price);
    setFoodItems(sortlow);
  }

  function sorthigh() {
    let sortdata = [...foodItems].sort((a, b) => b.price - a.price);
    setFoodItems(sortdata);
  }
  return (
    <>
      <div className="home">
        <video
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          className="vid"
          poster={poster}
        >
          <source src={vid} type="video/mp4" />
        </video>
      </div>
      <div className="filtercontainer">
        <Filter
          sorthigh={sorthigh}
          handlelowprice={handlelowprice}
          handledessert={handledessert}
          handlechinese={handlechinese}
          handlenonveg={handlenonveg}
          handleveg={handleveg}
          handleShowAllItems={handleShowAllItems}
        />
      </div>

      <div className="products">
        {foodItems.map((i) => (
          <AllProducts
            key={i.id}
            id={i.id}
            image={i.image}
            title={i.title}
            price={i.price}
            handler={addToCartHandler}
          />
        ))}
      </div>
    </>
  );
};

export const AllProducts = ({ image, title, price, id, handler }) => (
  <div className="card">
    <img src={image} alt={title} />
    <h3>{title}</h3>
    <h4> Rs {price}/plate</h4>
    <button onClick={() => handler({ image, title, price, id, qty: 1 })}>
      ORDER NOW
    </button>
  </div>
);
export default Home;
