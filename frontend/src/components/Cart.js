import * as React from 'react';
import { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
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
import Snackbar from '@mui/material/Snackbar';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Slide from '@mui/material/Slide';
import MuiAlert from '@mui/material/Alert';
import { CartContext } from '../context/cartContext';
import { userContext } from '../context/userContext';

const whiteColor = common.white;

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function TransitionDown(props) {
    return <Slide {...props} direction="down" />;
}

const Cart = () => {
    
    const { cartData, updateCart, removeFromCart } = useContext(CartContext);
    const { user } = useContext(userContext);

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
            openSnackBar()
        }
    }


    const [state, setState] = useState({
        open: false,
        Transition: 'SlideTransition'
      });
      const [transition, setTransition] = useState(undefined);
    //   const { vertical, horizontal, open } = state;
    
      const openSnackBar = () => {
        setState({ open: true });
        setTransition(() => TransitionDown);
      };
    
      const handleClose = () => {
        setState({ ...state, open: false });
      };


  return (
    <Container>
        <Box sx={{ width: '100%', m: 2 }}>
            <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 2 }} justifyContent="center">
                <Grid item xs={12} style={{ marginTop: "30px"}}>
                    <h2 style={{ textAlign: "center", marginBottom: "50px", color: "#fff" }}>Shopping Cart</h2>
                    {!cartData?.products ? <><h5 style={{color: "#fff", textAlign: "center"}}>Your Cart is Empty!</h5></> : 
                    <>
                    <TableContainer className="box-shadow">
                    <Table sx={{ minWidth: 650, width: "100%", "th, td, input, label": {color: whiteColor} }} aria-label="simple table">
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
                            <TableCell align="center">${item?.product?.price}</TableCell>
                            <TableCell align="center">
                                <TextField
                                    id="standard-number"
                                    label="Quantity"
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    variant="standard"
                                    defaultValue={item?.quantity}
                                    onChange={(e) => qtyChange(item?.product?._id, e.target.value, item?.product?.price)}
                                />
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
                                        Quantity Updated!
                                    </Alert>
                                </Snackbar>
                            </TableCell>
                            <TableCell align="center">${item?.subTotal}</TableCell>
                            <TableCell align="center">
                                <Button variant="contained" color="error" onClick={()=> removeFromCart(item?.product?._id)}>Remove</Button>
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