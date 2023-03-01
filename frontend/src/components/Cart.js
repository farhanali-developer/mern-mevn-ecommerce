import * as React from 'react';
import { useContext, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CartContext } from '../context/cartContext';
import { userContext } from '../context/userContext';
import { Grid, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, TextField, colors, Container, Snackbar, IconButton, Slide, Alert as MuiAlert, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, ThemeProvider, createTheme, Stack } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close';

const whiteColor = colors.common.white;

const darkTheme = createTheme({
    palette: {
      mode: 'dark',
      primary: {
        main: '#1976d2',
      },
    },
  });

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function TransitionDown(props) {
    return <Slide {...props} direction="down" />;
}

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="down" ref={ref} {...props} />;
  });


const Cart = () => {
    
    const { cartData, updateCart, removeFromCart } = useContext(CartContext);
    const { user } = useContext(userContext);
    const [qty, setQty] = useState(0);
    const [newCartData, setNewCartData] = useState([]);
    const [open, setOpen] = useState(false);
    const [state, setState] = useState({
        open: false,
        Transition: 'SlideTransition'
    });

    const [transition, setTransition] = useState(undefined);
    const [alert, setAlert] = useState("")

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
            "subTotal": subTotal,
            "cartTotal": {
                "totalQuantity": qty,
                "total": subTotal
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

    useEffect(() => {
        // setQty()
        setNewCartData(cartData?.products)
    }, [cartData])

    // useEffect(() => {
    //     console.log(newCartData)
    // }, [])


  return (
    <Container>
        <Box sx={{ width: '100%'}}>
            <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 2 }} justifyContent="center">
                <Grid item xs={12} style={{ marginTop: "30px"}}>
                    <h2 style={{ textAlign: "center", marginBottom: "50px", color: whiteColor }}>Shopping Cart</h2>
                    {!cartData?.products ? <><h5 style={{color: whiteColor, textAlign: "center"}}>Your Cart is Empty!</h5></> : 
                    <>
                        <TableContainer sx={{py:5, px:2}} className="box-shadow">
                            <Table sx={{ width: "100%", "th, td, input, label": {color: whiteColor} }} aria-label="simple table">
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
                                {newCartData && newCartData?.map((item) => (
                                    <TableRow
                                    key={item?.product?._id}
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                    >
                                        <TableCell component="th" scope="row">
                                            <img src={`${item?.product?.thumbnail}`} style={{ height: "50px", width: "50px", objectFit: "cover" }} alt="" />
                                        </TableCell>
                                        <TableCell align="center"><Link style={{color: whiteColor}} to={`/product/${item?.product?._id}`}>{item?.product?.title}</Link></TableCell>
                                        <TableCell align="center">${item?.product?.price}</TableCell>
                                        <TableCell align="center">
                                            {/* <TextField
                                                id="standard-number"
                                                label="Quantity"
                                                InputLabelProps={{
                                                    shrink: true,
                                                }}
                                                variant="standard"
                                                defaultValue={item?.quantity}
                                                onChange={(e) => qtyChange(item?.product?._id, e.target.value, item?.product?.price)}
                                            /> */}
                                            <Stack spacing={2} direction="row" sx={{mb:5, ml:0}}>
                                                <Button variant="contained" size="small" color="success" onClick={() => qtyDecrease(item?.product?._id, item?.quantity, item?.product?.price)}>-</Button>
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
                                                    value={item?.quantity}
                                                />
                                                <Button variant="contained" size="small" color="success" onClick={() => qtyIncrease(item?.product?._id, item?.quantity, item?.product?.price)}>+</Button>
                                            </Stack>
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
                                            <Button variant="contained" color="error" onClick={()=> handleDialogOpen()}>Remove</Button>
                                            <ThemeProvider theme={darkTheme}>
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
                                            </ThemeProvider>
                                            
                                        </TableCell>
                                    </TableRow>
                                ))}
                                </TableBody>
                                <TableHead>
                                    <TableRow>
                                        <TableCell></TableCell>
                                        <TableCell></TableCell>
                                        <TableCell align="center">Order Total</TableCell>
                                        <TableCell align="center">{cartData?.cartTotal?.totalQuantity}</TableCell>
                                        <TableCell align="center">${cartData?.cartTotal?.total}</TableCell>
                                        <TableCell align="center"></TableCell>
                                    </TableRow>
                                </TableHead>
                            </Table>
                        </TableContainer>
                    </>
                    }
                </Grid>
                <Grid item xs={12} md={12} style={{textAlign: "right", marginTop: "100px"}}>
                    <Link to="/checkout" style={{textDecoration: "none", display: "inline-block"}}>
                        <Button variant="contained" size="large">Proceed to Checkout</Button>
                    </Link>
                </Grid>
            </Grid>
        </Box>
    </Container>
  )
}

export default Cart