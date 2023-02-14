import * as React from 'react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Container from '@mui/material/Container'
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import { common } from '@mui/material/colors';
const whiteColor = common.white;

export default function Login() {

    const [state , setState] = useState({
        email : "",
        password : ""
    })

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
        await axios.post("http://127.0.0.1:5000/api/login", state, { withCredentials: true,
        headers: 
          { 
            "Content-Type": "application/json",
          },
          
        })

        navigate("/");
    }

    

  return (
    <Container sx={{mt:10}} maxWidth="sm">
        <Box
      component="form"
      sx={{
        '& .MuiTextField-root': { m: 1, width: '25ch' },
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
            <TextField
            required
            id="outlined-required"
            label="Email"
            type="email"
            style={{width: "-webkit-fill-available"}}
            name="email"
            defaultValue={state.email}
            onChange={handleChange}
            />
        </Grid>
        <Grid item xs={12}>
            <TextField
                required
                id="outlined-password-input"
                label="Password"
                type="password"
                name="password"
                autoComplete="current-password"
                style={{width: "-webkit-fill-available"}}
                defaultValue={state.password}
                onChange={handleChange}
            />
        </Grid>
        <Grid item xs={12} sx={{textAlign: "center"}}>
            <Button variant="outlined" size="large" type="submit">Submit</Button>
        </Grid>
        <Grid item xs={12} sx={{textAlign: "center"}}>
            <Link to="/signup" style={{textDecoration: "none", display: "block", marginTop: "20px"}}>Don't have an account?</Link>
        </Grid>
      </Grid>
    </Box>
    </Container>
  );
}