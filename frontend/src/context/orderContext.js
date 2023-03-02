import { createContext, useEffect, useState, useContext } from "react";
import axios from 'axios'
import { userContext } from "./userContext";

const OrderContext = createContext({});

// context provider
const OrderProvider = ({ children }) => {
  const {user} = useContext(userContext)

  // Setup Cart functionality
  const [wishlistData, setWishlistData] = useState([])

  const fetchWishlist = async () => {
    try {
      
      const res = await axios.get(`/order`); // Api call to Fetch Wishlist
      setWishlistData(res.data)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    if(user?._id){
      fetchWishlist()
    }
  }, [user])


  return (
    <OrderContext.Provider value={{ wishlistData }}>
      {children}
    </OrderContext.Provider>
  );
}

export { OrderContext, OrderProvider }; 