import * as React from 'react';
import { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { userContext } from '../context/userContext';
import PropTypes from 'prop-types';
import { Check, Info, DeliveryDining, Paid } from '@mui/icons-material';
import { Stepper, Step, StepLabel, Button, Typography, Grid, Box, Container, StepConnector, stepConnectorClasses, styled, FormGroup, FormControlLabel, Checkbox, TextField, RadioGroup, Radio, FormControl, colors, Stack  } from '@mui/material'

const whiteColor = colors.common.white;

const steps = ['Contact Info', 'Delivery Method', 'Payment Method'];
  
const QontoStepIconRoot = styled('div')(({ theme, ownerState }) => ({
    color: theme.palette.mode === 'dark' ? theme.palette.grey[700] : '#eaeaf0',
    display: 'flex',
    height: 22,
    alignItems: 'center',
    ...(ownerState.active && {
        color: '#784af4',
    }),
    '& .QontoStepIcon-completedIcon': {
        color: '#784af4',
        zIndex: 1,
        fontSize: 18,
    },
    '& .QontoStepIcon-circle': {
        width: 8,
        height: 8,
        borderRadius: '50%',
        backgroundColor: 'currentColor',
    },
}));
  
function QontoStepIcon(props) {
    const { active, completed, className } = props;

    return (
        <QontoStepIconRoot ownerState={{ active }} className={className}>
        {completed ? (
            <Check className="QontoStepIcon-completedIcon" />
        ) : (
            <div className="QontoStepIcon-circle" />
        )}
        </QontoStepIconRoot>
    );
}
  
  QontoStepIcon.propTypes = {
    /**
     * Whether this step is active.
     * @default false
     */
    active: PropTypes.bool,
    className: PropTypes.string,
    /**
     * Mark the step as completed. Is passed to child components.
     * @default false
     */
    completed: PropTypes.bool,
  };
  
  const ColorlibConnector = styled(StepConnector)(({ theme }) => ({
    [`&.${stepConnectorClasses.alternativeLabel}`]: {
      top: 22,
    },
    [`&.${stepConnectorClasses.active}`]: {
      [`& .${stepConnectorClasses.line}`]: {
        backgroundImage:
          'linear-gradient( 95deg,rgb(242,113,33) 0%,rgb(233,64,87) 50%,rgb(138,35,135) 100%)',
      },
    },
    [`&.${stepConnectorClasses.completed}`]: {
      [`& .${stepConnectorClasses.line}`]: {
        backgroundImage:
          'linear-gradient( 95deg,rgb(242,113,33) 0%,rgb(233,64,87) 50%,rgb(138,35,135) 100%)',
      },
    },
    [`& .${stepConnectorClasses.line}`]: {
      height: 3,
      border: 0,
      backgroundColor:
        theme.palette.mode === 'dark' ? theme.palette.grey[800] : '#eaeaf0',
      borderRadius: 1,
    },
  }));
  
  const ColorlibStepIconRoot = styled('div')(({ theme, ownerState }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? theme.palette.grey[700] : '#ccc',
    zIndex: 1,
    color: whiteColor,
    width: 50,
    height: 50,
    display: 'flex',
    borderRadius: '50%',
    justifyContent: 'center',
    alignItems: 'center',
    ...(ownerState.active && {
      backgroundImage:
        'linear-gradient( 136deg, rgb(242,113,33) 0%, rgb(233,64,87) 50%, rgb(138,35,135) 100%)',
      boxShadow: '0 4px 10px 0 rgba(0,0,0,.25)',
    }),
    ...(ownerState.completed && {
      backgroundImage:
        'linear-gradient( 136deg, rgb(242,113,33) 0%, rgb(233,64,87) 50%, rgb(138,35,135) 100%)',
    }),
  }));
  
  function ColorlibStepIcon(props) {
    const { active, completed, className } = props;
  
    const icons = {
      1: <Info />,
      2: <DeliveryDining />,
      3: <Paid />,
    };
  
    return (
      <ColorlibStepIconRoot ownerState={{ completed, active }} className={className}>
        {icons[String(props.icon)]}
      </ColorlibStepIconRoot>
    );
  }
  
  ColorlibStepIcon.propTypes = {
    /**
     * Whether this step is active.
     * @default false
     */
    active: PropTypes.bool,
    className: PropTypes.string,
    /**
     * Mark the step as completed. Is passed to child components.
     * @default false
     */
    completed: PropTypes.bool,
    /**
     * The label displayed in the step icon.
     */
    icon: PropTypes.node,
  };

export default function Checkout() {
  const {isLoggedIn} = useContext(userContext)
  const [activeStep, setActiveStep] = useState(0);
  const [skipped, setSkipped] = useState(new Set());
  const [check, setCheck] = useState(false);
  const [user, setUser] = useState({});

  const isStepOptional = (step) => {
    return step === 1;
  };

  const isStepSkipped = (step) => {
    return skipped.has(step);
  };

  const handleNext = () => {
    let newSkipped = skipped;
    if (isStepSkipped(activeStep)) {
      newSkipped = new Set(newSkipped.values());
      newSkipped.delete(activeStep);
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped(newSkipped);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleSkip = () => {
    if (!isStepOptional(activeStep)) {
      // You probably want to guard against something like this,
      // it should never occur unless someone's actively trying to break something.
      throw new Error("You can't skip a step that isn't optional.");
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped((prevSkipped) => {
      const newSkipped = new Set(prevSkipped.values());
      newSkipped.add(activeStep);
      return newSkipped;
    });
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  const proceedGuest = (event) => {
    let checkbox = event.target.checked;
    checkbox ? setCheck(true) : setCheck(false);
  }

  const fetchData = async () => {
    try {
        const res = await axios.get('/user');
        console.log(res.data)
        setUser(res.data)
      } catch (error) {
        console.log("error", error);
      }
  };

  useEffect(() => {
      fetchData();
  });

  const stepData = () => {
    return activeStep === 0 ? [
        <Box sx={{ maxWidth: "65%", mx: "auto", mt: 10 }}>
          
            <FormGroup style={{marginTop: "20px"}}>
              {!isLoggedIn() ? <>
                
                {check ? <>
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
                            <TextField id="address" label="Address" type="textarea" variant="outlined" multiline fullWidth  />
                        </Grid>
                        <Grid item xs={12} style={{ marginTop: "30px"}}>
                            <Button variant="contained" onClick={handleNext} style={{textAlign: "right", display: "block", marginLeft: "auto"}} size="large">Submit</Button>
                        </Grid>
                        
                    </Grid>
                </Box>
                </> : <>
                  <Link to="/login" style={{textDecoration: "none"}}><Button variant="contained" size="large">Login</Button></Link>
                  <FormControlLabel sx={{mt:5}} control={<Checkbox sx={{ '& .MuiSvgIcon-root': { fontSize: 28, color: whiteColor } }} onChange={proceedGuest} />} label="Proceed as guest" />
                </>}
                
              </> : <>
              <Box style={{marginTop: "50px"}}>
                    <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 2 }} justifyContent="space-between">
                        <Grid item xs={12} md={6}>
                            <TextField id="fName" label="First Name" variant="outlined" value={user?.first_name || ''} fullWidth  />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField id="lName" label="Last Name" variant="outlined" value={user?.last_name || ''} fullWidth  />
                        </Grid>
                        <Grid item xs={12} md={6} style={{ marginTop: "30px"}}>
                            <TextField id="phone" label="Phone" type="text" variant="outlined" value={user?.phone || ''} fullWidth  />
                        </Grid>
                        <Grid item xs={12} md={6} style={{ marginTop: "30px"}}>
                            <TextField id="email" label="Email" type="email" variant="outlined" value={user?.email || ''} fullWidth  />
                        </Grid>
                        <Grid item xs={12} style={{ marginTop: "30px"}}>
                            <TextField id="address" label="Address" type="textarea" variant="outlined" value={user?.address || ''} multiline fullWidth  />
                        </Grid>
                        <Grid item xs={12} style={{ marginTop: "30px"}}>
                            <Button variant="contained" onClick={handleNext} style={{textAlign: "right", display: "block", marginLeft: "auto"}} size="large">Submit</Button>
                        </Grid>
                    </Grid>
                </Box>
              </>
              }
            </FormGroup>
        </Box>
    ] : activeStep === 1 ? [
        <Box sx={{ maxWidth: "65%", mx: "auto", mt: 10 }}>
            <FormControl sx={{display: "block"}}>
                <RadioGroup
                    aria-labelledby="demo-radio-buttons-group-label"
                    defaultValue="self"
                    name="radio-buttons-group"
                >
                    <FormControlLabel value="self" control={<Radio sx={{color: whiteColor}} />} label="Self-pickup from the store" />
                    <FormControlLabel value="us" control={<Radio sx={{color: whiteColor}} />} label="US Shipping" />
                    <FormControlLabel value="worldwide" control={<Radio sx={{color: whiteColor}} />} label="Worldwide Shipping" />
                </RadioGroup>
            </FormControl>
            <Stack spacing={2} direction="row" sx={{mt:10}}>
              <Button onClick={handleBack} variant="contained" style={{textAlign: "right", display: "inline-block", marginRight: "auto"}} size="large">Back</Button>
              <Button onClick={handleNext} variant="contained" style={{textAlign: "right", display: "inline-block", marginLeft: "auto"}} size="large">Continue to payment</Button>
            </Stack>
        </Box>
    ] : [
        <Box sx={{ maxWidth: "65%", mx: "auto", mt: 10 }}>
            <FormControl>
                <RadioGroup
                    aria-labelledby="demo-radio-buttons-group-label"
                    defaultValue="cod"
                    name="radio-buttons-group"
                >
                    <FormControlLabel value="cod" control={<Radio sx={{color: whiteColor}} checked />} label="Cash on Delivery" />
                    <FormControlLabel value="card" control={<Radio sx={{color: whiteColor}} />} label="Credit Card" />
                </RadioGroup>
            </FormControl>
            <Stack spacing={2} direction="row" sx={{mt:10}}>
              <Button onClick={handleBack} variant="contained" style={{textAlign: "right", display: "inline-block", marginRight: "auto"}} size="large">Back</Button>
              <Button onClick={handleNext} variant="contained" style={{textAlign: "right", display: "inline-block", marginLeft: "auto"}} size="large">Confirm Order</Button>
            </Stack>
        </Box>
    ]
  }

  return (
    <Container maxWidth="xl" sx={{mt:10}}>
        <Grid container>
            <Grid item sm={12}>
                <Box sx={{ width: '100%' }}>
                    <Stepper alternativeLabel activeStep={activeStep} connector={<ColorlibConnector />}>
                    {steps.map((label) => (
                        <Step key={label}>
                            <StepLabel sx={{
                                "& .MuiStepLabel-label, .Mui-completed": {
                                    color: "rgba(255,255,255,0.5)"
                                  },
                                "& .Mui-active.MuiStepLabel-label": {
                                    color: whiteColor
                                  }
                            }} StepIconComponent={ColorlibStepIcon}>{label}</StepLabel>
                        </Step>
                    ))}
                    </Stepper>
                    {activeStep === steps.length ? (
                        <React.Fragment>
                        <Typography sx={{ mt: 2, mb: 1 }}>
                            All steps completed - you&apos;re finished
                        </Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                            <Box sx={{ flex: '1 1 auto' }} />
                            <Button onClick={handleReset}>Reset</Button>
                        </Box>
                        </React.Fragment>
                    ) : (
                        <React.Fragment>
                        {/* <Typography sx={{ mt: 2, mb: 1, color: "#fff" }}>Step {activeStep + 1}</Typography> */}

                        {stepData()}





                        <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                            <Button
                            color="inherit"
                            disabled={activeStep === 0}
                            onClick={handleBack}
                            sx={{ mr: 1 }}
                            style={{color: whiteColor}}
                            >
                            Back
                            </Button>
                            <Box sx={{ flex: '1 1 auto' }} />
                            {isStepOptional(activeStep) && (
                            <Button color="inherit" onClick={handleSkip} sx={{ mr: 1, color: whiteColor }}>
                                Skip
                            </Button>
                            )}

                            <Button onClick={handleNext} sx={{ color: whiteColor }}>
                                {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
                            </Button>
                        </Box>
                        </React.Fragment>
                    )}
                </Box>
            </Grid>
        </Grid>
    </Container>
  );
}
// import * as React from 'react';
// import Grid from '@mui/material/Grid';
// import Box from '@mui/material/Box';
// import Tabs from '@mui/material/Tabs';
// import Tab from '@mui/material/Tab';
// import Typography from '@mui/material/Typography';
// import Button from '@mui/material/Button';
// import FormGroup from '@mui/material/FormGroup';
// import FormControlLabel from '@mui/material/FormControlLabel';
// import Checkbox from '@mui/material/Checkbox';
// import TextField from '@mui/material/TextField';
// import RadioGroup from '@mui/material/RadioGroup';
// import Radio from '@mui/material/Radio';
// import FormControl from '@mui/material/FormControl';
// import FormLabel from '@mui/material/FormLabel';
// import { common } from '@mui/material/colors';

// const whiteColor = common.white;

// interface TabPanelProps {
//     children?: React.ReactNode;
//     index: number;
//     value: number;
//   }
  
//   function TabPanel(props: TabPanelProps) {
//     const { children, value, index, ...other } = props;
  
//     return (
//       <div
//         role="tabpanel"
//         hidden={value !== index}
//         id={`simple-tabpanel-${index}`}
//         aria-labelledby={`simple-tab-${index}`}
//         {...other}
//       >
//         {value === index && (
//           <Box sx={{ p: 3 }}>
//             <Typography>{children}</Typography>
//           </Box>
//         )}
//       </div>
//     );
//   }
  
//   function a11yProps(index: number) {
//     return {
//       id: `simple-tab-${index}`,
//       'aria-controls': `simple-tabpanel-${index}`,
//     };
//   }

// const Checkout = () => {
//     const [value, setValue] = React.useState(0);

//   const handleChange = (event: React.SyntheticEvent, newValue: number) => {
//     setValue(newValue);
//   };
//   return (
//     <div>
//         <Box sx={{ width: '100%' }} sx={{ m: 2 }}>
//             <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 2 }} justifyContent="center">
//                 <Grid item xs={12} md={8} style={{ marginTop: "30px", backgroundColor: "#eeeeee"}}>
//                     <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
//                         <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
//                             <Tab label="Contact Info" {...a11yProps(0)} />
//                             <Tab label="Delivery Method" {...a11yProps(1)} />
//                             <Tab label="Payment Method" {...a11yProps(2)} disbaled />
//                         </Tabs>
//                     </Box>
//                     <TabPanel value={value} index={0}>
//                         <Button variant="contained" size="medium">Login</Button>
//                         <FormGroup style={{marginTop: "20px"}}>
//                             <FormControlLabel control={<Checkbox sx={{ '& .MuiSvgIcon-root': { fontSize: 28 } }}/>} label="Proceed as guest" />
//                             <Box style={{marginTop: "50px"}}>
//                                 <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 2 }} justifyContent="space-between">
//                                     <Grid item xs={12} md={6}>
//                                         <TextField id="fName" label="First Name" variant="outlined" fullWidth  />
//                                     </Grid>
//                                     <Grid item xs={12} md={6}>
//                                         <TextField id="lName" label="Last Name" variant="outlined" fullWidth  />
//                                     </Grid>
//                                     <Grid item xs={12} md={6} style={{ marginTop: "30px"}}>
//                                         <TextField id="phone" label="Phone" type="number" variant="outlined" fullWidth  />
//                                     </Grid>
//                                     <Grid item xs={12} md={6} style={{ marginTop: "30px"}}>
//                                         <TextField id="email" label="Email" type="email" variant="outlined" fullWidth  />
//                                     </Grid>
//                                     <Grid item xs={12} style={{ marginTop: "30px"}}>
//                                         <TextField id="address" label="Address" type="textarea" variant="outlined" fullWidth  />
//                                     </Grid>
//                                     <Grid item xs={12} style={{ marginTop: "30px"}}>
//                                         <Button variant="contained" style={{textAlign: "right", display: "block", marginLeft: "auto"}} size="large">Submit</Button>
//                                     </Grid>
                                    
//                                 </Grid>
//                             </Box>
//                         </FormGroup>
//                     </TabPanel>
//                     <TabPanel value={value} index={1}>
//                         <FormControl>
//                             <RadioGroup
//                                 aria-labelledby="demo-radio-buttons-group-label"
//                                 defaultValue="self"
//                                 name="radio-buttons-group"
//                             >
//                                 <FormControlLabel value="self" control={<Radio />} label="Self-pickup from the store" />
//                                 <FormControlLabel value="us" control={<Radio />} label="US Shipping" />
//                                 <FormControlLabel value="worldwide" control={<Radio />} label="Worldwide Shipping" />
//                             </RadioGroup>
//                         </FormControl>
//                         <Button variant="contained" style={{textAlign: "right", display: "block", marginLeft: "auto"}} size="large">Continue to payment</Button>
//                     </TabPanel>
//                     <TabPanel value={value} index={2}>
//                         <FormControl>
//                             <RadioGroup
//                                 aria-labelledby="demo-radio-buttons-group-label"
//                                 defaultValue="cod"
//                                 name="radio-buttons-group"
//                             >
//                                 <FormControlLabel value="cod" control={<Radio />} label="Cash on Delivery" />
//                                 <FormControlLabel value="card" control={<Radio />} label="Credit Card" />
//                             </RadioGroup>
//                         </FormControl>
//                         <Button variant="contained" style={{textAlign: "right", display: "block", marginLeft: "auto"}} size="large">Confirm Order</Button>
//                     </TabPanel>
//                 </Grid>
//             </Grid>
//         </Box>
//     </div>
//   )
// }

// export default Checkout