import React, { useEffect, useState, useContext } from 'react'
import { Link, useParams } from 'react-router-dom'
import axios from 'axios'
import { CartContext } from '../context/cartContext'
import { userContext } from '../context/userContext'
import { WishlistContext } from '../context/wishlistContext'
import { Container, Grid, Box, Stack, TextField, Button, colors, Alert, IconButton, Snackbar, Slide, MenuItem, Typography } from '@mui/material'
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
    const [qty, setQty] = useState(1)
    const [color, setColor] = useState("")
    const [size, setSize] = useState("")
    const [open, setOpen] = useState(false);
    const [wishlist, setWishlist] = useState(false);
    const [state, setState] = useState({
        open: false,
        Transition: 'SlideTransition'
      });
    const [transition, setTransition] = useState(undefined);
    const [severity, setSeverity] = useState();
    const [alert, setAlert] = useState("");
    const [addIntoCart, setAddIntoCart] = useState()

    

    const fetchData = async () => {
      try {
            const res = await axios.get(`/product/${productId}`);
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
        wishlistData?.products?.map((product) => {
            if(product?.productId?._id == productId){
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
            "canBeSubscribed": false,
            "attributes": {
                "color": color,
                "size": size
            }
        }

        if(addToCart(data)){
            setOpen(true);
        }
    }

    const addVirtualProductToCart = (id, price) => {

        const data = {
            "userId": user?._id,
            "product": id,
            "quantity": "",
            "price": price,
            "subTotal": price,
            "canBeSubscribed": true,
            "attributes": {
                "color": color,
                "size": size
            }
        }

        if(addToCart(data)){
            setOpen(true);
        }
    }

    function qtyIncrease(max){
        if(qty == max){
            return
        }
        else{
            setQty(qty+1)
        }
    }

    function qtyDecrease(min){
        if(qty <= min){
            return
        }
        else{
            setQty(qty-1)
        }
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
                            {Products?.stock <= 0 ? <>
                                <Typography sx={{mt:5}}>Out of stock</Typography>
                            </> : <>
                                <Typography sx={{mt:5}}>In stock</Typography>
                            </>}
                        </div>

                        {Products?.attributes?.color.length > 0 || Products?.attributes?.size.length > 0 ? <>
                            <Stack spacing={2} direction="row" sx={{mb:5, ml:0}}>
                                {Products?.attributes?.color && Products?.attributes?.color.length > 0 ? <>
                                    <TextField
                                    id="filled-select-color"
                                    select
                                    label="Color"
                                    helperText="Please select a color"
                                    variant="filled"
                                    value={color}
                                    onChange={(e) => setColor(e.target.value)}
                                    >
                                        {Products?.attributes?.color?.map((option, index) => (
                                            <MenuItem key={index} value={option}>
                                            {option}
                                            </MenuItem>
                                        ))}
                                    </TextField>
                                </> : <></>}
                                    

                                {Products?.attributes?.size && Products?.attributes?.size.length > 0 ? <>
                                    <TextField
                                    id="filled-select-size"
                                    select
                                    label="Size"
                                    helperText="Please select a size"
                                    variant="filled"
                                    value={size}
                                    onChange={(e) => setSize(e.target.value)}
                                    >
                                        {Products?.attributes?.size?.map((option, index) => (
                                            <MenuItem key={index} value={option}>
                                            {option}
                                            </MenuItem>
                                        ))}
                                    </TextField>
                                </> : <></>}
                            </Stack>
                        </> : <></>}

                        
                        
                        {!Products?.canBeSubscribed && Products?.stock >= 1 ? <>
                            <Stack spacing={2} direction="row" sx={{mb:5, ml:0}}>
                                <Button variant="contained" size="small" color="success" onClick={() => qtyDecrease(1)}>-</Button>
                                <TextField 
                                    id="outlined-basic"
                                    label="Quantity"
                                    type="number"
                                    InputProps={{
                                        inputProps: { 
                                            max: Products?.stock, min: 1 
                                        }
                                    }}
                                    variant="outlined"
                                    sx={{ml:0, ".css-1t8l2tu-MuiInputBase-input-MuiOutlinedInput-input.Mui-disabled": {WebkitTextFillColor: whiteColor}}}
                                    disabled
                                    value={qty}
                                />
                                <Button variant="contained" size="small" color="success" onClick={() => qtyIncrease(Products?.stock)}>+</Button>
                            </Stack>
                        </> : <></>}

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

                            {Products?.canBeSubscribed ? <>
                                <Button variant="contained" size="large" color="success" onClick={() => addVirtualProductToCart(Products?._id, Products?.price)}>Add to cart</Button>                            
                            </> : !Products.canBeSubscribed && Products?.stock >= 1 ? <>
                                <Button variant="contained" size="large" color="success" onClick={() => addCart(Products?._id, qty, Products?.price)}>Add to cart</Button>                            
                            </> : <></>}



                        </Stack>
                    </div>
                </Grid>
            </Grid>
        </Box>
    </Container>
  );
}