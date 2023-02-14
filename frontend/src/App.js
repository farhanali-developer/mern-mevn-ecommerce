// import logo from './logo.svg';
import './App.css';
import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import Footer from './components/Footer';
import SingleProduct from './components/SingleProduct';
import Cart from './components/Cart';
import Checkout from './components/Checkout';
import AllProducts from './components/AllProducts';
import { Provider } from './context';
import Login from './components/Login';
import Register from './components/Register';

function App() {
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
      </Routes>
      <Footer />
    </Provider>
  );
}

export default App;
