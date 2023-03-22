import React, { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { userContext } from '../context/userContext';
import { CartContext } from '../context/cartContext';
import PropTypes from 'prop-types';
import { Check, Info, DeliveryDining, Paid } from '@mui/icons-material';
import { Stepper, Step, StepLabel, Button, Typography, Grid, Box, Container, StepConnector, stepConnectorClasses, styled, FormGroup, FormControlLabel, Checkbox, TextField, RadioGroup, Radio, FormControl, colors, Stack, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Slide, IconButton, Snackbar, Alert as MuiAlert } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close';
import { loadStripe } from '@stripe/stripe-js'
import { CardElement, Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "./CheckoutForm";
import { PaymentElement } from "@stripe/react-stripe-js";
import { useStripe, useElements } from "@stripe/react-stripe-js";

const CARD_OPTIONS = {
	iconStyle: "solid",
	style: {
		base: {
			iconColor: "#c4f0ff",
			color: "#fff",
			fontWeight: 500,
			fontFamily: "Roboto, Open Sans, Segoe UI, sans-serif",
			fontSize: "16px",
			fontSmoothing: "antialiased",
			":-webkit-autofill": { color: "#fce883" },
			"::placeholder": { color: "#87bbfd" }
		},
		invalid: {
			iconColor: "#ffc7ee",
			color: "#ffc7ee"
		}
	}
}

const whiteColor = colors.common.white;

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});

function TransitionDown(props) {
  return <Slide {...props} direction="down" />;
}

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
  const { isLoggedIn, user } = useContext(userContext)
  const { cartData, fetchCart } = useContext(CartContext)
  const [activeStep, setActiveStep] = useState(0);
  const [skipped, setSkipped] = useState(new Set());
  const [check, setCheck] = useState(false);
  const [updatedUserData, setUpdatedUserData] = useState({});
  const [open, setOpen] = React.useState(false);
  const [severity, setSeverity] = useState();
  const [orderData, setOrderData] = useState(
    {
      customerInfo : {
        userId: '',
        first_name: '',
        last_name: '',
        phone: '',
        email: '',
        address: ''
    },
      products: [],
      cartTotal: {},
      deliveryMethod: '',
      paymentMethod: '',
      paymentId: ''
    },
  );
  const [state, setState] = useState({
    open: false,
    Transition: 'SlideTransition'
  });

  const [transition, setTransition] = useState(undefined)
  const [alert, setAlert] = useState("")
  const [orderNumber, setOrderNumber] = useState(0)
  const [paymentMethod, setPaymentMethod] = useState("cod")
  const [stripePromise, setStripePromise] = useState()
  const [clientSecret, setClientSecret] = useState()
  const [message, setMessage] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const stripe = useStripe();
  const elements = useElements();

  const navigate = useNavigate();

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

  const handleDialogOpen = (e) => {
    e.preventDefault();
    setOpen(true);
  };

  const handleDialogClose = () => {
    setOpen(false);
  };

  const openSnackBar = () => {
    setState({ open: true });
    setTransition(() => TransitionDown);
  };

  const handleClose = () => {
    setState({ ...state, open: false });
  };

  const handleChange = (event) => {
    setUpdatedUserData({
      ...updatedUserData,
      [event.target.name]: event.target.value,
    });
  }

  const handleContactSubmit = (e) => {
    e.preventDefault();

    setOrderData({
      customerInfo: {
        userId: user?._id,
        ...updatedUserData
      },
      products: cartData?.products,
      cartTotal: cartData?.cartTotal,
    })

    handleNext()
  }

  const delivery = (e) => {
    setOrderData({
      ...orderData,
      deliveryMethod: e.target.value
    })
  }

  const payment = (e) => {
    setPaymentMethod(e.target.value)
    setOrderData({
      ...orderData,
      paymentMethod: e.target.value
    })
  }

  const finalOrder = async () => {
    try {
        handleDialogClose()
        const res = await axios.post('/order', {data: orderData});
        const orderId = res.data.orderId
        fetchCart()
        if(res.status < 400){
          setAlert("Order Confirmed! Thank you for ordering with us.");
          setSeverity("success");
          openSnackBar()
          setTimeout(()=> {
            // navigate(`/order/${orderId}`);
           }, 3000);
        }
        else{
          setAlert("Sorry! An error occured.");
          setSeverity("error");
          openSnackBar()
        }
      } catch (error) {
        console.log("error", error);
      }
  };

  const getKey = async () => {
    const res = await axios.get('/stripe-key')
    setStripePromise(loadStripe(res.data.stripeKey))
  }

  const getSecretKey = async () => {
    const res = await axios.post('/create-payment-intent', JSON.stringify({}))
    setClientSecret(res.data.clientSecret)
  }

  useEffect(() => {
      setUpdatedUserData(user)
      getKey()
      getSecretKey()
  }, [ user, cartData ]);



  const handleSubmit = async () => {

    if (!stripe || !elements) {
      // Stripe.js has not yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      return;
    }

    setIsProcessing(true);

     // create a stripe subscription
    //  const subscription = await this.stripe.subscriptions.create({
    //   customer: userId,
    //   items: cartItems,
    //   payment_settings: {
    //     payment_method_options: {
    //       card: {
    //         request_three_d_secure: 'any',
    //       },
    //     },
    //     payment_method_types: ['card'],
    //     save_default_payment_method: 'on_subscription',
    //   },
    //   expand: ['latest_invoice.payment_intent'],
    // });

    // console.log(subscription)

    // const response = await stripe.confirmPayment({

    //   elements,
    //   confirmParams: {
    //     // Make sure to change this to your payment completion page
    //     // return_url: `${window.location.origin}/completion`,
    //   },
    //   redirect: 'if_required' 
    // });

    // if (response.error) {
    //   setMessage(response.error.message);
    // } else {
    //   setMessage(`Payment Succeeded: ${response.paymentIntent.id}`);
    //   finalOrder()
    // }

    const {error, paymentMethod} = await stripe.createPaymentMethod({
      type: "card",
      card: elements.getElement(CardElement)
    })

    

    if(!error) {
      try {
        const {id} = paymentMethod
          // const response = await axios.post("http://localhost:4000/payment", {
          //     amount: 1000,
          //     id
          // })
          handleDialogClose()
          const res = await axios.post('/order', {data: orderData, paymentId: id});
          const orderId = res.data.orderId
          if(res.data.success){
            setIsProcessing(false);
            fetchCart()
            setAlert("Order Confirmed! Thank you for ordering with us.");
            setSeverity("success");
            openSnackBar()
            setTimeout(()=> {
              // navigate(`/order/${orderId}`);
             }, 3000);
          }
          else{
            setAlert("Sorry! An error occured.");
            setSeverity("error");
            openSnackBar()
          }

      } catch (error) {
          console.log("Error", error)
      }
  } else {
      console.log(error.message)
  }


    
  };


  const stepData = () => {
    return activeStep === 0 ? [
        <Box sx={{ maxWidth: "65%", mx: "auto", mt: 10 }}>
          
            <FormGroup style={{marginTop: "20px"}}>
              {!isLoggedIn() ? <>
                
                {check ? <>
                  <Box style={{marginTop: "50px"}}>
                    <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 2 }} justifyContent="space-between">
                        <Grid item xs={12} md={6}>
                            <TextField id="fName" label="First Name" variant="outlined" name="first_name"  onChange={handleChange} fullWidth  />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField id="lName" label="Last Name" variant="outlined" name="last_name" onChange={handleChange} fullWidth  />
                    </Grid>
                        <Grid item xs={12} md={6} style={{ marginTop: "30px"}}>
                            <TextField id="phone" label="Phone" type="number" variant="outlined" name="phone" onChange={handleChange} fullWidth  />
                        </Grid>
                        <Grid item xs={12} md={6} style={{ marginTop: "30px"}}>
                            <TextField id="email" label="Email" type="email" variant="outlined" name="email" onChange={handleChange} fullWidth  />
                        </Grid>
                        <Grid item xs={12} style={{ marginTop: "30px"}}>
                            <TextField id="address" label="Address" type="textarea" variant="outlined" name="address" onChange={handleChange} multiline fullWidth  />
                        </Grid>
                        <Grid item xs={12} style={{ marginTop: "30px"}}>
                            <Button variant="contained" onClick={handleContactSubmit} style={{textAlign: "right", display: "block", marginLeft: "auto"}} size="large">Submit</Button>
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
                          <TextField id="fName" label="First Name" variant="outlined" name="first_name" 
                          value={updatedUserData?.first_name || ''} 
                          onChange={handleChange} fullWidth  />
                      </Grid>
                      <Grid item xs={12} md={6}>
                          <TextField id="lName" label="Last Name" variant="outlined" name="last_name" 
                          value={updatedUserData?.last_name || ''} 
                          onChange={handleChange} fullWidth  />
                      </Grid>
                      <Grid item xs={12} md={6} style={{ marginTop: "30px"}}>
                          <TextField id="phone" label="Phone" type="text" variant="outlined" name="phone" 
                          value={updatedUserData?.phone || ''} 
                          onChange={handleChange} fullWidth  />
                      </Grid>
                      <Grid item xs={12} md={6} style={{ marginTop: "30px"}}>
                          <TextField id="email" label="Email" type="email" variant="outlined" name="email" 
                          value={updatedUserData?.email || ''} 
                          onChange={handleChange} fullWidth  />
                      </Grid>
                      <Grid item xs={12} style={{ marginTop: "30px"}}>
                          <TextField id="address" label="Address" type="textarea" variant="outlined" name="address" 
                          value={updatedUserData?.address || ''} 
                          onChange={handleChange} multiline fullWidth  />
                      </Grid>
                      <Grid item xs={12} style={{ marginTop: "30px"}}>
                          <Button variant="contained" onClick={handleContactSubmit} style={{textAlign: "right", display: "block", marginLeft: "auto"}} size="large">Submit</Button>
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
                    // defaultValue="self"
                    name="radio-buttons-group"
                    onChange={delivery}
                    required
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
          {paymentMethod == "cod" ? <>
            <FormControl>
                <RadioGroup
                    aria-labelledby="demo-radio-buttons-group-label"
                    // defaultValue="cod"
                    name="radio-buttons-group"
                    onChange={payment}
                    sx={{mb:5}}
                    required
                >
                    <FormControlLabel value="cod" control={<Radio sx={{color: whiteColor}} />} label="Cash on Delivery" />
                    <FormControlLabel value="card" control={<Radio sx={{color: whiteColor}} />} label="Credit Card" />
                </RadioGroup>
            </FormControl>
          </> : <>
          <FormControl>
                <RadioGroup
                    aria-labelledby="demo-radio-buttons-group-label"
                    defaultValue="card"
                    name="radio-buttons-group"
                    onChange={payment}
                    sx={{mb:5}}
                    required
                >
                    <FormControlLabel value="cod" control={<Radio sx={{color: whiteColor}} />} label="Cash on Delivery" />
                    <FormControlLabel value="card" control={<Radio sx={{color: whiteColor}} />} label="Credit Card" />
                </RadioGroup>
            </FormControl>
          {/* {clientSecret && stripePromise && (
              <Elements stripe={stripePromise} options={{ clientSecret }}>
                <CheckoutForm />
              </Elements>
            )} */}

          <form id="payment-form" className="box-shadow" style={{padding: "50px"}}>
            {/* <PaymentElement id="payment-element" /> */}
            <CardElement options={CARD_OPTIONS}/>
            <Button type="submit" disabled={isProcessing || !stripe || !elements} id="submit" variant="contained" sx={{mt:5}} size="large" onClick={(e)=> handleDialogOpen(e)}>
              <span id="button-text">
                {isProcessing ? "Processing ... " : "Pay now and confirm order"}
              </span>
            </Button>
          </form>
          </>}
           
            
            <Stack spacing={2} direction="row" sx={{mt:10}}>
              <Button onClick={handleBack} variant="contained" style={{textAlign: "right", display: "inline-block", marginRight: "auto"}} size="large">Back</Button>
              {orderData?.paymentMethod == "cod" ? <>
                <Button onClick={(e)=> handleDialogOpen(e)} variant="contained" style={{textAlign: "right", display: "inline-block", marginLeft: "auto"}} size="large">Confirm Order</Button>
              </>: <></>}
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
                                    color: "rgba(255,255,255,0.5) !important"
                                  },
                                "& .Mui-active.MuiStepLabel-label": {
                                    color: whiteColor + "!important"
                                  }
                            }} StepIconComponent={ColorlibStepIcon}>{label}</StepLabel>
                        </Step>
                    ))}
                    </Stepper>
                    {activeStep === steps.length ? (
                        <>
                        <Typography sx={{ mt: 2, mb: 1 }}>
                            All steps completed - you&apos;re finished
                        </Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                            <Box sx={{ flex: '1 1 auto' }} />
                            <Button onClick={handleReset}>Reset</Button>
                        </Box>
                        </>
                    ) : (
                        <>
                          {stepData()}
                          <Dialog
                                open={open}
                                onClose={handleDialogClose}
                                aria-labelledby="alert-dialog-title"
                                aria-describedby="alert-dialog-description"
                                TransitionComponent={Transition}
                                keepMounted
                                disableEnforceFocus
                            >
                                <DialogTitle id="alert-dialog-title">
                                    {"Order Confirmation"}
                                    <IconButton
                                        aria-label="close"
                                        onClick={handleDialogClose}
                                        sx={{
                                            position: 'absolute',
                                            right: 0,
                                            top: 8,
                                            color: (theme) => theme.palette.grey[500],
                                        }}
                                        >
                                        <CloseIcon />
                                    </IconButton>
                                </DialogTitle>
                                <DialogContent>
                                    <DialogContentText id="alert-dialog-description">
                                        Please double check your cart items before proceeding.
                                    </DialogContentText>
                                    <DialogContentText id="alert-dialog-description">
                                        Confirm Order?
                                    </DialogContentText>
                                </DialogContent>
                                <DialogActions>
                                    <Button onClick={() => {handleDialogClose()}}>No</Button>
                                    {orderData?.paymentMethod == "card" ? <>
                                    <Button onClick={() => {handleSubmit()}} autoFocus>
                                        Yes
                                    </Button>
                                    </> : orderData?.paymentMethod == "cod" ? <>
                                    <Button onClick={() => {finalOrder()}} autoFocus>
                                        Yes
                                    </Button>
                                    </> : <></>}
                                </DialogActions>
                            </Dialog>
                          <Snackbar
                              anchorOrigin={{ vertical: "top", horizontal: "right" }}
                              open={state.open}
                              onClose={handleClose}
                              autoHideDuration={3000}
                              TransitionComponent={transition}
                              // message="Cart Updated"
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
                        </>
                    )}
                </Box>
            </Grid>
        </Grid>
    </Container>
  );
}