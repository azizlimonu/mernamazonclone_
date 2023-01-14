import { createContext, useReducer } from "react";
import { v4 as uuid } from 'uuid';

export const Store = createContext();

const initialState = {
  userInfo: localStorage.getItem('userInfo')
    ? JSON.parse(localStorage.getItem('userInfo'))
    : null,
  cart: {
    cartItems: localStorage.getItem('cartItems')
      ? JSON.parse(localStorage.getItem('cartItems'))
      : [],
    shippingAddress: localStorage.getItem('shippingAddress')
      ? JSON.parse(localStorage.getItem('shippingAddress'))
      : [],
    paymentMethod: localStorage.getItem('paymentMethod')
      ? localStorage.getItem('paymentMethod')
      : '',
  },
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'CART_ADD_ITEM':
      const newItem = action.payload;
      const existItem = state.cart.cartItems.find(
        (item) => item._id === newItem._id && newItem.choose === item.choose
      );
      // apakah existItem is true ada di list of cartItems ? 
      // if true => map through the cartItems, and each item that mapping
      // 1. if the item.id is equal to the exitItem.id
      //    if its same than the variable will assigned to newItem else if the variable will assigned to item.
      // 2. Else if the item.id doesnt equal with exisItem.id
      //    we will push the newItem array to the list of cartItems
      const uniqueId = uuid().toString();
      const cartItems = existItem
        ? state.cart.cartItems.map((item) =>
          item._id === existItem._id
            ? newItem
            : item
        )
        : [...state.cart.cartItems, { ...newItem, cartId: uniqueId }];
      localStorage.setItem('cartItems', JSON.stringify(cartItems));
      return { ...state, cart: { ...state.cart, cartItems } };

    case 'CART_REMOVE_ITEM': {
      // check item.id and item.choose if same with the cartItems []
      const cartItems = state.cart.cartItems.filter(
        (item) => item.cartId !== action.payload.cartId
      );
      localStorage.setItem('cartItems', JSON.stringify(cartItems));
      return { ...state, cart: { ...state.cart, cartItems } };
    }

    case 'CART_CLEAR':
      localStorage.removeItem('cartItems');
      return { ...state, cart: { ...state.cart, cartItems: [] } };

    case 'USER_SIGNIN':
      return { ...state, userInfo: action.payload };

    case 'USER_SIGNOUT':
      return {
        ...state,
        userInfo: null,
        cart: {
          cartItems: [],
          shippingAddress: {},
          paymentMethod: ''
        }
      };

    case 'SAVE_SHIPPING_ADDRESS':
      return {
        ...state,
        cart: {
          ...state.cart,
          shippingAddress: action.payload
        }
      };

    case 'SAVE_PAYMENT_METHOD':
      return {
        ...state,
        cart: {
          ...state.cart,
          paymentMethod: action.payload
        }
      }

    default:
      return state;
  }
};

export const StoreProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const value = { state, dispatch };
  return (
    <Store.Provider value={value}>
      {children}
    </Store.Provider>
  )
};