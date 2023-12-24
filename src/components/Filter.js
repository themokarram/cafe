import React from "react";
import "../style/filter.scss";
//import {useSelector} from "react-redux"
import data from "./data.json";

const Filter = (props) => {
  //const {cart} =useSelector((state)=>state.mainCart)
  console.log("data", data);

  return (
    <div className="container">
      <div className="sort">
        <p>Sort By: </p>
        <button onClick={props.handlelowprice}>Price: -- Low to High</button>
        <button onClick={props.sorthigh}>Price: -- High to Low</button>
      </div>

      <div className="category">
        <button onClick={props.handleShowAllItems}> All </button>
        <button onClick={props.handleveg}> Veg </button>
        <button onClick={props.handlenonveg}> Non-Veg </button>
        <button onClick={props.handlechinese}> Chinese </button>
        <button onClick={props.handledessert}> Dessert </button>
      </div>
    </div>
  );
};

export default Filter;
