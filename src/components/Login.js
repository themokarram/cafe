import { React, useRef } from "react";
import "../style/login.scss";
import { auth } from "./Firebase";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { useDispatch } from "react-redux";

const Login = () => {
  const dispatch = useDispatch();

  const emailref = useRef(null);
  const passwordref = useRef(null);

  const loginHandler = (e) => {
    e.preventDefault();
    signInWithEmailAndPassword(
      auth,
      emailref.current.value,
      passwordref.current.value
    )
      .then((userCredential) => {
        dispatch({ type: "Login", payload: userCredential });
        console.log(userCredential);
      })
      .catch((error) => {
        alert(error.message);
      });
  };

  const signupHandler = (e) => {
    e.preventDefault();
    createUserWithEmailAndPassword(
      auth,
      emailref.current.value,
      passwordref.current.value
    )
      .then((userCredential) => {
        console.log(userCredential);
      })
      .catch((error) => {
        alert(error.message);
      });
  };

  return (
    <div className="login-container">
      <div className="login-form">
        <h3>Login here.</h3>

        <form>
          <input
            ref={emailref}
            className="form-email"
            type="email"
            placeholder="Email Address"
          />
          <input
            ref={passwordref}
            className="form-pw"
            type="password"
            placeholder="Password"
          />
          <button className="bs" onClick={loginHandler}>
            Submit
          </button>
          <h5> New to Tandoori cafe?</h5>
          <button className="bn" onClick={signupHandler}>
            Click Here to create New Account.
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
