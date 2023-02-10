// import logo from './logo.svg';
import './App.css';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import Footer from './components/Footer';
import { Routes, Route } from 'react-router-dom'
import SingleProduct from './components/SingleProduct';
import Cart from './components/Cart';
import Checkout from './components/Checkout';
import AllProducts from './components/AllProducts';

function App() {
  return (
    <div>
      <Navbar />
      
      {/* <Footer /> */}
      <Routes>
        <Route path="/" element={<AllProducts />} exact />
        <Route path="/product/:id" element={<SingleProduct />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
      </Routes>
    </div>
  );
}

export default App;
