import { createContext, useEffect, useState, useContext } from "react";
import axios from 'axios'
import { userContext } from "./userContext";
import { CartContext } from "./cartContext"

const OrderContext = createContext({});

// context provider
const Provider = ({ children }) => {
  const {user} = useContext(userContext);
  const { cartData } = useContext(CartContext);

  // Setup Cart functionality
  const [orderData, setOrderData] = useState()

  const fetchOrder = async () => {
    try {
      
        await setOrderData(cartData);
        console.log(orderData)
    //   const res = await axios.get(`/cart`); // Api call to Fetch Cart
    //   if(res.data) {
    //     setOrderData(res.data)
    //   }
    } catch (error) {
      console.log(error)
    }
  }

  const addOrder = async () => {
    try {
    //   const res = await axios.post('/cart', item); // Api call to add to cart
    //   if(res.data) {
    //     await fetchOrder();
    //   }
    await fetchOrder();
    
      
    } catch (error) {
      console.log(error)
    }
  }


  useEffect(() => {
    if(user?._id){
      fetchOrder()
    }
  }, [user])


  return (
    <OrderContext.Provider value={{ addOrder }}>
      {children}
    </OrderContext.Provider>
  );
}

export { OrderContext, Provider }; 