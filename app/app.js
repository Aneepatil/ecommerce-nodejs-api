import express from "express";
import dotenv from "dotenv";
import Stripe from "stripe";
import cors from 'cors'
dotenv.config();
import { dbConnect } from "../configs/dbConnect.js";
import userRoutes from "../routes/userRoute/userRoute.js";
import {
  globleErrorHandler,
  notFound,
} from "../middlewares/globleErrorHandler.js";
import productRoutes from "../routes/productRoute/productRoute.js";
import categoryRoutes from "../routes/categoriesRoute/categoriesRoute.js";
import brandRoutes from "../routes/brandRoute/brandRoute.js";
import colorRoutes from "../routes/colorRoute/colorRoute.js";
import reviewRoutes from "../routes/review/reviewRoute.js";
import orderRoutes from "../routes/orderRoute/orderRouter.js";
import { Order } from "../models/Order/Order.js";
import cuponRoutes from "../routes/cuoponRoute/cuoponRoute.js";
// DB Connection
dbConnect();
export const app = express();

//cors
app.use(cors());


// Stripe webho👌
// The library needs to be configured with your account's secret key.
// Ensure the key is kept out of any version control system you might be using.
// Stripe Instance
const stripe = new Stripe(process.env.STRIPE_KEY);

// This is your Stripe CLI webhook secret for testing your endpoint locally.
const endpointSecret =
  "whsec_64fd82b7028ca71745475954bfd257a85d579891eecd886e1327461f97b90f4f";

app.post("/webhook", express.raw({ type: "application/json" }), async(req, red) => {
  const sig = req.headers["stripe-signature"];

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);

    // Handle the event
    switch (event.type) {
      case "checkout.session.completed":
        const session = event.data.object;
        const { orderId } = session.metadata;
        const paymentStatus = session.payment_status;  
        const paymentMethod = session.payment_method_types[0];  
        const totalAmount = session.amount_total;  
        const currency = session.currency;  

        // find the Order
        const order = await Order.findByIdAndUpdate(JSON.parse(orderId),{
            totalPrice:totalAmount/100,
            currency,paymentMethod,paymentStatus
        },{new:true})

        // console.log(order)
        // Then define and call a function to handle the event payment_intent.succeeded
        break;
      // ... handle other event types
      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    // Return a 200 red to acknowledge receipt of the event
    red.send();
  } catch (err) {
    console.log("Error====>", err.message);
    red.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }
});

// pass incoming data
app.use(express.json());

// Routes
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/products", productRoutes);
app.use("/api/v1/categories", categoryRoutes);
app.use("/api/v1/brands", brandRoutes);
app.use("/api/v1/colors", colorRoutes);
app.use("/api/v1/reviews", reviewRoutes);
app.use("/api/v1/orders", orderRoutes);
app.use("/api/v1/cupons", cuponRoutes);

// Error Middleware
app.use(notFound);
app.use(globleErrorHandler);
