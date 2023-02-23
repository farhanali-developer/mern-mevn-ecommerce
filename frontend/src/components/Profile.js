import * as React from 'react';
import { useState, useEffect, useContext } from 'react';
// import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { Box, TextField, Container, Grid, Button, InputAdornment, OutlinedInput, IconButton, colors, FormControl, InputLabel } from '@mui/material';
import { userContext } from '../context/userContext'

const whiteColor = colors.common.white;

export default function Profile() {

    const [ updateUser , setUpdateUser ] = useState({})
    const { user, setUser } = useContext(userContext);
    const [showPassword, setShowPassword] = useState(false);

    // const navigate = useNavigate();

    const handleChange = (event) => {
            setUpdateUser({
            ...updateUser,
            [event.target.name]: event.target.value,
          });
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        await axios.put("/user", user, { withCredentials: true,
        headers: 
          { 
            "Content-Type": "application/json",
          },
          
        })
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
            "input, label, h2, a": {color: whiteColor}, "fieldset": {borderColor: whiteColor}
          }}
          noValidate
          autoComplete="off"
          className="box-shadow"
          onSubmit={e => {handleSubmit(e)}}
        >
          <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }} sx={{py:4, px: 4}}>
            <Grid item xs={12}>
                <h2 style={{textAlign: "center"}}>Profile</h2>
            </Grid>
            <Grid item xs={12}>
              <FormControl sx={{ m: 1, width: "-webkit-fill-available" }} variant="outlined">
                <TextField
                  fullWidth
                  required
                  id="userFirstName"
                  label="First Name"
                  type="text"
                  name="first_name"
                  value={user?.first_name || ""}
                  onChange={handleChange}
                />
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl sx={{ m: 1, width: "-webkit-fill-available" }} variant="outlined">
                <TextField
                  required
                  id="userLastName"
                  label="Last Name"
                  type="text"
                  fullWidth
                  name="last_name"
                  value={user?.last_name || ""}
                  onChange={handleChange}
                />
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl sx={{ m: 1, width: "-webkit-fill-available" }} variant="outlined">
                <TextField
                  required
                  id="userEmail"
                  label="Email"
                  type="email"
                  fullWidth
                  name="email"
                  value={user?.email || ""}
                  onChange={handleChange}
                />
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl sx={{ m: 1, width: "-webkit-fill-available" }} variant="outlined">
                <TextField
                required
                id="userPhone"
                label="Phone"
                type="text"
                fullWidth
                name="phone"
                value={user?.phone || ""}
                onChange={handleChange}
                />
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl sx={{ m: 1, width: "-webkit-fill-available" }} variant="outlined">
                <TextField
                  id="userAddress"
                  name="address"
                  label="Address"
                  type="textarea"
                  variant="outlined"
                  value={user?.address || ""}
                  onChange={handleChange}
                  required
                  multiline
                  fullWidth
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
                  fullWidth
                  label="Password"
                  name="password"
                  onChange={handleChange}
                />
              </FormControl>
            </Grid>
            <Grid item xs={12} sx={{textAlign: "center", mt: 5}}>
                <Button variant="outlined" size="large" type="submit">Submit</Button>
            </Grid>
          </Grid>
        </Box>
    </Container>
  );
}