import * as React from 'react';
import { Route, Routes } from "react-router-dom"
import { ThemeProvider, createTheme } from '@mui/material/styles';
import Container from '@mui/material/Container';
import AllProducts from './AllProducts';
import SingleProduct from './SingleProduct';
import Cart from './Cart';
import Checkout from './Checkout';

const darkTheme = createTheme({
    palette: {
      mode: 'dark',
      primary: {
        main: '#1976d2',
      },
    },
  });

export default function Dashboard() {
  return (
    <ThemeProvider theme={darkTheme}>
        <Container maxWidth="xl">
            {/* <AllProducts /> */}
            <SingleProduct />
            {/* <Cart /> */}
            {/* <Checkout /> */}
        </Container>
    </ThemeProvider>
  );
}