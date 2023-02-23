import * as React from 'react';
import { useEffect, useState, useContext } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios'
import { CartContext } from '../context/cartContext';
import { userContext } from '../context/userContext';
import { Container, Grid, Box, Stack, TextField, Button, colors, Alert, IconButton } from '@mui/material';
// import { Favorite, FavoriteBorder } from '@mui/icons-material';
import { FavoriteBorder, Close as CloseIcon } from '@mui/icons-material';
// import CloseIcon from '@mui/icons-material/Close';

const whiteColor = colors.common.white;

export default function SingleProduct() {
    const { id } = useParams()
    const productId = id;
    const [Products, setProducts] = useState([])
    const [qty, setQty] = useState(0)
    const [open, setOpen] = useState(false);

    const {user} = useContext(userContext)
    const { addToCart } = useContext(CartContext)

    const fetchData = async () => {
      try {
            const url = `/product/${productId}`;
            const res = await axios.get(url);
            if(res){
                setProducts(res.data);
            }
        } catch (error) {
          console.log("error", error);
        }
    };

    useEffect(() => {
        fetchData();
    });

    

    

    const addCart = (id, qty, price) => {

        const subTotal = qty*price;

        const data = {
            "userId": user?._id,
            "product": id,
            "quantity": qty,
            "price": price,
            "subTotal": subTotal,
        }

        if(addToCart(data)){
            setOpen(true);
        }
    }

    function qtyIncrease(){
        setQty(qty+1)
    }
    function qtyDecrease(){
        setQty(qty-1)
    }

    const notification = () => {
        return (
            <Alert severity="success" action={
                <IconButton
                  aria-label="close"
                  color="inherit"
                  size="small"
                  onClick={() => {
                    setOpen(false);
                  }}
                >
                  <CloseIcon fontSize="inherit" />
                </IconButton>
              }>Cart Updated! Go to <Link to="/cart">Cart</Link> page.</Alert>
        )
    }

  return (
    <Container maxWidth="xl">
        <Box sx={{ width: '100%', m: 2 }}>
            <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 2 }} justifyContent="space-between">
                <Grid item xs={12} md={12} style={{ marginTop: "30px"}}>
                    {open ? notification() : ''}
                </Grid>
                <Grid item xs={12} md={12} style={{ marginTop: "30px"}}>
                    <h1 style={{color: whiteColor}}>{Products?.title}</h1>
                </Grid>
                <Grid item xs={12} md={5} style={{ marginTop: "30px"}}>
                    <img style={{ height: "auto", width: "100%" }} src={`${Products?.thumbnail}`} alt="Product"/>
                </Grid>
                <Grid item xs={12} md={6} style={{ marginTop: "30px", color: whiteColor}}>
                    <p>{Products?.description}</p>
                    <div style={{marginTop: "50px"}}>
                        <p><b>SKU:</b> ABC</p>
                        <p><b>Category: </b>{Products?.category}</p>
                        <p><b>Brand: </b> {Products?.brand}</p>
                        <div style={{ fontWight: "bold", marginTop: "20px", marginBottom: "100px", textAlign: "left" }}>
                            <s style={{ fontSize: "1.1rem", color: whiteColor }}>$12.00</s>
                            <span style={{ fontSize: "1.1rem", fontWeight: "bold", color: "#dc3545", marginLeft: "10px" }}>${Products?.price}</span>
                        </div>
                        <Stack spacing={2} direction="row" sx={{mb:5, ml:0}}>
                            <Button variant="contained" size="small" color="success" onClick={() => qtyDecrease()}>-</Button>
                            <TextField 
                                id="outlined-basic"
                                label="Quantity"
                                type="number"
                                InputProps={{
                                    inputProps: { 
                                        max: 5, min: 1 
                                    }
                                }}
                                variant="outlined"
                                sx={{ml:0, ".css-1t8l2tu-MuiInputBase-input-MuiOutlinedInput-input.Mui-disabled": {WebkitTextFillColor: whiteColor}}}
                                disabled
                                value={qty}
                            />
                            <Button variant="contained" size="small" color="success" onClick={() => qtyIncrease()}>+</Button>
                        </Stack>
                        <Stack spacing={2} direction="row">
                            <Link to="/wishlist" style={{textDecoration: "none"}}>
                                <Button variant="outlined" size="large"><FavoriteBorder />Add to wishlist</Button>
                            </Link>
                                <Button variant="contained" size="large" color="success" onClick={() => addCart(Products?._id, qty, Products?.price)}>Add to cart</Button>
                            <Link to="/cart" style={{textDecoration: "none"}}>
                                {/* <Button variant="contained" size="large" color="success" onClick={() => cartFunction(Products?._id)}>Add to cart</Button> */}
                            </Link>
                        </Stack>
                    </div>
                </Grid>
            </Grid>
        </Box>
    </Container>
  );
}