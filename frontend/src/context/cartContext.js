import { createContext, useEffect, useState, useContext } from "react";
import axios from 'axios'
import { userContext } from "./userContext";

const CartContext = createContext({});

// context provider
const Provider = ({ children }) => {
  const {user} = useContext(userContext)
  // const [state, dispatch] = useReducer(cartReducer, initialState);

  // Setup Cart functionality
  const [cartData, setCartData] = useState([])

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
        await fetchCart();
      }
      
    } catch (error) {
      console.log(error)
    }
  }

  const updateCart = async (item) => {
    try {
      const res = await axios.put('/cart', item); // Api call to add to cart
      if(res.data) {
        await fetchCart()
      }
    } catch (error) {
      console.log(error)
    }
  }

  const removeFromCart = async (id) => {
    try {
      const res = await axios.delete(`/delete_cart_item/${user?._id}/${id}`); // Api call to remove to cart
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
    <CartContext.Provider value={{ addToCart, updateCart, removeFromCart, cartData }}>
      {children}
    </CartContext.Provider>
  );
}

export { CartContext, Provider }; 