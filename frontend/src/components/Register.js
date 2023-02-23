import * as React from 'react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Container, Grid, Box, TextField, Button, Alert, colors, InputAdornment, OutlinedInput, FormControl, InputLabel, IconButton, Snackbar, Slide } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { Visibility, VisibilityOff } from '@mui/icons-material';
const whiteColor = colors.common.white;


function TransitionDown(props) {
  return <Slide {...props} direction="down" />;
}


export default function Register() {

  const navigate = useNavigate();

    const [user , setUser] = useState({
        first_name: "",
        last_name: "",
        email : "",
        phone: "",
        address: "",
        password : "",
        role: "user"
    })

    const [state, setState] = useState({
      open: false,
      Transition: 'SlideTransition'
    });

    const [showPassword, setShowPassword] = useState(false);
    const [transition, setTransition] = useState(undefined);
    const [alert, setAlert] = useState("");
    const [severity, setSeverity] = useState();

    const handleChange = (e) => {
        const nextFormState = {
            ...user,
            [e.target.name]: e.target.value,
          };
          setUser(nextFormState);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        const res = await axios.post("/signup", user, { withCredentials: true,
        headers: 
          { 
            "Content-Type": "application/json",
          },
          
        })

        if(res.data === "User Exists."){
            setAlert("The provided email already exists.");
            setSeverity("error");
            setState({ open: true });
            setTransition(() => TransitionDown);
        }
        else{
          setAlert("Signup Successful. Redirecting to Login Page.");
          setSeverity("success");
          setState({ open: true });
          setTransition(() => TransitionDown);
          setTimeout(()=> {
            navigate("/login");
          }, 3000);
        }
    }

    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const handleMouseDownPassword = (event) => {
      event.preventDefault();
    };

    const handleClose = () => {
      setState({ ...state, open: false });
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
                <h2 style={{textAlign: "center"}}>Register</h2>
            </Grid>
            <Grid item xs={12}>
              <FormControl sx={{ m: 1, width: "-webkit-fill-available" }} variant="outlined">
                <TextField
                required
                fullWidth
                id="userFirstName"
                label="First Name"
                type="text"
                style={{width: "-webkit-fill-available"}}
                name="first_name"
                value={user?.first_name}
                onChange={handleChange}
                />
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl sx={{ m: 1, width: "-webkit-fill-available" }} variant="outlined">
                <TextField
                required
                fullWidth
                id="userLastName"
                label="Last Name"
                type="text"
                style={{width: "-webkit-fill-available"}}
                name="last_name"
                value={user?.last_name}
                onChange={handleChange}
                />
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl sx={{ m: 1, width: "-webkit-fill-available" }} variant="outlined">
                <TextField
                required
                fullWidth
                id="userEmail"
                label="Email"
                type="email"
                style={{width: "-webkit-fill-available"}}
                name="email"
                value={user?.email}
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
                    value={user?.password}
                    onChange={handleChange}
                  />
                </FormControl>
            </Grid>
            <Grid item xs={12} sx={{textAlign: "center"}}>
                <Button variant="outlined" size="large" type="submit">Submit</Button>
            </Grid>
            <Grid item xs={12} sx={{textAlign: "center"}}>
                <Link to="/login" style={{textDecoration: "none", display: "block", marginTop: "20px"}}>Already Have an account?</Link>
            </Grid>
          </Grid>

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
        </Box>
    </Container>
  );
}