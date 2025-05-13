import { createReducer } from "@reduxjs/toolkit";

export const cartReducer = createReducer(
  {
    cart: [],
    Allitems: [],
    subtotal: "",
    delivery: "",
    gst: "",
    discount: "",
    total: "",
    quantity: "",
    user: null,
  },
  {
    addToCart: (state, action) => {
      const items = action.payload;
      const isItemExist = state.cart.find((i) => i.id === items.id);

      if (isItemExist) {
        state.cart.forEach((i) => {
          if (i.id === items.id) i.qty += 1;
        });
      } else {
        state.cart.push(items);
      }
    },

    decrement: (state, action) => {
      const items = state.cart.find((i) => i.id === action.payload);

      if (items.qty > 1) {
        state.cart.forEach((i) => {
          if (i.id === items.id) i.qty -= 1;
        });
      }
    },

    deletehandler: (state, action) => {
      state.cart = state.cart.filter((i) => i.id !== action.payload);
    },
    calculatePrice: (state) => {
      let sum = 0;
      state.cart.forEach((i) => (sum += i.price * i.qty));
      state.subtotal = sum;
      state.gst = +(state.subtotal * 0.05).toFixed();
      state.discount = -(state.subtotal * 0.1).toFixed();
      state.delivery = state.subtotal > 500 ? 0 : 30;
      state.total =
        state.subtotal + state.gst + state.delivery + state.discount;
    },
    totalqty: (state) => {
      let total = 0;
      state.cart.forEach((i) => (total += i.qty));
      state.quantity = total;
    },
    clearCart: (state) => {
      state.cart = [];
    },

    Login: (state, action) => {
      state.user = {
        uid: action.payload.user.uid,
        email: action.payload.user.email,
      };
    },
  }
);
