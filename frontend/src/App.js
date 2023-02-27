import './App.css';
import { useEffect, useContext, useState } from 'react';
import { Routes, Route } from 'react-router-dom'
import axios from 'axios';
import Navbar from './components/Navbar';
// import Footer from './components/Footer';
import SingleProduct from './components/SingleProduct';
import Cart from './components/Cart';
import Checkout from './components/Checkout';
import AllProducts from './components/AllProducts';
import Login from './components/Login';
import Register from './components/Register';
import Profile from './components/Profile';
import { Provider } from './context/cartContext';
import { userContext } from './context/userContext';

function App() {

  const { setUser } = useContext(userContext)

  const fetchData = async () => {
    try{
      const res = await axios.get('/user');
      setUser(res.data);
    }
    catch(error){
      if (error.response && error.response.status === 404) {
        // User not found, handle accordingly
        console.log('User not found.');
      } else {
        console.log(error);
      }
    }
  }

  useEffect(()=>{
    fetchData();
  }, []);

  return (
    <Provider>
      <Navbar />
      <Routes>
        <Route path="/" element={<AllProducts />} exact />
        <Route path="/product/:id" element={<SingleProduct />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Register />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
      {/* <Footer /> */}
    </Provider>
  );
}

export default App;
