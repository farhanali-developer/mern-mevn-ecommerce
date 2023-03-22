import * as React from 'react';
import { useContext, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CartContext } from '../context/cartContext';
import { userContext } from '../context/userContext';
import { CouponContext } from '../context/couponContext'
import { Grid, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, TextField, colors, Container, Snackbar, IconButton, Slide, Alert as MuiAlert, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Stack, MenuItem, OutlinedInput, InputAdornment  } from '@mui/material'
// import CloseIcon from '@mui/icons-material/Close';
import { Close as CloseIcon, Delete } from '@mui/icons-material'
import axios from 'axios';

const whiteColor = colors.common.white;

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function TransitionDown(props) {
    return <Slide {...props} direction="down" />;
}

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="down" ref={ref} {...props} />;
});

const deleteHover = {
    "&:hover" : {
        cursor : "pointer",
        color : "red"
    }
}


const Cart = () => {
    
    const { cartData, updateCart, removeFromCart, setCartData, fetchCart } = useContext(CartContext)
    const { user } = useContext(userContext)
    const { fetchCoupon, applyCoupon, coupon } = useContext(CouponContext)
    const [newCartData, setNewCartData] = useState([])
    const [updateCartData, setUpdateCartData] = useState()
    const [color, setColor] = useState("")
    const [size, setSize] = useState("")
    const [open, setOpen] = useState(false)
    const [state, setState] = useState({
        open: false,
        Transition: 'SlideTransition'
    })

    const [transition, setTransition] = useState(undefined)
    const [alert, setAlert] = useState("")
    const [couponCode, setCouponCode] = useState("")

    const handleDialogOpen = () => {
        setOpen(true);
    };
    
    const handleDialogClose = () => {
        setOpen(false);
    };

    function qtyChange(id, qty, price){
        qtyUpdate(id, qty, price)
    }

    function qtyUpdate(id, qty, price){
        const subTotal = qty*price;

        const data = {
            "userId": user?._id,
            "product": id,
            "quantity": qty,
            "price": price,
            "canBeSubscribed": false,
            "subTotal": subTotal,
            "attributes" : {
                "color" : "",
                "size": ""
            }
        }

        if(updateCart(data)){
            setAlert("Quantity Updated!");
            openSnackBar()
        }
    }

    function removeProduct(id){
        handleDialogClose();
        if(removeFromCart(id)){
            setAlert("Product Removed from Cart!");
            openSnackBar()
        }
    }

    const openSnackBar = () => {
        setState({ open: true });
        setTransition(() => TransitionDown);
    };

    const handleClose = () => {
        setState({ ...state, open: false });
    };

    function qtyIncrease(id, qty, price){
        const newQty = qty+1;
        qtyUpdate(id, newQty, price);
    }

    function qtyDecrease(id, qty, price){
        const newQty = qty-1;
        qtyUpdate(id, newQty, price);
    }

    function colorUpdate(id, color){

        const data = {
            "userId": user?._id,
            "product": id,
            "attributes" : {
                "color" : color
            },
        }

        if(updateCart(data)){
            setAlert("Color Updated!");
            openSnackBar()
        }
    }

    function sizeUpdate(id, size){

        const data = {
            "userId": user?._id,
            "product": id,
            "attributes" : {
                "size" : size
            },
        }

        if(updateCart(data)){
            setAlert("Size Updated!");
            openSnackBar()
        }
    }

    const applyCouponCode = async () => {
        if(fetchCoupon(couponCode)){
            fetchCart()
            setAlert("Coupon Applied on Cart!");
            openSnackBar()
        }
        else{
            fetchCart()
            setAlert("Something went wrong!");
            openSnackBar()
        }
    }
        
    

    useEffect(() => {
        setNewCartData(cartData?.products)
        if(!updateCartData?._id){
            setUpdateCartData(cartData)
        }
    }, [cartData])


  return (
    <Container maxWidth="xl">
        <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 2 }} justifyContent="center" sx={{maxWidth: "1500px"}}>
            <Grid item xs={12} sx={{ pl:0, mt:5 }}>
                <h2 style={{ textAlign: "center", marginBottom: "50px", color: whiteColor }}>Shopping Cart</h2>
                {!cartData?.products ? <><h5 style={{color: whiteColor, textAlign: "center"}}>Your Cart is Empty!</h5></> : 
                <>
                    <TableContainer sx={{py:5, px:2}} className="box-shadow">
                        <Table sx={{ width: "100%", "th, td, input, label": {color: whiteColor} }} aria-label="simple table">
                            <TableHead>
                                <TableRow>
                                    <TableCell></TableCell>
                                    <TableCell>Product Title</TableCell>
                                    <TableCell align="center">Color</TableCell>
                                    <TableCell align="center">Size</TableCell>
                                    <TableCell align="center">Price</TableCell>
                                    <TableCell align="center">QTY</TableCell>
                                    <TableCell align="center">Total</TableCell>
                                    <TableCell align="center">Delete</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                            {newCartData && newCartData?.map((item) => {
                                return (
                                <TableRow
                                key={item?.product?._id}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >
                                    <TableCell component="th" scope="row">
                                        <img src={`${item?.product?.thumbnail}`} style={{ height: "50px", width: "50px", objectFit: "cover" }} alt="" />
                                    </TableCell>
                                    <TableCell align="left"><Link style={{color: whiteColor}} to={`/product/${item?.product?._id}`}>{item?.product?.title}</Link></TableCell>
                                    <TableCell align="center">
                                        {item?.attributes?.color}
                                        {/* {item?.attributes?.color ? <>
                                            <TextField
                                            id="filled-select-color"
                                            select
                                            label="Color"
                                            helperText="Please select a color"
                                            variant="filled"
                                            defaultValue={item?.attributes?.color}
                                            onChange={(e) => colorUpdate(item?.product?._id, e.target.value)}
                                            >
                                                {item?.product?.attributes?.color?.map((option, index) => (
                                                    <MenuItem key={index} value={option}>
                                                    {option}
                                                    </MenuItem>
                                                ))}
                                            </TextField>
                                        </> : <></>} */}
                                    </TableCell>
                                    <TableCell align="center">
                                        {item?.attributes?.size}
                                        {/* {item?.attributes?.size ? <>
                                            <TextField
                                            id="filled-select-size"
                                            select
                                            label="Size"
                                            helperText="Please select a size"
                                            variant="filled"
                                            defaultValue={item?.attributes?.size}
                                            onChange={(e) => sizeUpdate(item?.product?._id, e.target.value)}
                                            >
                                                {item?.product?.attributes?.size?.map((option, index) => (
                                                    <MenuItem key={index} value={option}>
                                                    {option}
                                                    </MenuItem>
                                                ))}
                                            </TextField>
                                        </> : <></>} */}
                                    </TableCell>
                                    {item?.product?.salePrice ? <>
                                        <TableCell align="center">${item?.product?.salePrice}</TableCell>
                                    </> : <>
                                        <TableCell align="center">${item?.product?.price}</TableCell>
                                    </>}
                                    
                                    <TableCell align="center">
                                        {item?.quantity > 0 ? <>
                                            <Stack spacing={0} direction="row" justifyContent="center" sx={{mb:5, ml:0}}>
                                            {item?.product?.salePrice ? <>
                                                <Button variant="contained" size="small" color="success" sx={{borderRadius: "0px"}} onClick={() => qtyDecrease(item?.product?._id, item?.quantity, item?.product?.salePrice)}>-</Button>
                                            </> : <>
                                            <Button variant="contained" size="small" color="success" sx={{borderRadius: "0px"}} onClick={() => qtyDecrease(item?.product?._id, item?.quantity, item?.product?.price)}>-</Button>
                                            </> }
                                                
                                                <OutlinedInput
                                                    id="outlined-adornment-weight"
                                                    aria-describedby="outlined-weight-helper-text"
                                                    inputProps={{
                                                    'aria-label': 'weight',
                                                    }}
                                                    disabled
                                                    sx={{p:0, width: "100px", borderRadius: "0px", "> #outlined-adornment-weight" : {textAlign: "center", WebkitTextFillColor: whiteColor}}}
                                                    value={item?.quantity}
                                                />
                                                {item?.product?.salePrice ? <>
                                                    <Button variant="contained" size="small" color="success" sx={{borderRadius: "0px"}} onClick={() => qtyIncrease(item?.product?._id, item?.quantity, item?.product?.salePrice)}>+</Button>
                                                </> : <>
                                                    <Button variant="contained" size="small" color="success" sx={{borderRadius: "0px"}} onClick={() => qtyIncrease(item?.product?._id, item?.quantity, item?.product?.price)}>+</Button>
                                                </> }
                                                
                                            </Stack>
                                        </> : <></>}

                                        <Snackbar
                                            anchorOrigin={{ vertical: "top", horizontal: "right" }}
                                            open={state.open}
                                            onClose={handleClose}
                                            autoHideDuration={3000}
                                            TransitionComponent={transition}
                                            // message="Cart Updated"
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
                                            <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
                                                {alert}
                                            </Alert>
                                        </Snackbar>
                                    </TableCell>
                                    <TableCell align="center">${item?.subTotal}</TableCell>
                                    <TableCell align="center">
                                        <Delete onClick={()=> handleDialogOpen()} sx={deleteHover} />
                                        {/* <Button variant="contained" color="error" onClick={()=> handleDialogOpen()}>Remove</Button> */}
                                        <Dialog
                                                open={open}
                                                onClose={handleDialogClose}
                                                aria-labelledby="alert-dialog-title"
                                                aria-describedby="alert-dialog-description"
                                                TransitionComponent={Transition}
                                                keepMounted
                                                disableEnforceFocus
                                            >
                                                <DialogTitle id="alert-dialog-title">
                                                    {"Remove from Cart"}
                                                    <IconButton
                                                        aria-label="close"
                                                        onClick={handleDialogClose}
                                                        sx={{
                                                            position: 'absolute',
                                                            right: 8,
                                                            top: 8,
                                                            color: (theme) => theme.palette.grey[500],
                                                        }}
                                                        >
                                                        <CloseIcon />
                                                    </IconButton>
                                                </DialogTitle>
                                                <DialogContent>
                                                    <DialogContentText id="alert-dialog-description">
                                                        Do you want to remove this Product from the cart?
                                                    </DialogContentText>
                                                </DialogContent>
                                                <DialogActions>
                                                    <Button onClick={() => {handleDialogClose()}}>No</Button>
                                                    <Button onClick={() => removeProduct(item?.product?._id)} autoFocus>
                                                        Yes
                                                    </Button>
                                                </DialogActions>
                                            </Dialog>                                            
                                    </TableCell>
                                </TableRow>
                            )})}
                            </TableBody>
                            <TableBody>
                                <TableRow>
                                    <TableCell></TableCell>
                                    <TableCell></TableCell>
                                    <TableCell></TableCell>
                                    <TableCell></TableCell>
                                    <TableCell align="center">Order Total</TableCell>
                                    <TableCell align="center">{cartData?.cartTotal?.totalQuantity}</TableCell>
                                    <TableCell align="center">${cartData?.cartTotal?.total}</TableCell>
                                    <TableCell align="center"></TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <Stack spacing={0} direction="row" justifyContent="flex-end" sx={{mt:5}}>
                    <TextField
                        id="outlined-required"
                        label="Got a Coupon?"
                        value={couponCode}
                        onChange={(e) => {setCouponCode(e.target.value)}}
                    />
                    <Button variant="contained" size="large" color="primary" sx={{ml:2}}
                    onClick={() => applyCouponCode()}
                    >
                        Apply Coupon</Button>
                    </Stack>
                </>
                }
            </Grid>
            <Grid item xs={12} md={12} style={{textAlign: "right", marginTop: "100px"}}>
                <Link to="/checkout" style={{textDecoration: "none", display: "inline-block"}}>
                    <Button variant="contained" size="large">Proceed to Checkout</Button>
                </Link>
            </Grid>
        </Grid>
    </Container>
  )
}

export default Cart