import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import axios from "axios";
import { FaCreditCard } from "react-icons/fa";
import { BsCashCoin } from "react-icons/bs";
import "../style/payment.scss";
import { useDispatch } from "react-redux";

const Payment = ({ cartItems, totalAmount, deliveryAddress, onBack }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [scriptLoaded, setScriptLoaded] = useState(false);

  // Load Razorpay script on component mount
  useEffect(() => {
    const loadScript = async () => {
      const loaded = await loadRazorpayScript();
      setScriptLoaded(loaded);
    };
    loadScript();
  }, []);

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }

      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      script.onload = () => {
        console.log("Razorpay script loaded");
        resolve(true);
      };
      script.onerror = () => {
        console.error("Failed to load Razorpay script");
        resolve(false);
      };
      document.body.appendChild(script);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Format cart items to match the required schema
      const formattedItems = cartItems.map((item) => ({
        itemId: item.id,
        menuItem: item.title,
        quantity: item.qty,
        price: item.price,
      }));

      // For Cash on Delivery - create order directly
      if (paymentMethod === "cod") {
        const orderResponse = await axios.post(
          "process.env.REACT_APP_SERVER_API/api/orders/create",
          {
            items: formattedItems,
            totalAmount,
            deliveryAddress,
            paymentMethod: "cod",
            paymentStatus: "pending",
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        toast.success("Order placed successfully!");
        navigate(`/cart/address/payment/Thankyou`);
        dispatch({ type: "clearCart" });
        return;
      }

      // For Razorpay payments - create payment intent first
      const paymentIntentResponse = await axios.post(
        "process.env.REACT_APP_SERVER_API/api/payments/create-intent",
        {
          amount: totalAmount,
          currency: "INR",
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const razorpayOrder = paymentIntentResponse.data;
      if (!scriptLoaded) {
        const loaded = await loadRazorpayScript();
        if (!loaded) {
          toast.error(
            "Payment gateway is not available. Please try again later."
          );
          return;
        }
      }
      const options = {
        key: process.env.REACT_APP_RAZORPAY_KEY_ID,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        name: "Tandoori cafe",
        description: "Food Order Payment",
        order_id: razorpayOrder.id,
        prefill: {
          name: user.name,
          email: user.email,
          contact: user.phone || "",
        },
        theme: {
          color: "#F37254",
        },
        handler: async (response) => {
          try {
            // Create order after successful payment
            await axios.post(
              "process.env.REACT_APP_SERVER_API/api/orders/create",
              {
                items: formattedItems,
                totalAmount,
                deliveryAddress,
                paymentMethod: "online",
                paymentStatus: "completed",
                razorpayPaymentId: response.razorpay_payment_id,
                razorpayOrderId: response.razorpay_order_id,
                razorpaySignature: response.razorpay_signature,
              },
              {
                headers: {
                  Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
              }
            );

            toast.success("Payment and order successful!");
            navigate(`/cart/address/payment/Thankyou`);
            dispatch({ type: "clearCart" });
          } catch (error) {
            toast.error(
              error.response?.data?.message ||
                "Order creation failed after payment"
            );
          } finally {
            setLoading(false);
          }
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

      rzp.on("payment.failed", (response) => {
        toast.error(`Payment failed: ${response.error.description}`);
        setLoading(false);
      });
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Payment initialization failed"
      );
      setLoading(false);
    }
  };

  return (
    <div className="payment-container">
      <div className="payment-card">
        <div className="payment-header">
          <h2>Payment Details</h2>
          <div className="total-amount">₹{totalAmount}</div>
        </div>

        <form onSubmit={handleSubmit} className="payment-form">
          <div className="payment-methods">
            <div
              className={`payment-method ${
                paymentMethod === "card" ? "active" : ""
              }`}
              onClick={() => setPaymentMethod("card")}
            >
              <div className="card-icon">
                <FaCreditCard />
              </div>
              <span>Card/UPI</span>
            </div>
            <div
              className={`payment-method ${
                paymentMethod === "cod" ? "active" : ""
              }`}
              onClick={() => setPaymentMethod("cod")}
            >
              <div className="card-icon">
                <BsCashCoin />
              </div>
              <span>Cash on Delivery</span>
            </div>
          </div>

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading
              ? "Processing..."
              : paymentMethod === "cod"
              ? "Place Order"
              : "Proceed to Pay"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Payment;
