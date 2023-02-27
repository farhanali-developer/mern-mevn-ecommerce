import * as React from 'react';
import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { userContext } from '../context/userContext';
import {Container, Grid, Box, TextField, Button, colors, Snackbar, Alert as MuiAlert, IconButton, Slide, InputAdornment, OutlinedInput, FormControl, InputLabel } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { Visibility, VisibilityOff } from '@mui/icons-material';

const whiteColor = colors.common.white;

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function TransitionDown(props) {
  return <Slide {...props} direction="down" />;
}

export default function Login() {

    const [loginInfo , setLoginInfo] = useState({
        email : "",
        password : "",
        role: "user"
    })
    const [state, setState] = useState({
      open: false,
      Transition: 'SlideTransition'
    });
    const [transition, setTransition] = useState(undefined);
    const [alert, setAlert] = useState("");
    const [severity, setSeverity] = useState();
    const [showPassword, setShowPassword] = useState(false);

    const {setUser} = useContext(userContext)

    const navigate = useNavigate();

    const handleChange = (e) => {
        const nextFormState = {
            ...loginInfo,
            [e.target.name]: e.target.value,
          };
          setLoginInfo(nextFormState);
    }

    const handleClose = () => {
      setState({ ...state, open: false });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
       const res =  await axios.post("/login", loginInfo, { withCredentials: true,
        headers: 
          { 
            "Content-Type": "application/json",
          },
          validateStatus: () => true
        })

        if(res.status == 200){
          setUser(res.data)
          setAlert("Login Successful!");
          setSeverity("success");
          setState({ open: true });
          setTransition(() => TransitionDown);
          setTimeout(()=> {
            navigate("/");
           }, 2000);
        }
        else{
          setAlert("Incorrect Email or password.");
          setSeverity("error");
          setState({ open: true });
          setTransition(() => TransitionDown);
        }
        
    }

    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const handleMouseDownPassword = (event) => {
      event.preventDefault();
    };

    

  return (
    <Container sx={{mt:10}} maxWidth="sm">
        <Box
          component="form"
          sx={{
            '& .MuiTextField-root': { width: '25ch' },
            "input, label, h2, a": {color: whiteColor}, "fieldset": {borderColor: whiteColor}
          }}
          noValidate
          autoComplete="off"
          className="box-shadow"
          onSubmit={e => {handleSubmit(e)}}
        >
          <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }} sx={{py:4, px: 4}}>
            <Grid item xs={12}>
                <h2 style={{textAlign: "center"}}>Login</h2>
            </Grid>
            <Grid item xs={12}>
              <FormControl sx={{ m: 1, width: "-webkit-fill-available" }} variant="outlined">
                <TextField
                    required
                    id="outlined-required"
                    label="Email"
                    type="email"
                    style={{width: "-webkit-fill-available"}}
                    name="email"
                    defaultValue={loginInfo.email}
                    onChange={handleChange}
                  />
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl sx={{ m: 1, width: "-webkit-fill-available" }} variant="outlined">
                <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
                <OutlinedInput
                  id="outlined-adornment-password"
                  type={showPassword ? 'text' : 'password'}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                        edge="end"
                        sx={{color: whiteColor}}
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  }
                  label="Password"
                  name="password"
                  defaultValue={loginInfo.password}
                  onChange={handleChange}
                />
              </FormControl>
            </Grid>
            <Grid item xs={12} sx={{textAlign: "center"}}>
                <Button variant="outlined" size="large" type="submit">Submit</Button>
            </Grid>
            <Grid item xs={12} sx={{textAlign: "center"}}>
                <Link to="/signup" style={{textDecoration: "none", display: "block", marginTop: "20px"}}>Don't have an account?</Link>
            </Grid>
          </Grid>
        </Box>
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
    </Container>
  );
}