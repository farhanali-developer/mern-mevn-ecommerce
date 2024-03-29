const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const Orders = require('../models/order')
const Cart = require('../models/cart')
const Users = require('../models/users')
const Notifications = require('../models/notifications')
require("dotenv").config({ path: "../.env" });
const secret = process.env.SECRET
const STRIPE_PUBLISHABLE_KEY = process.env.STRIPE_PUBLISHABLE_KEY
const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY
const WHATSAPP_ACCESS_TOKEN = process.env.WHATSAPP_ACCESS_TOKEN
const WHATSAPP_PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID
const PUSHER_APP_ID = process.env.PUSHER_APP_ID
const PUSHER_KEY = process.env.PUSHER_KEY
const PUSHER_SECRET = process.env.PUSHER_SECRET
const stripe = require('stripe')(STRIPE_SECRET_KEY)
const nodemailer = require("nodemailer");
const AllProducts = require('../models/allproducts')
const axios = require('axios');
const Pusher = require("pusher")


const getOrders = async (req, res) => {
try {
    const userToken = req.cookies['jwt']
    const decoded = jwt.verify(userToken, secret)
    const ordersData = await Orders.find({'customerInfo.userId': decoded?._id}).sort({ createdAt : "desc"}).populate("products.product")
    res.json(ordersData)
} catch (error) {
    console.log(error) 
}  
}

const getAllOrders = async (req, res) => {
  try {
      const ordersData = await Orders.find().sort({ createdAt : "desc"}).populate("products.product")
      res.json(ordersData)
  } catch (error) {
      console.log(error) 
  }  
  }

const stripeKey = async (req, res) => {
    res.json({stripeKey: STRIPE_PUBLISHABLE_KEY})
}

const getOrderById = async (req, res) => {
    const data = await Orders.findById({ _id : req.params.id }).populate("products.product")
    res.json(data)
}

const updateOrderStatus = async (req, res) => {
  try {
    const newStatus = await Orders.findByIdAndUpdate(
      req.body.id,
      {
        orderStatus: req.body.newStatus
      },
      {
        new: true
      }
    )

    const notificationsData = {
      userId: req.body.userId,
      notifications: [{
        orderId: req.body.id,
        oldStatus: req.body.oldStatus,
        newStatus: req.body.newStatus,
        readStatus: false
      }]
    }

    const userId = req.body.userId


    const notifications = await Notifications.findOne({ userId });
    if(notifications){
      await Notifications.findOneAndUpdate(
        { userId: userId },
        { $push: { notifications: { 
          orderId: req.body.id,
          oldStatus: req.body.oldStatus,
          newStatus: req.body.newStatus,
          readStatus: false
         } }, $set: { modifiedOn: Date.now() } },
        { new: true }
      )
    }
    else{
      await Notifications.create(notificationsData)
    }

    const pusher = new Pusher({
      appId: PUSHER_APP_ID,
      key: PUSHER_KEY,
      secret: PUSHER_SECRET,
      useTLS: true,
      cluster: "ap2",
    })

    pusher.trigger("my-channel", "my-event", {
      // message: "Your Order # "+req.body.id+" status updated. Changed from "+req.body.oldStatus+" to "+req.body.newStatus+""
      orderId: req.body.id,
      oldStatus: req.body.oldStatus,
      newStatus: req.body.newStatus,
      readStatus: false
    });


  } catch (error) {
      console.error(error);
      const e = new Error('Error while updating.');
      throw e;
  }
    
}

const postOrderData = async (req, res) => {
    const newOrder = await (await Orders.create(req.body?.data)).populate('products.product')
    const userId = req.body?.data?.customerInfo.userId
    // const deleteCart = await Cart.findOneAndRemove({userId: userId})
    const newOrderId = newOrder?._id
    const paymentId = req?.body?.paymentId
    const deliveryMethod = newOrder?.deliveryMethod
    const paymentMethod = newOrder?.paymentMethod
    const customerId = req?.body?.data?.customerInfo?.userId
    const isGuest = req?.body?.data?.customerInfo?.isGuest
    const firstName = newOrder?.customerInfo?.first_name
    const lastName = newOrder?.customerInfo?.last_name
    const phone = newOrder?.customerInfo?.phone
    const emailTo = newOrder?.customerInfo?.email
    const address = newOrder?.customerInfo?.address
    const totalQuantity = newOrder?.cartTotal?.totalQuantity
    const totalAmount = newOrder?.cartTotal?.total
    const date = new Date(newOrder?.createdAt);
    const orderDate = new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    }).format(date);

    const products = newOrder?.products
    
    const virtualProducts = products.filter(item => item.canBeSubscribed)
    const normalProducts = products.filter(item => !item.canBeSubscribed)

    normalProducts.map(async (item) => {
      const productId = item?.product?._id
      const productQty = parseInt(item?.quantity)

      const updateProductsInfo = await AllProducts.findByIdAndUpdate(
        productId,
        { $inc: {stock: -productQty, sold: productQty} },
        { new: true }
      );
    })

    const amountAfterRemovingVirtualProducts = normalProducts.reduce((acc, current) => {
      return acc + (current.subTotal * 100)
    }, 0)

    if(isGuest){
      await Users.findByIdAndDelete(customerId)
    }



    let data = JSON.stringify({
      "messaging_product": "whatsapp",
      "to": "923463446106",
      "type": "template",
      "template": {
        "name": "mern",
        "language": {
          "code": "en"
        },
        "components": [
          {
            "type": "body",
            "parameters": [
              {
                "type": "text",
                "text": newOrderId
              }
            ]
          }
        ]
      }
    });
    
    let config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: 'https://graph.facebook.com/v15.0/'+WHATSAPP_PHONE_NUMBER_ID+'/messages',
      headers: { 
        'Content-Type': 'application/json', 
        'Authorization': 'Bearer '+WHATSAPP_ACCESS_TOKEN+''
      },
      data : data
    };


    if(paymentMethod == "card") {
      const customer = await stripe.customers.create({
        name: firstName+ " " +lastName,
        email: emailTo,
        payment_method: paymentId,
        phone: phone,
        invoice_settings: { default_payment_method: paymentId },
      });

      const customerId = customer?.id

      if(virtualProducts.length > 0) {
        const mappedProducts = virtualProducts.map(item => {
            return new Promise((resolve, reject) => {
              const res = stripe.products.create({
                name: item.product?.title
              })
              if(res) {
                resolve(res)
              }
              else {
                reject()
              }
            })
            .then((product) => {
              const res = stripe.subscriptions.create({
                customer: customerId,
                items: [
                  {
                    price_data: {
                      currency: "USD",
                      product: product.id,
                      unit_amount: item?.subTotal * 100,
                      recurring: {
                        interval: "month",
                      },
                    },
                  },
                ],
                payment_settings: {
                  payment_method_types: ["card"],
                  save_default_payment_method: "on_subscription",
                },
                // payment_behavior: 'default_incomplete',
                expand: ['latest_invoice.payment_intent'],
              })
              return res 
            })
        }) 
        const productsSubscribed = Promise.all(mappedProducts)
      }

      // const amount = (amountAfterRemovingVirtualProducts) * 100;
      const payment = await stripe.paymentIntents.create({
        customer: customerId,
        amount : amountAfterRemovingVirtualProducts,
        currency: "USD",
        description: "MERN Ecommerce APP",
        payment_method: paymentId,
        confirm: true
      })

      if(payment) {

        axios.request(config)
        .then((response) => {
          console.log(JSON.stringify(response.data));
        })
        .catch((error) => {
          console.log(error);
        });

        res.json({
          message: "Payment successful",
          success: true,
          orderId: newOrderId
        })
      }
    }
    else{
      axios.request(config)
      .then((response) => {
        console.log(JSON.stringify(response.data));
      })
      .catch((error) => {
        console.log(error);
      });

      res.json({
        message: "Order successful",
        success: true,
        orderId: newOrderId
      })
    }













//     let productsHtml = `<head>
//     <!--[if gte mso 15]>
//       <xml>
//         <o:OfficeDocumentSettings>
//           <o:AllowPNG />
//             <o:PixelsPerInch>96</o:PixelsPerInch>
//           </o:OfficeDocumentSettings>
//         </xml>
//     <![endif]-->
//     <meta name="viewport" content="width=device-width">
//     <meta http-equiv="X-UA-Compatible" content="IE=edge">
//     <meta name="x-apple-disable-message-reformatting">
//     <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
//     <!-- Order confirmation email template for Shopify -->
//     <style type="text/css" data-premailer="ignore">
//       /* What it does: Remove spaces around the email design added by some email clients. */
//           /* Beware: It can remove the padding / Margin and add a background color to the compose a reply window. */
//           html, body {
//             Margin: 0 auto !important;
//             padding: 0 !important;
//             width: 100% !important;
//               height: 100% !important;
//           }
//           /* What it does: Stops email clients resizing small text. */
//           * {
//             -ms-text-size-adjust: 100%;
//             -webkit-text-size-adjust: 100%;
//             text-rendering: optimizeLegibility;
//               -webkit-font-smoothing: antialiased;
//               -moz-osx-font-smoothing: grayscale;
//           }
//           /* What it does: Forces Outlook.com to display emails full width. */
//           .ExternalClass {
//             width: 100%;
//           }
//           /* What is does: Centers email on Android 4.4 */
//           div[style*="Margin: 16px 0"] {
//               Margin:0 !important;
//           }
//           /* What it does: Stops Outlook from adding extra spacing to tables. */
//           table,
//           th {
//             mso-table-lspace: 0pt;
//             mso-table-rspace: 0pt;
//           }
//           /* What it does: Fixes Outlook.com line height. */
//           .ExternalClass,
//           .ExternalClass * {
//             line-height: 100% !important;
//           }
//           /* What it does: Fixes webkit padding issue. Fix for Yahoo mail table alignment bug. Applies table-layout to the first 2 tables then removes for anything nested deeper. */
//           table {
//             border-spacing: 0 !important;
//             border-collapse: collapse !important;
//             border: none;
//             Margin: 0 auto;
//           }
//           div[style*="Margin: 16px 0"] {
//               Margin:0 !important;
//           }
//           /* What it does: Uses a better rendering method when resizing images in IE. */
//           img {
//             -ms-interpolation-mode:bicubic;
//           }
//           /* What it does: Overrides styles added when Yahoo's auto-senses a link. */
//           .yshortcuts a {
//             border-bottom: none !important;
//           }
//           /* What it does: Overrides blue, underlined link auto-detected by iOS Mail. */
//           /* Create a class for every link style needed; this template needs only one for the link in the footer. */
//           /* What it does: A work-around for email clients meddling in triggered links. */
//           *[x-apple-data-detectors],  /* iOS */
//           .x-gmail-data-detectors,    /* Gmail */
//           .x-gmail-data-detectors *,
//           .aBn {
//               border-bottom: none !important;
//               cursor: default !important;
//               color: inherit !important;
//               text-decoration: none !important;
//               font-size: inherit !important;
//               font-family: inherit !important;
//               font-weight: inherit !important;
//               line-height: inherit !important;
//           }
      
//           /* What it does: Prevents Gmail from displaying an download button on large, non-linked images. */
//           .a6S {
//               display: none !important;
//               opacity: 0.01 !important;
//           }
//           /* If the above doesn't work, add a .g-img class to any image in question. */
//           img.g-img + div {
//               display:none !important;
//           }
//           /* What it does: Prevents underlining the button text in Windows 10 */
//           a,
//           a:link,
//           a:visited {
//               color: #ecba78;
//               text-decoration: none !important;
//           }
//           .header a {
//               color: #c3c3c3;
//               text-decoration: none;
//               text-underline: none;
//           }
//           .main a {
//               color: #ecba78;
//               text-decoration: none;
//               text-underline: none;
//               word-wrap: break-word;
//           }
//           .main .section.customer_and_shipping_address a,
//           .main .section.shipping_address_and_fulfillment_details a {
//               color: #666363;
//               text-decoration: none;
//               text-underline: none;
//               word-wrap: break-word;
//           }
//           .footer a {
//               color: #ecba78;
//               text-decoration: none;
//               text-underline: none;
//           }
      
//           /* What it does: Overrides styles added images. */
//           img {
//             border: none !important;
//             outline: none !important;
//             text-decoration:none !important;
//           }
//           /* What it does: Fixes fonts for Google WebFonts; */
//           [style*="Karla"] {
//               font-family: 'Karla',-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif !important;
//           }
//           [style*="Karla"] {
//               font-family: 'Karla',-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif !important;
//           }
//           [style*="Karla"] {
//               font-family: 'Karla',-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif !important;
//           }
//           [style*="Playfair Display"] {
//               font-family: 'Playfair Display',Georgia,serif !important;
//           }
//           td.menu_bar_1 a:hover,
//           td.menu_bar_6 a:hover {
//             color: #ecba78 !important;
//           }
//           th.related_product_wrapper.first {
//             border-right: 13px solid #ffffff;
//             padding-right: 6px;
//           }
//           th.related_product_wrapper.last {
//             border-left: 13px solid #ffffff;
//             padding-left: 6px;
//           }
//     </style>
//     <!--[if (mso)|(mso 16)]>
//       <style type="text/css" data-premailer="ignore">
//         a {text-decoration: none;}
//       </style>
//     <![endif]-->
//     <!--[if !mso]><!-->
//   <link href="https://fonts.googleapis.com/css?family=Karla:400,700%7CPlayfair+Display:700,400%7CKarla:700,400%7CKarla:700,700" rel="stylesheet" type="text/css" data-premailer="ignore">
//   <!--<![endif]-->
//       <style type="text/css" data-premailer="ignore">
//         /* Media Queries */
//             /* What it does: Removes right gutter in Gmail iOS app */
//             @media only screen and (min-device-width: 375px) and (max-device-width: 413px) { /* iPhone 6 and 6+ */
//                 .container {
//                     min-width: 375px !important;
//                 }
//             }
//             /* Main media query for responsive styles */
//             @media only screen and (max-width:480px) {
//               /* What it does: Overrides email-container's desktop width and forces it into a 100% fluid width. */
//               .email-container {
//                 width: 100% !important;
//                 min-width: 100% !important;
//               }
//               .section > th {
//                 padding: 13px 26px 13px 26px !important;
//               }
//               .section.divider > th {
//                 padding: 26px 26px !important;
//               }
//               .main .section:first-child > th,
//               .main .section:first-child > td {
//                   padding-top: 26px !important;
//               }
//                 .main .section:nth-last-child(2) > th,
//                 .main .section:nth-last-child(2) > td {
//                     padding-bottom: 52px !important;
//                 }
//               .section.recommended_products > th,
//               .section.discount > th {
//                   padding: 26px 26px !important;
//               }
//               /* What it does: Forces images to resize to the width of their container. */
//               img.fluid,
//               img.fluid-centered {
//                 width: 100% !important;
//                 min-width: 100% !important;
//                 max-width: 100% !important;
//                 height: auto !important;
//                 Margin: auto !important;
//                 box-sizing: border-box;
//               }
//               /* and center justify these ones. */
//               img.fluid-centered {
//                 Margin: auto !important;
//               }
        
//               /* What it does: Forces table cells into full-width rows. */
//               th.stack-column,
//               th.stack-column-left,
//               th.stack-column-center,
//               th.related_product_wrapper,
//               .column_1_of_2,
//               .column_2_of_2 {
//                 display: block !important;
//                 width: 100% !important;
//                 min-width: 100% !important;
//                 direction: ltr !important;
//                 box-sizing: border-box;
//               }
//               /* and left justify these ones. */
//               th.stack-column-left {
//                 text-align: left !important;
//               }
//               /* and center justify these ones. */
//               th.stack-column-center,
//               th.related_product_wrapper {
//                 text-align: center !important;
//                 border-right: none !important;
//                 border-left: none !important;
//               }
//               .column_button,
//               .column_button > table,
//               .column_button > table th {
//                 width: 100% !important;
//                 text-align: center !important;
//                 Margin: 0 !important;
//               }
//               .column_1_of_2 {
//                 padding-bottom: 26px !important;
//               }
//               .column_1_of_2 th {
//                   padding-right: 0 !important;
//               }
//               .column_2_of_2 th {
//                   padding-left:  0 !important;
//               }
//               .column_text_after_button {
//                 padding: 0 13px !important;
//               }
//               /* Adjust product images */
//               th.table-stack {
//                 padding: 0 !important;
//               }
//               th.product-image-wrapper {
//                   padding: 26px 0 13px 0 !important;
//               }
//               img.product-image {
//                     width: 240px !important;
//                     max-width: 240px !important;
//               }
//               tr.row-border-bottom th.product-image-wrapper {
//                 border-bottom: none !important;
//               }
//               th.related_product_wrapper.first,
//               th.related_product_wrapper.last {
//                 padding-right: 0 !important;
//                 padding-left: 0 !important;
//               }
//               .text_banner th.banner_container {
//                 padding: 13px !important;
//               }
//               .mobile_app_download .column_1_of_2 .image_container {
//                 padding-bottom: 0 !important;
//               }
//               .mobile_app_download .column_2_of_2 .image_container {
//                 padding-top: 0 !important;
//               }
//             }
//       </style>
//       <style type="text/css" data-premailer="ignore">
//         /* Custom Media Queries */
//           @media only screen and (max-width:480px) {
//             .column_logo {
//                 display: block !important;
//                 width: 100% !important;
//                 min-width: 100% !important;
//                 direction: ltr !important;
//                 text-align: center !important;
//             }
//             p,
//             .column_1_of_2 th p,
//             .column_2_of_2 th p,
//             .order_notes *,
//             .invoice_link * {
//                 text-align: center !important;
//             }
//             .line-item-description p {
//                 text-align: left !important;
//             }
//             .line-item-price p,
//             .line-item-qty p,
//             .line-item-line-price p {
//               text-align: right !important;
//             }
//             h1, h2, h3,
//             .column_1_of_2 th,
//             .column_2_of_2 th {
//                 text-align: center !important;
//             }
//             td.order-table-title {
//               text-align: center !important;
//             }
//             .footer .column_1_of_2 {
//                 border-right: 0 !important;
//                 border-bottom: 0 !important;
//             }
//             .footer .section_wrapper_th {
//               padding: 0 17px;
//             }
//           }
//       </style>
//     </head>
//     <body class="body" id="body" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0" bgcolor="#ecba78" style="-webkit-text-size-adjust: none; -ms-text-size-adjust: none; margin: 0; padding: 0;">
//       <!--[if !mso 9]><!-->
//         <div style="display: none; overflow: hidden; line-height: 1px; max-height: 0px; max-width: 0px; opacity: 0; mso-hide: all;">
//           We've got your order! Your world is about to look a whole lot better.We'll drop you another email when your order ships.
//         </div>
//       <!--<![endif]-->
//         <!-- BEGIN: CONTAINER -->
//         <table class="container container_full" cellpadding="0" cellspacing="0" border="0" width="100%" style="border-collapse: collapse; min-width: 100%;" role="presentation" bgcolor="#ecba78">
//           <tbody>
//             <tr>
//               <th valign="top" style="mso-line-height-rule: exactly;">
//                 <center style="width: 100%;">
//                   <table border="0" width="600" cellpadding="0" cellspacing="0" align="center" style="width: 600px; min-width: 600px; max-width: 600px; margin: auto;" class="email-container" role="presentation">
//                     <tbody><tr>
//                       <th valign="top" style="mso-line-height-rule: exactly;">
//                         <!-- BEGIN : SECTION : HEADER -->
//                         <table class="section_wrapper header" data-id="header" id="section-header" border="0" width="100%" cellpadding="0" cellspacing="0" align="center" style="min-width: 100%;" role="presentation" bgcolor="#ffffff">
//                           <tbody><tr>
//                             <td class="section_wrapper_th" style="mso-line-height-rule: exactly; padding-top: 52px; padding-bottom: 26px;" bgcolor="#ffffff">
//                               <table border="0" width="100%" cellpadding="0" cellspacing="0" align="center" style="min-width: 100%;" role="presentation">
//                                 <tbody><tr>
//                                   <th class="column_logo" style="mso-line-height-rule: exactly; padding-top: 13px; padding-bottom: 13px;" align="center" bgcolor="#ffffff">
//                                     <!-- Logo : BEGIN -->
//                                     <a href="https://us.tens.co/tools/emails/click/order-confirmation/1/logo/link?url=https%3A%2F%2Fus.tens.co" target="_blank" style="color: #c3c3c3; text-decoration: none !important; text-underline: none;">
//                                       <img src="https://d1oo2t5460ftwl.cloudfront.net/api/file/XYXyqUiJSciMOcMhTwc0/convert?fit=max&amp;w=192" class="logo " width="96" border="0" style="width: 96px; height: auto !important; display: block; text-align: center; margin: auto;">
//                                     </a>
//                                     <!-- Logo : END -->
//                                   </th>
//                                 </tr>
//                               </tbody></table>
//                             </td>
//                           </tr>
//                         </tbody></table>
//                         <!-- END : SECTION : HEADER -->
//                         <!-- BEGIN : SECTION : MAIN -->
//                         <table class="section_wrapper main" data-id="main" id="section-main" border="0" width="100%" cellpadding="0" cellspacing="0" align="center" style="min-width: 100%;" role="presentation" bgcolor="#ffffff">
//                           <tbody><tr>
//                             <td class="section_wrapper_th" style="mso-line-height-rule: exactly;" bgcolor="#ffffff">
//                               <table border="0" width="100%" cellpadding="0" cellspacing="0" align="center" style="min-width: 100%;" id="mixContainer" role="presentation">
//                                 <!-- BEGIN SECTION: Heading -->
//                                 <tbody><tr id="section-1468266" class="section heading">
//                                   <th style="mso-line-height-rule: exactly; color: #4b4b4b; padding: 26px 52px 13px;" bgcolor="#ffffff">
//                                     <table cellspacing="0" cellpadding="0" border="0" width="100%" role="presentation" style="color: #4b4b4b;" bgcolor="#ffffff">
//                                       <tbody><tr style="color: #4b4b4b;" bgcolor="#ffffff">
//                                         <th style="mso-line-height-rule: exactly; color: #4b4b4b;" bgcolor="#ffffff" valign="top">
//                                           <h1 data-key="1468266_heading" style="font-family: Georgia,serif,'Playfair Display'; font-size: 28px; line-height: 46px; font-weight: 700; color: #4b4b4b; text-transform: none; background-color: #ffffff; margin: 0;">Order Confirmation</h1>
//                                         </th>
//                                       </tr>
//                                     </tbody></table>
//                                   </th>
//                                 </tr>
//                                 <!-- END SECTION: Heading -->
//                                 <!-- BEGIN SECTION: Introduction -->
//                                 <tr id="section-1468267" class="section introduction">
//                                   <th style="mso-line-height-rule: exactly; padding: 13px 52px;" bgcolor="#ffffff">
                                    
//                                       <p style="mso-line-height-rule: exactly; font-family: -apple-system,BlinkMacSystemFont,'Segoe UI',Arial,'Karla'; font-size: 16px; line-height: 26px; font-weight: 400; color: #666363; margin: 0 0 13px;" align="center">
//                                         <span data-key="1468267_greeting_text" style="text-align: center; font-family: -apple-system,BlinkMacSystemFont,'Segoe UI',Arial,'Karla'; font-size: 16px; line-height: 26px; font-weight: 400; color: #666363;">
//                                           Hey
//                                         </span>
//                                         ${firstName} ${lastName},
//                                       </p>
                                    
                                    
//                                     <p data-key="1468267_introduction_text" class="text" style="mso-line-height-rule: exactly; font-family: -apple-system,BlinkMacSystemFont,'Segoe UI',Arial,'Karla'; font-size: 16px; line-height: 26px; font-weight: 400; color: #666363; margin: 13px 0;" align="center">
//                                     </p>
//                                     <p style="mso-line-height-rule: exactly; font-family: -apple-system,BlinkMacSystemFont,'Segoe UI',Arial,'Karla'; font-size: 16px; line-height: 26px; font-weight: 400; color: #666363; margin: 13px 0;" align="center">We've got your order! Your world is about to look a whole lot better.</p>
//                                     <p style="mso-line-height-rule: exactly; font-family: -apple-system,BlinkMacSystemFont,'Segoe UI',Arial,'Karla'; font-size: 16px; line-height: 26px; font-weight: 400; color: #666363; margin: 13px 0;" align="center">We'll drop you another email when your order ships.</p>
//                                   </th>
//                                 </tr>
//                                 <!-- END SECTION: Introduction -->
//                                 <!-- BEGIN SECTION: Order Number And Date -->
//                                 <tr id="section-1468270" class="section order_number_and_date">
//                                   <th style="mso-line-height-rule: exactly; padding: 13px 52px;" bgcolor="#ffffff">
//                                     <h2 style="font-family: -apple-system,BlinkMacSystemFont,'Segoe UI',Arial,'Karla'; color: #4b4b4b; font-size: 20px; line-height: 26px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; margin: 0;" align="center">
//                                       <span data-key="1468270_order_number">Order No.</span> ${newOrderId}
//                                     </h2>
//                                     <p class="muted" style="mso-line-height-rule: exactly; font-family: -apple-system,BlinkMacSystemFont,'Segoe UI',Arial,'Karla'; font-size: 14px; line-height: 26px; font-weight: normal; color: #bdbdbd; margin: 0;" align="center">${orderDate}</p>
//                                   </th>
//                                 </tr>
//                                 <!-- END SECTION: Order Number And Date -->
//                                 <!-- BEGIN SECTION: Products With Pricing -->
//                                 <tr id="section-1468271" class="section products_with_pricing">
                                  
//                                     <!-- Bold 1 -->
                                    
                                    
                                    
//                                     <!-- end Bold 1 -->
//                                     <th style="mso-line-height-rule: exactly; padding: 13px 52px;" bgcolor="#ffffff">
//                                       <table class="table-inner" cellspacing="0" cellpadding="0" border="0" width="100%" style="min-width: 100%;" role="presentation">
//                                         <tbody><tr>
//                                           <th class="product-table" style="mso-line-height-rule: exactly;" bgcolor="#ffffff" valign="top">
//                                             <table cellspacing="0" cellpadding="0" border="0" width="100%" style="min-width: 100%;" role="presentation">
//                                               <tbody><tr>
//                                                 <th colspan="2" class="product-table-h3-wrapper" style="mso-line-height-rule: exactly;" bgcolor="#ffffff" valign="top">
//                                                   <h3 data-key="1468271_item" style="font-family: -apple-system,BlinkMacSystemFont,'Segoe UI',Arial,'Karla'; color: #bdbdbd; font-size: 16px; line-height: 52px; font-weight: 700; text-transform: uppercase; border-bottom-width: 2px; border-bottom-color: #dadada; border-bottom-style: solid; letter-spacing: 1px; margin: 0;" align="left">Items ordered</h3>
//                                                 </th>
//                                               </tr>
                                              
//                                                 <!-- Bold 2 -->
                                                
                                                
                                                
                                                
//                                                 <!-- end Bold 2 -->
//                                                 ${products.map((item) => {
//                                                   return `
                                                  
//                                                   <tr class="row-border-bottom">
//                                                   <th class="table-stack product-image-wrapper stack-column-center" width="1" style="mso-line-height-rule: exactly; border-bottom-width: 2px; border-bottom-color: #dadada; border-bottom-style: solid; padding: 13px 13px 13px 0;" bgcolor="#ffffff" valign="middle">
// <img width="140" class="product-image" src="${item?.product?.thumbnail}" alt="Product Image" style="vertical-align: middle; text-align: center; width: 140px; max-width: 140px; height: auto !important; border-radius: 1px; padding: 0px;">
//                                                     </th>
//                                                   <th class="product-details-wrapper table-stack stack-column" style="mso-line-height-rule: exactly; padding-top: 13px; padding-bottom: 13px; border-bottom-width: 2px; border-bottom-color: #dadada; border-bottom-style: solid;" bgcolor="#ffffff" valign="middle">
//                                                     <table cellspacing="0" cellpadding="0" border="0" width="100%" style="min-width: 100%;" role="presentation">
//                                                       <tbody><tr>
                                                        
//                                                         <th class="line-item-description" style="mso-line-height-rule: exactly; font-family: -apple-system,BlinkMacSystemFont,'Segoe UI',Arial,'Karla'; font-size: 16px; line-height: 26px; font-weight: 400; color: #666363; padding: 13px 6px 13px 0;" align="left" bgcolor="#ffffff" valign="top">
//                                                           <p style="mso-line-height-rule: exactly; font-family: -apple-system,BlinkMacSystemFont,'Segoe UI',Arial,'Karla'; font-size: 16px; line-height: 26px; font-weight: 400; color: #666363; margin: 0;" align="left">
//                                                             <a href="#" target="_blank" style="color: #666363; text-decoration: none !important; text-underline: none; word-wrap: break-word; text-align: left !important; font-weight: bold;">
//                                                               ${item?.product?.title}
//                                                             </a>
//                                                             <br>
//                                                             </p>
//                                                           </th>
                                                          
//                                                             <th style="mso-line-height-rule: exactly;" bgcolor="#ffffff" valign="top"></th>
                                                          
//                                                           <th class="right line-item-qty" width="1" style="mso-line-height-rule: exactly; white-space: nowrap; padding: 13px 0 13px 13px;" align="right" bgcolor="#ffffff" valign="top">
//                                                             <p style="mso-line-height-rule: exactly; font-family: -apple-system,BlinkMacSystemFont,'Segoe UI',Arial,'Karla'; font-size: 16px; line-height: 26px; font-weight: 400; color: #666363; margin: 0;" align="right">
//                                                               ×&nbsp;${item?.quantity}
//                                                             </p>
//                                                           </th>
//                                                           <th class="right line-item-line-price" width="1" style="mso-line-height-rule: exactly; white-space: nowrap; padding: 13px 0 13px 26px;" align="right" bgcolor="#ffffff" valign="top">
//                                                             <p style="mso-line-height-rule: exactly; font-family: -apple-system,BlinkMacSystemFont,'Segoe UI',Arial,'Karla'; font-size: 16px; line-height: 26px; font-weight: 400; color: #666363; margin: 0;" align="right">
//                                                               $${item.subTotal}
//                                                               </p>
//                                                               </th>
//                                                             </tr>
//                                                           </tbody></table>
//                                                         </th>
//                                                       </tr>
                                                      
//                                                         <tr>
//                                                           <th colspan="2" class="product-empty-row" style="mso-line-height-rule: exactly;" bgcolor="#ffffff" valign="top"></th>
//                                                         </tr>
//                                                   `
//                                                 })}
//                                                 </tbody></table>
//                                             </th>
//                                           </tr>
//                                           <tr>
//                                             <th class="pricing-table" style="mso-line-height-rule: exactly; padding: 13px 0;" bgcolor="#ffffff" valign="top">
//                                               <table cellspacing="0" cellpadding="0" border="0" width="100%" style="min-width: 100%;" role="presentation">
                                                
//                                                   <tbody>
                                                  
                                                  
//                                                   <tr class="pricing-table-total-row">
//                                                     <th class="table-title" data-key="1468271_total" style="mso-line-height-rule: exactly; font-family: -apple-system,BlinkMacSystemFont,'Segoe UI',Arial,'Karla'; font-size: 16px; line-height: 26px; font-weight: bold; color: #666363; width: 65%; padding: 6px 0;" align="left" bgcolor="#ffffff" valign="top">Total Quantity</th>
//                                                     <th class="table-text" style="mso-line-height-rule: exactly; font-family: -apple-system,BlinkMacSystemFont,'Segoe UI',Arial,'Karla'; font-size: 16px; line-height: 26px; font-weight: 400; color: #666363; width: 35%; padding: 6px 0;" align="right" bgcolor="#ffffff" valign="middle">×&nbsp;${totalQuantity}</th>
//                                                   </tr>
//                                                   <tr class="pricing-table-total-row">
//                                                     <th class="table-title" data-key="1468271_total" style="mso-line-height-rule: exactly; font-family: -apple-system,BlinkMacSystemFont,'Segoe UI',Arial,'Karla'; font-size: 16px; line-height: 26px; font-weight: bold; color: #666363; width: 65%; padding: 6px 0;" align="left" bgcolor="#ffffff" valign="top">Total Amount</th>
//                                                     <th class="table-text" style="mso-line-height-rule: exactly; font-family: -apple-system,BlinkMacSystemFont,'Segoe UI',Arial,'Karla'; font-size: 16px; line-height: 26px; font-weight: 400; color: #666363; width: 35%; padding: 6px 0;" align="right" bgcolor="#ffffff" valign="middle">$${totalAmount}</th>
//                                                   </tr>
                                                  
                                                  
                                                  
                                                  
                                                  
//                                                 </tbody></table>
//                                               </th>
//                                             </tr>
//                                           </tbody></table>
//                                         </th>
                                      
//                                     </tr>
//                                     <!-- END SECTION: Products With Pricing -->
//                                     <!-- BEGIN SECTION: Payment Info -->
//                                     <tr id="section-1468272" class="section payment_info">
//                                       <th style="mso-line-height-rule: exactly; padding: 13px 52px;" bgcolor="#ffffff">
//                                         <table class="table-inner" cellspacing="0" cellpadding="0" border="0" width="100%" style="min-width: 100%;" role="presentation">
//                                           <!-- PAYMENT INFO -->
                                          
                                          
                                          
                                            
                                            
                                          
                                          
//                                             <tbody><tr>
//                                               <th colspan="2" style="mso-line-height-rule: exactly;" bgcolor="#ffffff" valign="top">
//                                                 <h3 data-key="1468272_payment_info" style="font-family: -apple-system,BlinkMacSystemFont,'Segoe UI',Arial,'Karla'; color: #bdbdbd; font-size: 16px; line-height: 52px; font-weight: 700; text-transform: uppercase; border-bottom-width: 0; border-bottom-color: #dadada; border-bottom-style: solid; letter-spacing: 1px; margin: 0;" align="left">Payment and Delivery Method Info</h3>
//                                               </th>
//                                             </tr>
                                            
                                              
                                              
                                              
                                              
                                              
                                              
                                              
//                                                         <!-- PAYMENT METHOD IMAGE -->
                                                        
                                                        
                                                        
//                                                         <tr class="pricing-table-total-row">
//                                                         <th class="table-title" data-key="1468271_total" style="mso-line-height-rule: exactly; font-family: -apple-system,BlinkMacSystemFont,'Segoe UI',Arial,'Karla'; font-size: 16px; line-height: 26px; font-weight: bold; color: #666363; width: 65%; padding: 6px 0;" align="left" bgcolor="#ffffff" valign="top">Delivery Method</th>
//                                                         <th class="table-text" style="mso-line-height-rule: exactly; font-family: -apple-system,BlinkMacSystemFont,'Segoe UI',Arial,'Karla'; font-size: 16px; line-height: 26px; font-weight: 400; color: #666363; width: 35%; padding: 6px 0;" align="right" bgcolor="#ffffff" valign="middle">${deliveryMethod == "self" ? "Self-pickup from the store" : deliveryMethod == "us" ? "US Shipping" : deliveryMethod == "worldwide" ? "Worldwide Shipping" : ""}</th>
//                                                       </tr>

//                                                       <tr class="pricing-table-total-row">
//                                                         <th class="table-title" data-key="1468271_total" style="mso-line-height-rule: exactly; font-family: -apple-system,BlinkMacSystemFont,'Segoe UI',Arial,'Karla'; font-size: 16px; line-height: 26px; font-weight: bold; color: #666363; width: 65%; padding: 6px 0;" align="left" bgcolor="#ffffff" valign="top">Payment Method</th>
//                                                         <th class="table-text" style="mso-line-height-rule: exactly; font-family: -apple-system,BlinkMacSystemFont,'Segoe UI',Arial,'Karla'; font-size: 16px; line-height: 26px; font-weight: 400; color: #666363; width: 35%; padding: 6px 0;" align="right" bgcolor="#ffffff" valign="middle">${paymentMethod == "cod" ? "Cash On Delivery" : "Card"}</th>
//                                                       </tr>
                                                        
                                                      
//                                                     </tbody></table>
//                                                   </th>
//                                                 </tr>
//                                                 <!-- END SECTION: Payment Info -->
//                                                 <!-- BEGIN SECTION: Customer And Shipping Address -->
//                                                 <tr id="section-1468273" class="section customer_and_shipping_address">
//                                                   <!-- BEGIN : 2 COLUMNS : BILL_TO -->
//                                                   <th style="mso-line-height-rule: exactly; padding: 13px 52px;" bgcolor="#ffffff">
//                                                     <table border="0" width="100%" cellpadding="0" cellspacing="0" align="center" style="min-width: 100%;" role="presentation">
//                                                       <tbody><tr>
                                                        
//                                                         <!-- BEGIN : Column 2 of 2 : SHIP_TO -->
//                                                         <th width="50%" class="column_2_of_2 column_ship_to " style="mso-line-height-rule: exactly;" align="right" bgcolor="#ffffff" valign="top">
//                                                           <table align="center" border="0" width="100%" cellpadding="0" cellspacing="0" style="min-width: 100%;" role="presentation">
                                                            
//                                                               <tbody><tr>
//                                                                 <th style="mso-line-height-rule: exactly; padding-left: 5%;" align="right" bgcolor="#ffffff" valign="top">
//                                                                   <h3 data-key="1468273_ship_to" style="font-family: -apple-system,BlinkMacSystemFont,'Segoe UI',Arial,'Karla'; color: #bdbdbd; font-size: 16px; line-height: 52px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; margin: 0;" align="right">Shipping Address</h3>
//                                                                 </th>
//                                                               </tr>
                                                            
//                                                             <tr>
//                                                               <th class="shipping_address " style="mso-line-height-rule: exactly; padding-left: 5%;" align="right" bgcolor="#ffffff" valign="top">
//                                                                 <p style="mso-line-height-rule: exactly; font-family: -apple-system,BlinkMacSystemFont,'Segoe UI',Arial,'Karla'; font-size: 16px; line-height: 26px; font-weight: 400; color: #666363; margin: 0;" align="right">${firstName} ${lastName}<br>
//                                                                     ${address}
                                                                 
//                                                                     </p>
//                                                               </th>
//                                                             </tr>
//                                                           </tbody></table>
//                                                         </th>
//                                                         <!-- END : Column 2 of 2 : SHIP_TO -->
//                                                       </tr>
//                                                     </tbody></table>
//                                                   </th>
//                                                   <!-- END : 2 COLUMNS : SHIP_TO -->
//                                                 </tr>
//                                                 <!-- END SECTION: Customer And Shipping Address -->
//                                                 <!-- BEGIN SECTION: Divider -->
//                                                 <tr id="section-1468275" class="section divider">
//                                                   <th style="mso-line-height-rule: exactly; padding: 26px 52px;" bgcolor="#ffffff">
//                                                     <table cellspacing="0" cellpadding="0" border="0" width="100%" role="presentation">
//                                                       <tbody><tr>
//                                                         <th style="mso-line-height-rule: exactly; border-top-width: 2px; border-top-color: #dadada; border-top-style: solid;" bgcolor="#ffffff" valign="top">
//                                                         </th>
//                                                       </tr>
//                                                     </tbody></table>
//                                                   </th>
//                                                 </tr>
//                                                 <!-- END SECTION: Divider -->
//                                                 <!-- BEGIN SECTION: Closing Text -->
//                                                 <tr id="section-1468276" class="section closing_text">
//                                                   <th data-key="1468276_closing_text" class="text" style="mso-line-height-rule: exactly; font-family: -apple-system,BlinkMacSystemFont,'Segoe UI',Arial,'Karla'; font-size: 16px; line-height: 26px; font-weight: 400; color: #666363; padding: 13px 52px 52px;" align="center" bgcolor="#ffffff">
//                                                     <p style="mso-line-height-rule: exactly; font-family: -apple-system,BlinkMacSystemFont,'Segoe UI',Arial,'Karla'; font-size: 16px; line-height: 26px; font-weight: 400; color: #666363; margin: 0;" align="center">If you need help with anything please don't hesitate to drop us an email: care@tens.co :)</p>
//                                                   </th>
//                                                 </tr>
//                                                 <!-- END SECTION: Closing Text -->
                                                
//                                               </tbody></table>
//                                             </td>
//                                           </tr>
//                                         </tbody></table>
//                                         <!-- END : SECTION : MAIN -->
//                                         <!-- BEGIN : SECTION : FOOTER -->
                                        
//                                         <!-- END : SECTION : FOOTER -->
//                                       </th>
//                                     </tr>
//                                   </tbody></table>
//                                 </center>
//                               </th>
//                             </tr>
//                           </tbody>
//                         </table>
//                         <!-- END : CONTAINER -->           
//                       </body>`;

//     //  create reusable transporter object using the default SMTP transport
//     let transporter = nodemailer.createTransport({
//         service: "gmail",
//         auth: {
//             user: "fareeboy12@gmail.com",
//             pass: "mfjolmpsqjahecwx",
//         },
//     });

  
//     // send mail with defined transport object
//     await transporter.sendMail({
//         from: 'fareeboy12@gmail.com', // sender address
//         to: emailTo, // list of receivers
//         subject: "Thank you! Your order is confirmed.", // Subject line
//         // text: "Hello world?", // plain text body
//         html: productsHtml,
//     });


    


    // res.status(201).json({orderId: newOrderId})
}

const paymentIntent = async (req, res) => {
    try {
        const paymentIntent = await stripe.paymentIntents.create({
          currency: "USD",
          amount: 1999,
        //   automatic_payment_methods: { enabled: false },
          payment_method_types: [
            'card',
          ],
        });

        // const element = stripe.elements()
        // const client_secret = paymentIntent.client_secret
        // element.create()
    
        // Send publishable key and PaymentIntent details to client
        res.send({
          clientSecret: paymentIntent.client_secret,
        });
      } catch (e) {
        return res.status(400).send({
          error: {
            message: e.message,
          },
        });
      }
}

module.exports = { getOrders, getOrderById, postOrderData, stripeKey, paymentIntent, getAllOrders, updateOrderStatus }