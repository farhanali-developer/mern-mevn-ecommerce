// import logo from './logo.svg';
import './App.css';
import { useState, useEffect, useContext } from 'react';
import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import Footer from './components/Footer';
import SingleProduct from './components/SingleProduct';
import Cart from './components/Cart';
import Checkout from './components/Checkout';
import AllProducts from './components/AllProducts';
import { Provider } from './context/cartContext';
import Login from './components/Login';
import Register from './components/Register';
import Profile from './components/Profile';
import axios from 'axios';
import { userContext } from './context/userContext';

function App() {

  const {setUser} = useContext(userContext)

  const fetchData = async () => {
    try{
      const res = await axios.get('/user');
      setUser(res.data)
    }
    catch(e){
    }
  }

  useEffect(()=>{
    fetchData();    
  },[])

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
      <Footer />
    </Provider>
  );
}

export default App;
