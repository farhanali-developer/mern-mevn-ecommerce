import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Grid, Container, colors, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material'

const whiteColor = colors.common.white;

const OrderPage = () => {

  const [order, setOrder] = useState()
  const [productsData, setProductsData] = useState([]);

  const { id } = useParams()
  const orderId = id;

  const fetchOrderData = async () => {
    try {
      const res = await axios.get(`/order/${orderId}`);
      setOrder(res.data);
    } catch (error) {
      console.log("error", error);
    }
  };

  const fetchProductsData = async () => {
    const productIds = order.products.map((product) => product.product);
    const productPromises = productIds.map((productId) =>
      axios.get(`/product/${productId}`)
    );
    const productResponses = await Promise.all(productPromises);
    const products = productResponses.map((res) => res.data);
    setProductsData(products);
  };
  
  useEffect(() => {
    fetchOrderData();
  }, [orderId]);

  
  useEffect(() => {
    if (order) {
      fetchProductsData();
    }
  }, [order]);


  return (
    <Container maxWidth="xl" sx={{mt:10}}>
      <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 2 }} justifyContent="center">
        <Grid item sm={8} sx={{ py:10, mb:10 }} className="box-shadow">
          <h2 style={{color: whiteColor, textAlign: "center", marginTop: "80px"}}>Thank you for ordering with us.</h2>
          <h3 style={{color: whiteColor, textAlign: "center", marginTop: "20px"}}>Your order number is : {order?._id}</h3>
          <p style={{color: whiteColor, marginTop: "80px"}}>First Name : <strong>{order?.customerInfo?.first_name}</strong></p>
          <p style={{color: whiteColor}}>Last Name : <strong>{order?.customerInfo?.last_name}</strong></p>
          <p style={{color: whiteColor}}>Email Address : <strong>{order?.customerInfo?.email}</strong></p>
          <p style={{color: whiteColor}}>Phone Number : <strong>{order?.customerInfo?.phone}</strong></p>
          <p style={{color: whiteColor}}>Address : <strong>{order?.customerInfo?.address}</strong></p>
          <p style={{color: whiteColor}}>Delivery Method : <strong>{order?.deliveryMethod}</strong></p>
          <p style={{color: whiteColor}}>Payment Method : <strong>{order?.paymentMethod}</strong></p>
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

export default OrderPage