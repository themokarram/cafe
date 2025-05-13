import React from "react";
import img from "../assets/logooo.png";
import {
  AiFillHeart,
  AiFillFacebook,
  AiFillInstagram,
  AiFillLinkedin,
  AiFillGoogleSquare,
} from "react-icons/ai";
import "../style/footer.scss";

const Footer = () => {
  return (
    <div className="mainfooter">
      <div className="logo">
        <img src={img} alt="logo" />
        <h5>All Rights Reserved.</h5>
      </div>

      <div className="moko">
        <h5>
          Made with <AiFillHeart style={{ color: "red" }} />
        </h5>
        <h4>By MOKARRAM</h4>
      </div>
      <div className="follow">
        <h5>FOLLOW US</h5>
        <a href="http://facebook.com">
          <AiFillFacebook />
          Facebook
        </a>
        <a href="http://instagram.com">
          <AiFillInstagram />
          Instagram
        </a>
        <a href="http://twitter.com">
          <AiFillLinkedin />
          Linkedin
        </a>
        <a href="mailto:themokarram@gmail.com">
          <AiFillGoogleSquare />
          Gmail
        </a>
      </div>
    </div>
  );
};

export default Footer;
