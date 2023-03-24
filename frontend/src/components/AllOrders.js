import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Grid, Container, Box, colors, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Paper, Collapse, IconButton, Chip } from '@mui/material'
import { KeyboardArrowDown as KeyboardArrowDownIcon, KeyboardArrowUp as KeyboardArrowUpIcon } from '@mui/icons-material'

const whiteColor = colors.common.white;

const AllOrders = () => {
  const [open, setOpen] = useState(false);
  const [openStates, setOpenStates] = useState([]);
  const [ordersData, setOrdersData] = useState([])

  const fetchOrders = async () => {
    try {
      const res = await axios.get('/order');
      setOrdersData(res.data);
      setOpenStates(new Array(res.data.length).fill(false));
    } catch (error) {
      console.log("error", error);
    }
  };
  
  useEffect(() => {
    fetchOrders();
  }, []);


  const handleOpen = (index) => {
    // Create a copy of the openStates array and toggle the value at the specified index
    const updatedOpenStates = [...openStates];
    updatedOpenStates[index] = !updatedOpenStates[index];
    setOpenStates(updatedOpenStates);
  };


  return (
    <Container maxWidth="xl" sx={{mt:10}}>
        <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 2 }} justifyContent="center">
          {ordersData && ordersData.map((order, index) => {
            const date = new Date(order?.createdAt);
            const formattedDate = new Intl.DateTimeFormat('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
            }).format(date);

            let paymentMethod = ""
            let deliveryMethod = ""
            let orderStatus = ""
            let orderColor = ""

            if(order?.paymentMethod == "cod"){
              paymentMethod = "Cash on Delivery"
            }
            else if(order?.paymentMethod == "card"){
              paymentMethod = "Credit Card"
            }

            if(order?.deliveryMethod == "self"){
              deliveryMethod = "Self"
            }
            else if(order?.deliveryMethod == "us"){
              deliveryMethod = "US"
            }
            else if(order?.deliveryMethod == "worldwide"){
              deliveryMethod = "World Wide"
            }

            if(order?.orderStatus == "processing"){
              orderStatus = "Processing"
              orderColor = "secondary"
            }
            else if(order?.orderStatus == "dispatched"){
              orderStatus = "Dispatched"
              orderColor = "warning"
            }
            else if(order?.orderStatus == "finished"){
              orderStatus = "Finished"
              orderColor = "success"
            }
            else if(order?.orderStatus == "declined"){
              orderStatus = "Declined"
              orderColor = "error"
            }

            return (
              <Grid item sm={12} sx={{ mb:5 }} key={order?._id}>
                <TableContainer component={Paper}>
                  <Table aria-label="collapsible table">
                    <TableHead>
                      <TableRow>
                        <TableCell />
                        <TableCell>Order No</TableCell>
                        <TableCell align="right">Date</TableCell>
                        <TableCell align="right">Delivery Method</TableCell>
                        <TableCell align="right">Payment Method</TableCell>
                        <TableCell align="right">Total Quantity</TableCell>
                        <TableCell align="right">Total Amount</TableCell>
                        <TableCell align="right">Status</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
                        <TableCell>
                          <IconButton
                            aria-label="expand row"
                            size="small"
                            // onClick={() => setOpen(!open)}
                            onClick={() => handleOpen(index)}
                          >
                            {openStates[index] ? (
                              <KeyboardArrowUpIcon />
                            ) : (
                              <KeyboardArrowDownIcon />
                            )}
                          </IconButton>
                        </TableCell>
                        <TableCell component="th" scope="row">{order?._id}</TableCell>
                        <TableCell align="right">{formattedDate}</TableCell>
                        <TableCell align="right">{deliveryMethod}</TableCell>
                        <TableCell align="right">{paymentMethod}</TableCell>
                        <TableCell align="right">{order?.cartTotal?.totalQuantity}</TableCell>
                        <TableCell align="right">${order?.cartTotal?.total}</TableCell>
                        <TableCell align="right"><Chip label={orderStatus} color="success" sx={{color: whiteColor}} /></TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                          <Collapse in={openStates[index]} timeout="auto" unmountOnExit>
                            <Box sx={{ margin: 1 }}>
                              <Typography variant="h6" gutterBottom component="div">
                                Product/s Info
                              </Typography>
                              <Table size="small" aria-label="purchases">
                                <TableHead>
                                  <TableRow>
                                    <TableCell></TableCell>
                                    <TableCell>Title</TableCell>
                                    <TableCell align="right">Quantity</TableCell>
                                    <TableCell align="right">Sub Total</TableCell>
                                  </TableRow>
                                </TableHead>
                                <TableBody>
                                {order?.products?.map((products) => {
                                  return (
                                    <TableRow key={products?._id}>
                                        <TableCell component="th" scope="row">
                                          <img src={`${products?.product?.thumbnail}`} style={{ height: "50px", width: "50px", objectFit: "cover" }} alt="" />
                                        </TableCell>
                                        <TableCell>{products?.product?.title}</TableCell>
                                        <TableCell align="right">{products?.quantity}</TableCell>
                                        <TableCell align="right">${products?.subTotal}</TableCell>
                                    </TableRow> 
                                  )
                                })}
                             </TableBody>
                              </Table>
                            </Box>
                          </Collapse>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>
            )
          })}
        </Grid>
      </Container>
  )
}

export default AllOrders