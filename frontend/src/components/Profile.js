import * as React from 'react';
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Container from '@mui/material/Container'
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import { common } from '@mui/material/colors';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import InputAdornment from '@mui/material/InputAdornment';
import OutlinedInput from '@mui/material/OutlinedInput';
import IconButton from '@mui/material/IconButton';
const whiteColor = common.white;

export default function Profile() {

    const [state , setState] = useState([])

    const navigate = useNavigate();

    const handleChange = (e) => {
        const nextFormState = {
            ...state,
            [e.target.name]: e.target.value,
          };
          setState(nextFormState);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        const res = await axios.post("/profile", state, { withCredentials: true,
        headers: 
          { 
            "Content-Type": "application/json",
          },
          
        })
    }

    const fetchData = async () => {
        try {
            const url = '/user';
            const res = await axios.get(url);
            // console.log(res.data)
            setState(res.data)
            
          } catch (error) {
            console.log("error", error);
          }
    };

    useEffect(() => {
        fetchData();
      }, []);


      const [showPassword, setShowPassword] = useState(false);

      const handleClickShowPassword = () => setShowPassword((show) => !show);

      const handleMouseDownPassword = (event) => {
        event.preventDefault();
      };

    

  return (
    <Container sx={{mt:10}} maxWidth="sm">
        <Box
      component="form"
      sx={{
        '& .MuiTextField-root': { m: 1, },
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
            <TextField
            required
            id="userFullName"
            label="Full Name"
            type="text"
            fullWidth
            name="full_name"
            value={state.full_name || ""}
            onChange={handleChange}
            />
        </Grid>
        <Grid item xs={12}>
            <TextField
            required
            id="userEmail"
            label="Email"
            type="email"
            fullWidth
            name="email"
            value={state.email || ""}
            onChange={handleChange}
            />
        </Grid>
        <Grid item xs={12}>
            <TextField
              id="userAddress"
              label="Address"
              multiline
              variant="filled"
              fullWidth
              name="address"
              value={state.address || ""}
              onChange={handleChange}
            />
        </Grid>
        <Grid item xs={12}>
            <OutlinedInput
            sx={{textAlign: "center"}}
            id="userPassword"
            type={showPassword ? 'text' : 'password'}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickShowPassword}
                  onMouseDown={handleMouseDownPassword}
                  edge="end"
                  style={{color: "#fff"}}
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
            label="Password"
            name="password"
            fullWidth
            value={state.password || ""}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12} sx={{textAlign: "center"}}>
            <Button variant="outlined" size="large" type="submit">Submit</Button>
        </Grid>
      </Grid>
    </Box>
    </Container>
  );
}