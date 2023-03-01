import React, { useEffect, useState, useContext } from 'react'
import { Link, useParams } from 'react-router-dom'
import axios from 'axios'
import { CartContext } from '../context/cartContext'
import { userContext } from '../context/userContext'
import { WishlistContext } from '../context/wishlistContext'
import { Container, Grid, Box, Stack, TextField, Button, colors, Alert, IconButton, Snackbar, Slide } from '@mui/material'
import { Favorite, FavoriteBorder, Close as CloseIcon } from '@mui/icons-material'

const whiteColor = colors.common.white;

function TransitionDown(props) {
    return <Slide {...props} direction="down" />;
  }

export default function SingleProduct() {
    const { id } = useParams()
    const productId = id;

    const { user, isLoggedIn } = useContext(userContext)
    const { addToCart } = useContext(CartContext)
    const { addToWishlist, removeFromWishlist, wishlistData } = useContext(WishlistContext)

    const [Products, setProducts] = useState([])
    const [qty, setQty] = useState(0)
    const [open, setOpen] = useState(false);
    const [wishlist, setWishlist] = useState(false);
    const [state, setState] = useState({
        open: false,
        Transition: 'SlideTransition'
      });
      const [transition, setTransition] = useState(undefined);
      const [severity, setSeverity] = useState();
      const [alert, setAlert] = useState("");

    

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
    }, [])

    useEffect(() => {
        const wishlistProducts = wishlistData?.products
        wishlistProducts?.map((item) => {
            if(item?.productId == productId){
                setWishlist(true)
            }
            else{
                setWishlist(false)
            }
        })
    }, [wishlistData])

    

    

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

    const handleWishlist = (userId, productId) => {
        const addToWishlistData = {
            "userId" : userId,
            "products" : [{
                "productId": productId
            }]
        }

        if(wishlist == false){
            addToWishlist(addToWishlistData)
            setAlert("Product added to wishlist.");
            setSeverity("success");
            setState({ open: true });
            setTransition(() => TransitionDown);
        }
        else{
            removeFromWishlist(productId)
            setAlert("Product removed from wishlist.");
            setSeverity("success");
            setState({ open: true });
            setTransition(() => TransitionDown);
        }

    }

    const handleClose = () => {
        setState({ ...state, open: false });
    };

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
                            <s style={{ fontSize: "1.1rem", color: whiteColor }}>${Products?.saleprice}</s>
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
                            {isLoggedIn() ? 
                            <>
                            {wishlist ? <>
                                <Button variant="outlined" size="large" onClick={e => handleWishlist(user?._id, productId)}><Favorite sx={{mr:1}} />Remove From wishlist</Button>
                            </> : <>
                                <Button variant="outlined" size="large" onClick={e => handleWishlist(user?._id, productId)}><FavoriteBorder sx={{mr:1}} />Add to wishlist</Button>
                            </>}
                                
                            </> : 
                            <></>}
                            <Snackbar
                                anchorOrigin={{ vertical: "top", horizontal: "right" }}
                                open={state.open}
                                onClose={handleClose}
                                autoHideDuration={3000}
                                TransitionComponent={transition}
                                key={state.vertical + state.horizontal}
                                action={
                                    <React.Fragment>
                                    <IconButton
                                        aria-label="close"
                                        color="inherit"
                                        sx={{ p: 0.5 }}
                                        onClick={handleClose}
                                    >
                                        <CloseIcon />
                                    </IconButton>
                                    </React.Fragment>
                                }
                            >
                                <Alert onClose={handleClose} severity={severity} sx={{ width: '100%' }}>
                                    {alert}
                                </Alert>
                            </Snackbar>
                            <Button variant="contained" size="large" color="success" onClick={() => addCart(Products?._id, qty, Products?.price)}>Add to cart</Button>
                        </Stack>
                    </div>
                </Grid>
            </Grid>
        </Box>
    </Container>
  );
}