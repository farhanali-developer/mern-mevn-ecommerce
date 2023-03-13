import React, { useState } from "react";
import { PaymentElement } from "@stripe/react-stripe-js";
import { useStripe, useElements } from "@stripe/react-stripe-js";
import { Button } from '@mui/material'

export default function CheckoutForm(props) {

  const stripe = useStripe();
  const elements = useElements();

  const [message, setMessage] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

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

    const response = await stripe.confirmPayment({

      elements,
      confirmParams: {
        // Make sure to change this to your payment completion page
        // return_url: `${window.location.origin}/completion`,
      },
      redirect: 'if_required' 
    });


    // if (error.type === "card_error" || error.type === "validation_error") {
    //   setMessage(error.message);
    // } else {
    //   setMessage("An unexpected error occured.");
    // }

    console.log(response.paymentIntent)

    if (response.error) {
        setMessage(response.error.message);
       } else {
        setMessage(`Payment Succeeded: ${response.paymentIntent.id}`);
        props.payment(true)
       }

    setIsProcessing(false);
  };

  return (
    <form id="payment-form" onSubmit={handleSubmit} className="box-shadow" style={{padding: "20px"}}>
      <PaymentElement id="payment-element" />
      <Button type="submit" disabled={isProcessing || !stripe || !elements} id="submit" variant="contained" sx={{mt:5}} size="large">
        <span id="button-text">
          {isProcessing ? "Processing ... " : "Pay now"}
        </span>
      </Button>
    </form>
  );
}