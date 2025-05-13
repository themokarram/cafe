import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { MdDeleteForever } from "react-icons/md";
import { toast } from "react-hot-toast";
import "../style/cart.scss";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Cart = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { cart, subtotal, gst, delivery, total, discount } = useSelector(
    (state) => state.mainCart
  );

  const handleOrder = () => {
    if (!user) {
      toast.error("Please sign in to place your order");
      // Store the current cart state in localStorage
      localStorage.setItem(
        "cartState",
        JSON.stringify({
          cart,
          subtotal,
          gst,
          delivery,
          total,
          discount,
        })
      );
      navigate("/login", { state: { from: "cart" } });
      return;
    }
    navigate("/cart/address");
  };

  const increment = (id) => {
    dispatch({
      type: "addToCart",
      payload: { id },
    });
    toast.success("One item is added to cart");
    dispatch({ type: "calculatePrice" });
    dispatch({ type: "totalqty" });
  };

  const decrement = (id) => {
    dispatch({
      type: "decrement",
      payload: id,
    });
    toast.success("One item is removed from cart");
    dispatch({ type: "calculatePrice" });
    dispatch({ type: "totalqty" });
  };

  const deletehandler = (id) => {
    dispatch({
      type: "deletehandler",
      payload: id,
    });
    toast.success("An Item is deleted from cart");
    dispatch({ type: "calculatePrice" });
    dispatch({ type: "totalqty" });
  };

  return (
    <div className="cartHome">
      <main className="cart">
        {cart.length > 0 ? (
          cart.map((i) => (
            <CartItem
              key={i.id}
              id={i.id}
              image={i.image}
              title={i.title}
              qty={i.qty}
              price={i.price}
              increment={increment}
              decrement={decrement}
              deletehandler={deletehandler}
            />
          ))
        ) : (
          <div className="empty-cart">
            <h1>No Items added yet..</h1>
          </div>
        )}
      </main>
      {cart.length > 0 ? (
        <aside>
          <h4>
            Subtotal:&nbsp;&nbsp;--------&nbsp;&nbsp;&#8377;&nbsp;{subtotal}
          </h4>
          <h4>Delivery charge:&nbsp;--&nbsp;&#8377;&nbsp;{delivery}</h4>
          <h4>
            Discount:&nbsp;&nbsp;--------&nbsp;&nbsp;&#8377;&nbsp;{discount}
          </h4>
          <h4>GST:&nbsp;&nbsp;--------------&nbsp;&nbsp;&#8377;&nbsp;{gst}</h4>
          <h3>Total Amount:&nbsp;---&nbsp;&#8377;&nbsp;{total}</h3>

          <button onClick={handleOrder} className="place-order-btn">
            {user ? "PLACE ORDER" : "SIGN IN TO ORDER"}
          </button>
        </aside>
      ) : (
        " "
      )}
    </div>
  );
};

const CartItem = ({
  image,
  title,
  price,
  qty,
  id,
  deletehandler,
  increment,
  decrement,
}) => (
  <div className="cartItem">
    <img src={image} alt={title} />
    <h3>{title}</h3>

    <div className="button">
      <button onClick={() => decrement(id)}>-</button>
      <h4>{qty}</h4>
      <button onClick={() => increment(id)}>+</button>
      <h4>Rs.{price}/plate</h4>
      <button onClick={() => deletehandler(id)}>
        <MdDeleteForever />
      </button>
    </div>
  </div>
);

export default Cart;
