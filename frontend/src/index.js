import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import './interceptors/axios'
import { UserProvider } from './context/userContext';
import { CartProvider } from './context/cartContext';
import { WishlistProvider } from './context/wishlistContext';
import { CouponProvider } from './context/couponContext'

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
      <UserProvider>
        <CartProvider>
          <CouponProvider>
            <WishlistProvider>
              <App />
            </WishlistProvider>
          </CouponProvider>
        </CartProvider>
      </UserProvider>
    </BrowserRouter>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
