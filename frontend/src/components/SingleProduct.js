import * as React from 'react';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';

const SingleProduct = () => {
  return (
    <div>
        <Box sx={{ width: '100%' }} sx={{ m: 2 }}>
            <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 2 }} justifyContent="space-between">
                <Grid item xs={12} md={12} style={{ marginTop: "30px"}}>
                    <h1>Product Title</h1>
                </Grid>
                <Grid item xs={12} md={5} style={{ marginTop: "30px"}}>
                    <img style={{ height: "auto", width: "100%" }} src="https://lanustech.vercel.app/assets/img/desktops-1.jpg" alt="Product"/>
                </Grid>
                <Grid item xs={12} md={6} style={{ marginTop: "30px"}}>
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas mi eros, tempor et lacus vulputate, rhoncus suscipit lorem. Duis hendrerit nisi nisi, non maximus sapien lobortis sit amet. Aliquam eu sapien iaculis, tempus ipsum ac, lobortis lectus. Sed convallis, elit id pretium fringilla, sem mi posuere lectus, eu sagittis velit nulla at nisi. Maecenas lacinia volutpat mauris nec molestie. Donec posuere placerat congue. Fusce a ligula ipsum. Praesent id sollicitudin turpis. Maecenas vitae augue quis elit egestas scelerisque. Nunc sed pharetra mauris, et feugiat erat.</p>
                    <div style={{marginTop: "50px"}}>
                        <p><b>SKU:</b> ABC</p>
                        <p><b>Category: </b>Unknown</p>
                        <p><b>Brand: </b> Unknown</p>
                        <div style={{ fontWight: "bold", marginTop: "20px", marginBottom: "100px", textAlign: "left" }}>
                            <s style={{ fontSize: "1.1rem", color: "#6c757d" }}>$12.00</s>
                            <span style={{ fontSize: "1.1rem", color: "#dc3545", marginLeft: "10px" }}>$8.99</span>
                        </div>
                        <Stack spacing={2} direction="row">
                            <Button variant="outlined"><FavoriteBorderIcon />Add to wishlist</Button>
                            <Button variant="contained" color="success">Add to cart</Button>
                        </Stack>
                    </div>
                </Grid>
            </Grid>
        </Box>
    </div>
  )
}

export default SingleProduct