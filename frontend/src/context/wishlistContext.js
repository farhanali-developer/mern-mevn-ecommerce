import { createContext, useEffect, useState, useContext } from "react";
import axios from 'axios'
import { userContext } from "./userContext";

const WishlistContext = createContext({});

// context provider
const WishlistProvider = ({ children }) => {
  const {user} = useContext(userContext)

  // Setup Cart functionality
  const [wishlistData, setWishlistData] = useState([])

  const fetchWishlist = async () => {
    try {
      
      const res = await axios.get(`/wishlist`); // Api call to Fetch Wishlist
      setWishlistData(res.data)
    } catch (error) {
      console.log(error)
    }
  }

  const addToWishlist = async (item) => {
    try {
      const res = await axios.post('/wishlist', item); // Api call to add to wishlist
      if(res.data) {
        await fetchWishlist();
      }
      
    } catch (error) {
      console.log(error)
    }
  }

  const removeFromWishlist = async (id) => {
    try {
      const res = await axios.delete(`/delete_wishlist_item/${user?._id}/${id}`); // Api call to remove from wishlist
      await fetchWishlist()
      
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
    <WishlistContext.Provider value={{ addToWishlist, removeFromWishlist, wishlistData }}>
      {children}
    </WishlistContext.Provider>
  );
}

export { WishlistContext, WishlistProvider }; 