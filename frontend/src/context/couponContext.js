import { createContext, useEffect, useState, useContext } from "react";
import axios from 'axios'
import { userContext } from "./userContext";
import { CartContext } from './cartContext'

const CouponContext = createContext({});

// context provider
const CouponProvider = ({ children }) => {
  const {user} = useContext(userContext)
  const { fetchCart } = useContext(CartContext)
  // const [state, dispatch] = useReducer(cartReducer, initialState);

  // Setup Cart functionality
  const [coupon, setCoupon] = useState()

  const fetchCoupon = async (item) => {
    try {
      const res = await axios.post(`/get-coupon-price`, {data: item}); // Api call to Fetch Cart
      const couponPrice = res?.data?.couponPrice
      if(couponPrice){
          setCoupon(res?.data?.couponPrice)
        //   return true
        const data = {
            userId: user?._id, 
            couponPrice: couponPrice
        }

        if(applyCoupon(data)){
            fetchCart()
            return true
        }
      }
    } catch (error) {
      console.log(error)
    }
  }

  const applyCoupon = async (item) => {
    try {
      const res = await axios.post('/apply-coupon', item); // Api call to add to cart
      if(res.data) {
        // await fetchCoupon();
        return true
      }
      
    } catch (error) {
      console.log(error)
    }
  }


//   useEffect(() => {
//     if(user?._id){
//       fetchCoupon()
//     }
//   }, [user])


  return (
    <CouponContext.Provider value={{ fetchCoupon, applyCoupon, coupon }}>
      {children}
    </CouponContext.Provider>
  );
}

export { CouponContext, CouponProvider }; 