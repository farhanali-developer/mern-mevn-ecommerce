import React, { useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { useContext, useState } from 'react';
import { CartContext } from '../context/cartContext';
import { userContext } from '../context/userContext';
import { WishlistContext } from '../context/wishlistContext';
import { styled, alpha, AppBar, Box, Toolbar, IconButton, Typography, InputBase, Badge, Menu, MenuItem, Alert as MuiAlert, Slide, Snackbar, Autocomplete, CircularProgress, TextField, Paper, MenuList } from '@mui/material';
import { Menu as MenuIcon,  Search as SearchIcon, AccountCircle, Notifications as NotificationsIcon, More, ShoppingCart, Mail, Favorite, CloseOutlined as CloseIcon } from '@mui/icons-material';
// import { Favorite, CloseOutlined as CloseIcon } from '@mui/icons-material';
import Pusher from 'pusher-js';


  function sleep(delay = 0) {
    return new Promise((resolve) => {
      setTimeout(resolve, delay);
    });
  }

  // Top films as rated by IMDb users. http://www.imdb.com/chart/top
const topFilms = [
  { title: 'The Shawshank Redemption', year: 1994 },
  { title: 'The Godfather', year: 1972 },
  { title: 'The Godfather: Part II', year: 1974 },
  { title: 'The Dark Knight', year: 2008 },
  { title: '12 Angry Men', year: 1957 },
  { title: "Schindler's List", year: 1993 },
  { title: 'Pulp Fiction', year: 1994 },
  {
    title: 'The Lord of the Rings: The Return of the King',
    year: 2003,
  },
  { title: 'The Good, the Bad and the Ugly', year: 1966 },
  { title: 'Fight Club', year: 1999 },
  {
    title: 'The Lord of the Rings: The Fellowship of the Ring',
    year: 2001,
  },
  {
    title: 'Star Wars: Episode V - The Empire Strikes Back',
    year: 1980,
  },
  { title: 'Forrest Gump', year: 1994 },
  { title: 'Inception', year: 2010 },
  {
    title: 'The Lord of the Rings: The Two Towers',
    year: 2002,
  },
  { title: "One Flew Over the Cuckoo's Nest", year: 1975 },
  { title: 'Goodfellas', year: 1990 },
  { title: 'The Matrix', year: 1999 },
  { title: 'Seven Samurai', year: 1954 },
  {
    title: 'Star Wars: Episode IV - A New Hope',
    year: 1977,
  },
  { title: 'City of God', year: 2002 },
  { title: 'Se7en', year: 1995 },
  { title: 'The Silence of the Lambs', year: 1991 },
  { title: "It's a Wonderful Life", year: 1946 },
  { title: 'Life Is Beautiful', year: 1997 },
  { title: 'The Usual Suspects', year: 1995 },
  { title: 'Léon: The Professional', year: 1994 },
  { title: 'Spirited Away', year: 2001 },
  { title: 'Saving Private Ryan', year: 1998 },
  { title: 'Once Upon a Time in the West', year: 1968 },
  { title: 'American History X', year: 1998 },
  { title: 'Interstellar', year: 2014 },
];

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(3),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '20ch',
    },
  },
}));

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function TransitionDown(props) {
  return <Slide {...props} direction="down" />;
}

export default function Navbar() {


  // Enable pusher logging - don't include this in production
  // Pusher.logToConsole = true;

  var pusher = new Pusher('3863e7b2b7108bbe9f82', {
    cluster: 'ap2'
  });

  var channel = pusher.subscribe('my-channel');
  channel.bind('my-event', function(data) {
    console.log(data);
    setPusherNotifications(prevState => ({
      ...prevState,
      ...data
    }));

    setNotificationsCount(notificationsCount+1)
  });


  const [anchorEl, setAnchorEl] = useState('');
  const [anchorEl2, setAnchorEl2] = useState('');
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = useState('');
  const isMenuOpen = Boolean(anchorEl);
  const isNotificationsMenuOpen = Boolean(anchorEl2);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  const { wishlistData } = useContext(WishlistContext);
  const { cartData } = useContext(CartContext);
  let itemCount = 0;
  let wishlistCount = 0;

  if(cartData?.products){
    itemCount = cartData?.products.length
  }

  wishlistCount = wishlistData?.products?.length

  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState([]);
  const [notifications, setNotifications] = useState([])
  const [newNotifications, setNewNotifications] = useState([])
  const [pusherNotifications, setPusherNotifications] = useState({})
  const [notificationsCount, setNotificationsCount] = useState(0)
  // const [ products, setProducts ] = useState([])
  const loading = open && options.length === 0;

  useEffect(() => {
    let active = true;

    if (!loading) {
      return undefined;
    }

    (async () => {
      await sleep(1e3); // For demo purposes.

      if (active) {
        setOptions([...topFilms]);
      }
    })();

    return () => {
      active = false;
    };
  }, [loading]);

  useEffect(() => {
    if (!open) {
      setOptions([]);
    }
  }, [open]);


  const getNotifications = async () => {
    const res = await axios.get('/notifications');
    setNotifications(res.data);
    let count = 0;
    res.data.forEach(item => {
      const newNotifications = item.notifications.filter(notification => notification.readStatus === false);
      count += newNotifications.length;
      setNewNotifications(newNotifications);
    });
    setNotificationsCount(count);
  }

  useEffect(() => {
    getNotifications()
  }, [])

  

  const notificationsCounter = async () => {
    
  }

  useEffect(() => {
    notificationsCounter()
  }, [notifications])


  

  // const fetchProducts = async () => {
  //   const res = await axios.get('/')
  //   setProducts(res.data.results)
  // }

  // useEffect(() => {
  //   fetchProducts()
  // }, [])



  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleNotificationsMenuOpen = (event) => {
    setAnchorEl2(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };

  const handleNotificationsMenuClose = () => {
    setAnchorEl2(null);
    handleMobileMenuClose();
  };

  const handleMobileMenuOpen = (event) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setState({ ...state, open: false });
  };

  const [state, setState] = useState({
    open: false,
    Transition: 'SlideTransition'
  });
  const [transition, setTransition] = useState(undefined);
  const [alert, setAlert] = useState("");
  const [severity, setSeverity] = useState();
  const {isLoggedIn, logout, isGuest} = useContext(userContext)

  const navigate = useNavigate();

  const logoutFunc = async (e) => {
    handleMenuClose()
    const res = await logout()
    if(res == 204){
        setAlert("Logout Successful!");
        setSeverity("success");
        setState({ open: true });
        setTransition(() => TransitionDown);
        setTimeout(()=> {
          navigate("/");
          }, 2000);
    }
  }

  const menuItems = () => {
    return isLoggedIn() && !isGuest() ? [
      <Link to="/profile" style={{ textDecoration: "none", color: "#000"}}>
        <MenuItem>Profile</MenuItem>
      </Link>,
      <Link to="/orders" style={{ textDecoration: "none", color: "#000"}}>
        <MenuItem>My Orders</MenuItem>
      </Link>,
      <MenuItem onClick={logoutFunc}>Logout</MenuItem>
    ]: [
      <Link to="/login" style={{ textDecoration: "none", color: "#000"}}>
        <MenuItem onClick={handleMenuClose}>Login</MenuItem>
      </Link>,
      <Link to="/signup" style={{ textDecoration: "none", color: "#000"}}>
        <MenuItem onClick={handleMenuClose}>Register</MenuItem>
      </Link>
    ]
  }


  const menuId = 'primary-search-account-menu';
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      id={menuId}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      {menuItems()}
      
      
    </Menu>
  );

  function capitalize(s){
    return s && s[0].toUpperCase() + s.slice(1);
  }

  const notificationsMenuId = 'notifications-menu';
  const renderNotificationsMenu = (
    <Menu
      anchorEl={anchorEl2}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      id={notificationsMenuId}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={isNotificationsMenuOpen}
      onClose={handleNotificationsMenuClose}
    >
      <MenuList>
        
      {pusherNotifications.orderId && (
        <MenuItem>
          <Typography variant="inherit" noWrap>
            Your Order #{pusherNotifications.orderId} status updated. Changed from {capitalize(pusherNotifications.oldStatus)} to {capitalize(pusherNotifications.newStatus)}.
          </Typography>
        </MenuItem>
      )}
            

        {newNotifications.map((item) => {
          return (
            <MenuItem>
            <Typography variant="inherit" noWrap>
              Your Order # {item?.orderId} status updated. Changed from {capitalize(item?.oldStatus)} to {capitalize(item.newStatus)}.
            </Typography>
            </MenuItem>
          )
        })}
          
       
      </MenuList> 
    </Menu>
  );

  const mobileMenuId = 'primary-search-account-menu-mobile';
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      <MenuItem>
        <IconButton size="large" aria-label="show 4 new mails" color="inherit">
          <Badge badgeContent={4} color="error">
            <Mail />
          </Badge>
        </IconButton>
        <p>Messages</p>
      </MenuItem>
      <MenuItem>
        <IconButton
          size="large"
          aria-label="show 17 new notifications"
          color="inherit"
        >
          <Badge badgeContent={17} color="error">
            <NotificationsIcon />
          </Badge>
        </IconButton>
        <p>Notifications</p>
      </MenuItem>
      <MenuItem onClick={handleProfileMenuOpen}>
        <IconButton
          size="large"
          aria-label="account of current user"
          aria-controls="primary-search-account-menu"
          aria-haspopup="true"
          color="inherit"
        >
          <AccountCircle />
        </IconButton>
        <p>Profile</p>
      </MenuItem>
    </Menu>
  );

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
            <Toolbar>
              <IconButton
                  size="large"
                  edge="start"
                  color="inherit"
                  aria-label="open drawer"
                  sx={{ mr: 2 }}
              >
                  <MenuIcon />
              </IconButton>
              <Typography
                  variant="h6"
                  noWrap
                  component="div"
                  sx={{ display: { xs: 'none', sm: 'block' } }}
              >
                  MUI
              </Typography>
              <Search>
                  <SearchIconWrapper>
                  <SearchIcon />
                  </SearchIconWrapper>
                  <StyledInputBase
                  placeholder="Search…"
                  inputProps={{ 'aria-label': 'search' }}
                  />
              </Search>
              {/* <Autocomplete
                id="asynchronous-demo"
                sx={{ width: 300, my:2, ml:2 }}
                open={true}
                onOpen={() => {
                  setOpen(true);
                }}
                onClose={() => {
                  setOpen(false);
                }}
                isOptionEqualToValue={(option, value) => option.title === value.title}
                getOptionLabel={(option) => option.title}
                options={products}
                loading={loading}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Search"
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: (
                        <React.Fragment>
                          {loading ? <CircularProgress color="inherit" size={20} /> : null}
                          {params.InputProps.endAdornment}
                        </React.Fragment>
                      ),
                    }}
                  />
                )}
              /> */}
              <Box sx={{ flexGrow: 1 }} />
              <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
                  <Link to="/cart" style={{ textDecoration: "none", color: "unset" }}>
                    <IconButton size="large" aria-label="show 4 new mails" color="inherit">
                      <Badge badgeContent={itemCount} color="error">
                          <ShoppingCart />
                      </Badge>
                    </IconButton>
                  
                  </Link>
                  {isLoggedIn() && !isGuest() ? <>
                    <Link to="/wishlist" style={{ textDecoration: "none", color: "unset" }}>
                    <IconButton size="large" aria-label="show 4 new mails" color="inherit">
                      <Badge badgeContent={wishlistCount} color="error">
                          <Favorite />
                      </Badge>
                    </IconButton>
                  
                  </Link>
                  <IconButton
                    size="large"
                    aria-label="show 17 new notifications"
                    color="inherit"
                    aria-haspopup="true"
                    aria-controls={notificationsMenuId}
                    onClick={handleNotificationsMenuOpen}
                    >
                  <Badge badgeContent={notificationsCount} color="error">
                      <NotificationsIcon />
                  </Badge>
                  </IconButton>
                  
                  </> : <></>}
                  <IconButton
                  size="large"
                  edge="end"
                  aria-label="account of current user"
                  aria-controls={menuId}
                  aria-haspopup="true"
                  onClick={handleProfileMenuOpen}
                  color="inherit"
                  >
                  <AccountCircle />
                  </IconButton>
              </Box>
              <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
                  <IconButton
                  size="large"
                  aria-label="show more"
                  aria-controls={mobileMenuId}
                  aria-haspopup="true"
                  onClick={handleMobileMenuOpen}
                  color="inherit"
                  >
                  <More />
                  </IconButton>
              </Box>
            </Toolbar>
        </AppBar>
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
      {renderMobileMenu}
      {renderMenu}
      {renderNotificationsMenu}
    </Box>
  );
}
