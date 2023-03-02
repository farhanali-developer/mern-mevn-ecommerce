import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Grid, Container, colors, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material'

const whiteColor = colors.common.white;

const AllOrders = () => {

  const [order, setOrder] = useState()
  const [productsData, setProductsData] = useState([]);

  const { id } = useParams()
  const orderId = id;

  const fetchOrders = async () => {
    try {
      const res = await axios.get(`/order/${orderId}`);
      setOrder(res.data);
    } catch (error) {
      console.log("error", error);
    }
  };
  
  useEffect(() => {
    fetchOrders();
  }, []);


  return (
    <Container maxWidth="xl" sx={{mt:10}}>
      <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 2 }} justifyContent="center">
        <Grid item sm={8} sx={{ py:10, mb:10 }} className="box-shadow">
          {order && (
            <TableContainer>
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
                  {order?.products?.map((product, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <img src={productsData[index]?.thumbnail} alt={productsData[index]?.title} style={{ height: "50px", width: "50px", objectFit: "cover" }} />
                      </TableCell>
                      <TableCell>{productsData[index]?.title}</TableCell>
                      <TableCell align="center">${product?.price}</TableCell>
                      <TableCell align="center">{product?.quantity}</TableCell>
                      <TableCell align="center">${product?.subTotal}</TableCell>
                    </TableRow>
                  ))}
                  <TableRow>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                    <TableCell align="center">Order Total</TableCell>
                    <TableCell align="center">{order?.cartTotal?.totalQuantity}</TableCell>
                    <TableCell align="center">${order?.cartTotal?.total}</TableCell>
                    <TableCell align="center"></TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Grid>
      </Grid>
    </Container>
  )
}

export default AllOrders