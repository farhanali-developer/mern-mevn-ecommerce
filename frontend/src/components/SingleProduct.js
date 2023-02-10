import * as React from 'react';
import { useEffect, useState } from 'react';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { Link, useParams } from 'react-router-dom';
import Container from '@mui/material/Container';
import axios from 'axios'

export default function SingleProduct() {
    const { id } = useParams()
    

    const [Products, setProducts] = useState([])

    const fetchData = async () => {
      try {
            const url = `http://127.0.0.1:5000/api/product/${id}`;
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
                                <span style={{ fontSize: "1.1rem", fontWeight: "bold", color: "#dc3545", marginLeft: "10px" }}>$8.99</span>
                            </div>
                            <Stack spacing={2} direction="row">
                                <Link to="/wishlist" style={{textDecoration: "none"}}>
                                    <Button variant="outlined" size="large"><FavoriteBorderIcon />Add to wishlist</Button>
                                </Link>
                                <Link to="/cart" style={{textDecoration: "none"}}>
                                    <Button variant="contained" size="large" color="success">Add to cart</Button>
                                </Link>
                            </Stack>
                        </div>
                    </Grid>
                </Grid>
        </Box>
    </Container>
  );
}