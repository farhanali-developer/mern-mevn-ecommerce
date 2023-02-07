import * as React from 'react';
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

function createData(
    productImage: string,
    title: string,
    price: string,
  ) {
    return { productImage, title, price };
  }
  
  const rows = [
    createData('https://lanustech.vercel.app/assets/img/desktops-1.jpg', "Product Title", "$8.99"),
    createData('https://lanustech.vercel.app/assets/img/desktops-1.jpg', "Product Title", "$8.99"),
    createData('https://lanustech.vercel.app/assets/img/desktops-1.jpg', "Product Title", "$8.99"),
    createData('https://lanustech.vercel.app/assets/img/desktops-1.jpg', "Product Title", "$8.99"),
    createData('https://lanustech.vercel.app/assets/img/desktops-1.jpg', "Product Title", "$8.99"),
  ];

const Cart = () => {
  return (
    <div>
        <Box sx={{ width: '100%' }} sx={{ m: 2 }}>
            <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 2 }} justifyContent="center">
                <Grid item xs={12} md={8} style={{ marginTop: "30px"}}>
                    <h2 style={{ textAlign: "center", marginBottom: "50px" }}>Shopping Cart</h2>
                    <TableContainer component={Paper}>
                        <Table sx={{ minWidth: 650 }} aria-label="simple table">
                            <TableHead>
                                <TableRow>
                                    <TableCell></TableCell>
                                    <TableCell></TableCell>
                                    <TableCell align="right">Price</TableCell>
                                    <TableCell align="right">QTY</TableCell>
                                    <TableCell align="right">Total</TableCell>
                                    <TableCell align="right"></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                            {rows.map((row) => (
                                <TableRow
                                key={row.name}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >
                                <TableCell component="th" scope="row">
                                    <img src={`${row.productImage}`} style={{ height: "50px", width: "50px", objectFit: "cover" }} alt="" />
                                </TableCell>
                                <TableCell align="right">{row.title}</TableCell>
                                <TableCell align="right">{row.price}</TableCell>
                                <TableCell align="right">
                                    <TextField
                                        id="standard-number"
                                        label="Quantity"
                                        type="number"
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                        variant="standard"
                                    />
                                </TableCell>
                                <TableCell align="right">$8.99</TableCell>
                                <TableCell align="right">
                                    <Button variant="contained" color="error">Remove</Button>
                                </TableCell>
                                </TableRow>
                            ))}
                            </TableBody>

                            <TableHead>
                                <TableRow>
                                    <TableCell></TableCell>
                                    <TableCell></TableCell>
                                    <TableCell align="right">Order Total</TableCell>
                                    <TableCell align="right">5</TableCell>
                                    <TableCell align="right">$314.50</TableCell>
                                    <TableCell align="right"></TableCell>
                                </TableRow>
                            </TableHead>
                        </Table>
                    </TableContainer>

                    <Button variant="contained" style={{marginTop: "100px", textAlign: "right", display: "block", marginLeft: "auto"}} size="large">Proceed to Checkout</Button>
                </Grid>
            </Grid>
        </Box>
    </div>
  )
}

export default Cart