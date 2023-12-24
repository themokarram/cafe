import React from "react";
import img from "../assets/logoo.png";
import { Link } from "react-router-dom";
import { MdOutlineFoodBank } from "react-icons/md";
import "../style/navbar.scss";
import { useSelector } from "react-redux";

const Navbar = () => {
  const { quantity } = useSelector((state) => state.mainCart);

  return (
    <>
      <div className="Navbar">
        <div className="logo">
          <img src={img} alt="logo" />
        </div>
        <div className="navLinks">
          <Link id="home" to={"/"}>
            Home
          </Link>
          <Link className="nav-login" to={"/login"}>
            Login
          </Link>
          <Link className="cartLogoclass" to={"/cart"}>
            <sup className="orderNumber">{quantity}</sup>
            <MdOutlineFoodBank className="cartlogo" />
          </Link>
        </div>
      </div>
    </>
  );
};

export default Navbar;
