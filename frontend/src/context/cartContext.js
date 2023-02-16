import { useReducer, createContext, useEffect, useState, useContext } from "react";
import axios from 'axios'
import { userContext } from "./userContext";

// initial state
const initialState = {
  cart: {},
};

const CartContext = createContext({});

function cartReducer(state, action) {
  switch (action.type) {
    case "ADD_TO_CART":
      const item = state.cart[action.payload._id];
      return {
        ...state,
        cart: {
          ...state.cart,
          [action.payload._id]: item ? {
            ...item,
            qty: item.qty + 1,
          } : {
            ...action.payload,
            qty: 1,
          }
        }
      }
    case "REMOVE_FROM_CART":
      let newCart = { ...state.cart };
      delete newCart[action.payload._id];
      return {
        ...state,
        cart: newCart,
      }
    default:
      return state;
  }
}

// context provider
const Provider = ({ children }) => {
  const {user} = useContext(userContext)
  const [state, dispatch] = useReducer(cartReducer, initialState);

  // Setup Cart functionality
  const [cartData, setCartData] = useState([])
  

  // console.log(user)

  const fetchCart = async () => {
    try {
      
      const res = await axios.get(`/cart`); // Api call to Fetch Cart
      if(res.data) {
        setCartData(res.data)
      }
    } catch (error) {
      console.log(error)
    }
  }
  const addToCart = async (item) => {
    try {
      const res = await axios.post('/cart', item); // Api call to add to cart
      if(res.data) {
        await fetchCart()
      }
    } catch (error) {
      console.log(error)
    }
  }
  const removeFromCart = async (id) => {
    try {
      const res = null; // Api call to remove to cart
      if(res.data) {
        await fetchCart()
      }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    if(user?._id){
      fetchCart()
    }
  }, [user])


  return (
    <CartContext.Provider value={{ state, dispatch, addToCart, removeFromCart, cartData }}>
      {children}
    </CartContext.Provider>
  );
}

export { CartContext, Provider }; 