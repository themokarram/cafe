import React from "react";
import img from "../assets/logoo.png";
import { Link } from "react-router-dom";
import { MdOutlineFoodBank } from "react-icons/md";
import "../style/navbar.scss";
import { useSelector } from "react-redux";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { cart } = useSelector((state) => state.mainCart);
  const { user } = useAuth();
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
          {user ? (
            <Link className="nav-login" to={"/profile"}>
              Profile
            </Link>
          ) : (
            <Link className="nav-login" to={"/login"}>
              Login
            </Link>
          )}

          <Link className="cartLogoclass" to={"/cart"}>
            <sup className="orderNumber">
              {cart.length === 0 ? "" : cart.length}
            </sup>
            <MdOutlineFoodBank className="cartlogo" />
          </Link>
        </div>
      </div>
    </>
  );
};

export default Navbar;
