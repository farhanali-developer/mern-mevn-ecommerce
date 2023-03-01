import * as React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useContext, useState } from 'react';
import { CartContext } from '../context/cartContext';
import { userContext } from '../context/userContext';
import { WishlistContext } from '../context/wishlistContext';
import { styled, alpha, AppBar, Box, Toolbar, IconButton, Typography, InputBase, Badge, Menu, MenuItem,  ThemeProvider, createTheme, Alert as MuiAlert, Slide, Snackbar } from '@mui/material';
import { Menu as MenuIcon,  Search as SearchIcon, AccountCircle, Notifications as NotificationsIcon, More, ShoppingCart, Mail, Favorite, CloseOutlined as CloseIcon } from '@mui/icons-material';
// import { Favorite, CloseOutlined as CloseIcon } from '@mui/icons-material';

const darkTheme = createTheme({
    palette: {
      mode: 'dark',
      primary: {
        main: '#1976d2',
      },
    },
  });

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
  const [anchorEl, setAnchorEl] = React.useState('');
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState('');
  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  const { wishlistData } = useContext(WishlistContext);
  const { cartData } = useContext(CartContext);
  let itemCount = 0;
  let wishlistCount = 0;

  if(cartData?.products){
    itemCount = cartData?.products.length
  }

  if(wishlistData?.products){
    wishlistCount = wishlistData?.products.length
  }



  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
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
    <Box sx={{ flexGrow: 1 }} theme={darkTheme}>
      <ThemeProvider theme={darkTheme}>
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
              <Box sx={{ flexGrow: 1 }} />
              <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
                  <Link to="/cart" style={{ textDecoration: "none", color: "unset" }}>
                    <IconButton size="large" aria-label="show 4 new mails" color="inherit">
                      <Badge badgeContent={itemCount} color="error">
                          <ShoppingCart />
                      </Badge>
                    </IconButton>
                  
                  </Link>
                  <Link to="/cart" style={{ textDecoration: "none", color: "unset" }}>
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
                    >
                  <Badge badgeContent={17} color="error">
                      <NotificationsIcon />
                  </Badge>
                  </IconButton>
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
      </ThemeProvider>
      {renderMobileMenu}
      {renderMenu}
    </Box>
  );
}
