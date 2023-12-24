import React from "react";
import { useSelector } from "react-redux";
//import { auth } from "./Firebase";
import { useNavigate } from "react-router-dom";
import "../style/paymnet.scss";

const Payment = () => {
  const { cart, total } = useSelector((state) => state.mainCart);

  const navigate = useNavigate();

  return (
    <div className="pay-container">
      <div className="pay-box">
        <section className="pay-cart">
          {cart.map((i) => (
            <div key={i.id}>
              <h5>{i.title}</h5>
              <h5>{i.qty} plates</h5>
              <h5>{i.price}/plate</h5>
            </div>
          ))}
        </section>
        <div>
          <h4>Total payable amount: Rs. {total}</h4>
        </div>
        <div className="pay-input">
          <h3>Payment Options</h3>
          <form>
            <h4>
              <input type="checkbox" /> UPI
            </h4>
            <h4>
              <input type="checkbox" /> Debit Card
            </h4>
            <h4>
              <input type="checkbox" /> Credit Card
            </h4>
            <h4>
              <input type="checkbox" /> Cash on Delivery
            </h4>
            <button onClick={() => navigate("/cart/address/payment/Thankyou")}>
              Proceed payment
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Payment;
