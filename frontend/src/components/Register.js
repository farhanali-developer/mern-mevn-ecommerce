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

export default function Register() {

    const [state , setState] = useState({
        full_name: "",
        email : "",
        password : "",
        address: "",
        role: "user"
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
        const res = await axios.post("/signup", state, { withCredentials: true,
        headers: 
          { 
            "Content-Type": "application/json",
          },
          
        })

        if(res.status == 200){
          navigate("/login");
        }
        else{
          console.log("Error")
        }
        // console.log(JSON.stringify(state, null, 2))
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
            <h2 style={{textAlign: "center"}}>Register</h2>
        </Grid>
        <Grid item xs={12}>
            <TextField
            required
            id="userFullName"
            label="Full Name"
            type="text"
            style={{width: "-webkit-fill-available"}}
            name="full_name"
            defaultValue={state.full_name}
            onChange={handleChange}
            />
        </Grid>
        <Grid item xs={12}>
            <TextField
            required
            id="userEmail"
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
                id="userPassword"
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
            <Link to="/login" style={{textDecoration: "none", display: "block", marginTop: "20px"}}>Already Have an account?</Link>
        </Grid>
      </Grid>
    </Box>
    </Container>
  );
}