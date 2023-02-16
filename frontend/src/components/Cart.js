import * as React from 'react';
import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { common } from '@mui/material/colors';
import Container from '@mui/material/Container';

import { CartContext } from '../context/cartContext';



const whiteColor = common.white;

const Cart = () => {
    
    const { state, dispatch, cartData } = useContext(CartContext);
    const [product, setProduct] = useState({});

    console.log(cartData)

    // Products && Products.map((item) => {
    //     console.log(item.productId)
    // })

    // const { cart } = state;
    // let total = 0;

    // for(const [key, value] of Object.entries(cart)) {
    //     total = total + product.price * product.qty;
    // }


  return (
    <div>
        <Box sx={{ width: '100%', m: 2 }}>
            <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 2 }} justifyContent="center">
                <Grid item xs={12} md={8} style={{ marginTop: "30px"}}>
                    <h2 style={{ textAlign: "center", marginBottom: "50px", color: "#fff" }}>Shopping Cart</h2>
                    <TableContainer component={Paper} className="box-shadow">
                        <Table sx={{ minWidth: 650, "th, td, input, label": {color: whiteColor} }} aria-label="simple table">
                            <TableHead>
                                <TableRow>
                                    <TableCell></TableCell>
                                    <TableCell></TableCell>
                                    <TableCell align="center">Price</TableCell>
                                    <TableCell align="center">QTY</TableCell>
                                    <TableCell align="center">Total</TableCell>
                                    <TableCell align="center"></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                            {cartData && cartData?.products?.map((item) => (
                                <TableRow
                                key={item?.product?._id}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >
                                <TableCell component="th" scope="row">
                                    <img src={`${item?.product?.thumbnail}`} style={{ height: "50px", width: "50px", objectFit: "cover" }} alt="" />
                                </TableCell>
                                <TableCell align="center">{item?.product?.title}</TableCell>
                                <TableCell align="center">{item?.product?.price}</TableCell>
                                <TableCell align="center">
                                    <TextField
                                        id="standard-number"
                                        label="Quantity"
                                        type="number"
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                        variant="standard"
                                        value={item?.quantity}
                                    />
                                </TableCell>
                                <TableCell align="center">$8.99</TableCell>
                                <TableCell align="center">
                                    <Button variant="contained" color="error">Remove</Button>
                                </TableCell>
                                </TableRow>
                            ))}
                            </TableBody>

                            <TableHead>
                                <TableRow>
                                    <TableCell></TableCell>
                                    <TableCell></TableCell>
                                    <TableCell align="center">Order Total</TableCell>
                                    <TableCell align="center">5</TableCell>
                                    <TableCell align="center">$314.50</TableCell>
                                    <TableCell align="center"></TableCell>
                                </TableRow>
                            </TableHead>
                        </Table>
                    </TableContainer>

                    <Link to="/checkout">
                        <Button variant="contained" style={{marginTop: "100px", textAlign: "right", display: "block", marginLeft: "auto"}} size="large">Proceed to Checkout</Button>
                    </Link>
                </Grid>
            </Grid>
        </Box>
    </div>
  )
}

export default Cart