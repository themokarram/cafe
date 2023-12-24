import React from "react";
import Home from "./components/Home";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Cart from "./components/Cart";
import Footer from "./components/Footer";
import { Toaster } from "react-hot-toast";
import Login from "./components/Login";
import Address from "./components/Address";
import Payment from "./components/Payment";
import Lastpage from "./components/Lastpage";
import "./style/mediaquery.scss";

function App() {
  return (
    <>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/login" element={<Login />} />
          <Route path="/cart/address" element={<Address />} />
          <Route path="/cart/address/payment" element={<Payment />} />
          <Route path="/cart/address/payment/Thankyou" element={<Lastpage />} />
        </Routes>
        <Footer />
        <Toaster />
      </BrowserRouter>
    </>
  );
}

export default App;
