import { createContext, useEffect, useState, useContext } from "react";
import axios from 'axios'
import { userContext } from "./userContext";

const CartContext = createContext({});

// context provider
const CartProvider = ({ children }) => {
  const {user} = useContext(userContext)
  // const [state, dispatch] = useReducer(cartReducer, initialState);

  // Setup Cart functionality
  const [cartData, setCartData] = useState([])

  const fetchCart = async () => {
    try {
      const res = await axios.get(`/cart`); // Api call to Fetch Cart
      setCartData(res.data)
    } catch (error) {
      console.log(error)
    }
  }

  const addToCart = async (item) => {
    try {
      const res = await axios.post('/cart', item); // Api call to add to cart
      if(res.data) {
        await fetchCart();
      }
      
    } catch (error) {
      console.log(error)
    }
  }

  const addVirtualProductToCart = async (item) => {
    try {
      const res = await axios.post('/virtual-cart', item); // Api call to add to cart
      if(res.data) {
        await fetchCart();
      }
      
    } catch (error) {
      console.log(error)
    }
  }

  const updateCart = async (item) => {
    try {
      const res = await axios.put('/cart', item); // Api call to update cart
      if(res.data) {
        await fetchCart()
      }
    } catch (error) {
      console.log(error)
    }
  }

  const removeFromCart = async (id) => {
    try {
      const res = await axios.delete(`/delete-cart-item/${user?._id}/${id}`); // Api call to remove to cart
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
    <CartContext.Provider value={{ addToCart, addVirtualProductToCart, updateCart, removeFromCart, cartData, fetchCart, setCartData }}>
      {children}
    </CartContext.Provider>
  );
}

export { CartContext, CartProvider }; 