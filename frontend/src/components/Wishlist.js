import React, { useEffect, useState, useContext } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { WishlistContext } from '../context/wishlistContext'
import { Container, Grid, Box, colors, IconButton, Snackbar, Slide, Card, CardContent, CardMedia, Typography, CardActionArea, CardActions, ThemeProvider, createTheme, Alert } from '@mui/material'
import { Favorite, Close as CloseIcon } from '@mui/icons-material'

const whiteColor = colors.common.white;

function TransitionDown(props) {
    return <Slide {...props} direction="down" />;
}

const darkTheme = createTheme({
    palette: {
      mode: 'dark',
      primary: {
        main: '#1976d2',
      },
    },
  });

const Wishlist = () => {

    const { removeFromWishlist, wishlistData } = useContext(WishlistContext)
    const [ wishlist, setWishlist ] = useState([])
    const [state, setState] = useState({
        open: false,
        Transition: 'SlideTransition'
      });
    const [transition, setTransition] = useState(undefined);
    const [severity, setSeverity] = useState();
    const [alert, setAlert] = useState("");

    const fetchData = async (wishlistProducts) => {
        const promises = wishlistProducts.map(async (item) => {
          const productId = item?.productId
          const res = await axios.get(`/product/${productId}`)
          return res.data
        })
        const wishlistItems = await Promise.all(promises)
        setWishlist(wishlistItems)
      }

    useEffect(() => {
        const wishlistProducts = wishlistData?.products
        if (!wishlistProducts) return

        fetchData(wishlistProducts)
      }, [wishlistData])



    const handleWishlist = (productId) => {
        removeFromWishlist(productId)
        setAlert("Product removed from wishlist.");
        setSeverity("success");
        setState({ open: true });
        setTransition(() => TransitionDown);
    }

    const handleClose = () => {
        setState({ ...state, open: false });
    };

  return (
    <ThemeProvider theme={darkTheme}>
        <Container maxWidth="xl">
            <Box sx={{ width: '100%', m: 2 }}>
                <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 2 }} justifyContent="start">
                    {wishlist && wishlist?.map((product) => {
                        return(
                            <Grid item xs={12} md={3} style={{ marginTop: "30px"}} key={product?._id}>
                                <Card sx={{ maxWidth: 345, height: "100%" }} className="box-shadow">
                                    <Link to={`/product/${product?._id}`} style={{textDecoration: "none"}}>
                                        <CardActionArea>
                                            <CardMedia
                                                component="img"
                                                height="240"
                                                image={`${product?.thumbnail}`}
                                                alt="Product Image"
                                            />
                                            <CardContent>
                                            <Typography gutterBottom variant="h5" component="div" color={whiteColor}>
                                                {product?.title}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                {product?.description}
                                            </Typography>
                                            </CardContent>
                                        </CardActionArea>
                                    </Link>
                                    <CardActions>
                                        <IconButton aria-label="add to favorites" onClick={e => handleWishlist(product?._id)}>
                                            <Favorite />
                                        </IconButton>
                                    </CardActions>
                                </Card>
                                <Snackbar
                                    anchorOrigin={{ vertical: "top", horizontal: "right" }}
                                    open={state.open}
                                    onClose={handleClose}
                                    autoHideDuration={3000}
                                    TransitionComponent={transition}
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
                                    <Alert onClose={handleClose} severity={severity} sx={{ width: '100%' }}>
                                        {alert}
                                    </Alert>
                                </Snackbar>
                            </Grid>
                        )
                    })}
                    
                </Grid>
            </Box>
        </Container>
    </ThemeProvider>
  )
}

export default Wishlist