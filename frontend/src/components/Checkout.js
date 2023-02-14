import * as React from 'react';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import TextField from '@mui/material/TextField';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import { common } from '@mui/material/colors';

const whiteColor = common.white;

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
  }
  
  function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;
  
    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
      >
        {value === index && (
          <Box sx={{ p: 3 }}>
            <Typography>{children}</Typography>
          </Box>
        )}
      </div>
    );
  }
  
  function a11yProps(index: number) {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
    };
  }

const Checkout = () => {
    const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };
  return (
    <div>
        <Box sx={{ width: '100%' }} sx={{ m: 2 }}>
            <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 2 }} justifyContent="center">
                <Grid item xs={12} md={8} style={{ marginTop: "30px", backgroundColor: "#eeeeee"}}>
                    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                            <Tab label="Contact Info" {...a11yProps(0)} />
                            <Tab label="Delivery Method" {...a11yProps(1)} />
                            <Tab label="Payment Method" {...a11yProps(2)} disbaled />
                        </Tabs>
                    </Box>
                    <TabPanel value={value} index={0}>
                        <Button variant="contained" size="medium">Login</Button>
                        <FormGroup style={{marginTop: "20px"}}>
                            <FormControlLabel control={<Checkbox sx={{ '& .MuiSvgIcon-root': { fontSize: 28 } }}/>} label="Proceed as guest" />
                            <Box style={{marginTop: "50px"}}>
                                <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 2 }} justifyContent="space-between">
                                    <Grid item xs={12} md={6}>
                                        <TextField id="fName" label="First Name" variant="outlined" fullWidth  />
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <TextField id="lName" label="Last Name" variant="outlined" fullWidth  />
                                    </Grid>
                                    <Grid item xs={12} md={6} style={{ marginTop: "30px"}}>
                                        <TextField id="phone" label="Phone" type="number" variant="outlined" fullWidth  />
                                    </Grid>
                                    <Grid item xs={12} md={6} style={{ marginTop: "30px"}}>
                                        <TextField id="email" label="Email" type="email" variant="outlined" fullWidth  />
                                    </Grid>
                                    <Grid item xs={12} style={{ marginTop: "30px"}}>
                                        <TextField id="address" label="Address" type="textarea" variant="outlined" fullWidth  />
                                    </Grid>
                                    <Grid item xs={12} style={{ marginTop: "30px"}}>
                                        <Button variant="contained" style={{textAlign: "right", display: "block", marginLeft: "auto"}} size="large">Submit</Button>
                                    </Grid>
                                    
                                </Grid>
                            </Box>
                        </FormGroup>
                    </TabPanel>
                    <TabPanel value={value} index={1}>
                        <FormControl>
                            <RadioGroup
                                aria-labelledby="demo-radio-buttons-group-label"
                                defaultValue="self"
                                name="radio-buttons-group"
                            >
                                <FormControlLabel value="self" control={<Radio />} label="Self-pickup from the store" />
                                <FormControlLabel value="us" control={<Radio />} label="US Shipping" />
                                <FormControlLabel value="worldwide" control={<Radio />} label="Worldwide Shipping" />
                            </RadioGroup>
                        </FormControl>
                        <Button variant="contained" style={{textAlign: "right", display: "block", marginLeft: "auto"}} size="large">Continue to payment</Button>
                    </TabPanel>
                    <TabPanel value={value} index={2}>
                        <FormControl>
                            <RadioGroup
                                aria-labelledby="demo-radio-buttons-group-label"
                                defaultValue="cod"
                                name="radio-buttons-group"
                            >
                                <FormControlLabel value="cod" control={<Radio />} label="Cash on Delivery" />
                                <FormControlLabel value="card" control={<Radio />} label="Credit Card" />
                            </RadioGroup>
                        </FormControl>
                        <Button variant="contained" style={{textAlign: "right", display: "block", marginLeft: "auto"}} size="large">Confirm Order</Button>
                    </TabPanel>
                </Grid>
            </Grid>
        </Box>
    </div>
  )
}

export default Checkout