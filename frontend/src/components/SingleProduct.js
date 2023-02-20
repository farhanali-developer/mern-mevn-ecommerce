import * as React from 'react';
import { useEffect, useState, useContext } from 'react';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { Link, useParams } from 'react-router-dom';
import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';
import axios from 'axios'
import { CartContext } from '../context/cartContext';
import { userContext } from '../context/userContext';

export default function SingleProduct() {
    const { id } = useParams()
    const productId = id;
    const [Products, setProducts] = useState([])
    const [qty, setQty] = useState()

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
    }, []);

    

    

    const addCart = (id, qty, price) => {

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

        addToCart(data);
    }

    function qtyChange(e){
        setQty(e)
    }

  return (
    <Container maxWidth="xl">
        <Box sx={{ width: '100%', m: 2 }}>
            <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 2 }} justifyContent="space-between">
                <Grid item xs={12} md={12} style={{ marginTop: "30px"}}>
                    <h1 style={{color: "#fff"}}>{Products?.title}</h1>
                </Grid>
                <Grid item xs={12} md={5} style={{ marginTop: "30px"}}>
                    <img style={{ height: "auto", width: "100%" }} src={`${Products?.thumbnail}`} alt="Product"/>
                </Grid>
                <Grid item xs={12} md={6} style={{ marginTop: "30px", color: "#fff"}}>
                    <p>{Products?.description}</p>
                    <div style={{marginTop: "50px"}}>
                        <p><b>SKU:</b> ABC</p>
                        <p><b>Category: </b>{Products?.category}</p>
                        <p><b>Brand: </b> {Products?.brand}</p>
                        <div style={{ fontWight: "bold", marginTop: "20px", marginBottom: "100px", textAlign: "left" }}>
                            <s style={{ fontSize: "1.1rem", color: "#fff" }}>$12.00</s>
                            <span style={{ fontSize: "1.1rem", fontWeight: "bold", color: "#dc3545", marginLeft: "10px" }}>${Products?.price}</span>
                        </div>
                        <TextField id="outlined-basic" label="Quantity" variant="outlined" sx={{mb:5}} defaultValue="1" onChange={(e) => qtyChange(e.target.value)} />
                        <Stack spacing={2} direction="row">
                            <Link to="/wishlist" style={{textDecoration: "none"}}>
                                <Button variant="outlined" size="large"><FavoriteBorderIcon />Add to wishlist</Button>
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