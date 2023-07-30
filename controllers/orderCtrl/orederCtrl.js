import asyncHandler from "express-async-handler";
import Stripe from "stripe";
import dotenv from "dotenv";
import { User } from "../../models/User/User.js";
import { Order } from "../../models/Order/Order.js";
import Product from "../../models/Product/Product.js";
import Coupon from "../../models/Cupon/Cupon.js";
dotenv.config();
// @desk Create Order
// @route POST api/v1/orders
// @access Private

// Stripe Instance
const stripe = new Stripe(process.env.STRIPE_KEY);
export const createOrder = asyncHandler(async (req, res) => {
  // Get the payload ( Customer, ShippingAddress, OrderItem, Total Price )
  const { orderItems, shippingAddress, totalPrice } = req.body;

  // Find the coupon

  const { coupon } = req?.query;

  const foundCoupon = await Coupon.findOne({ code: coupon?.toUpperCase() });

  //  Varify the coupon existance and expiration

  if (!foundCoupon) {
    throw new Error(" Coupon does not exist.");
  }

  if (foundCoupon?.isExpired) {
    throw new Error(" Coupon has Expired.");
  }

  // Find the discount

  const discount = foundCoupon?.discount / 100;

  // Find the User
  const user = await User.findById(req.userAuthId);

  //   Checking if user has shipping address

  if (!user.hasShippingAddress) {
    throw new Error("Please provide shipping address.");
  }

  // Check if the order is not empty
  if (orderItems?.length <= 0) {
    throw new Error("No Order Items");
  }
  // Place / Create Order -- Save into DB

  const order = await Order.create({
    user: user?._id,
    orderItems,
    shippingAddress,
    totalPrice: foundCoupon ? totalPrice - totalPrice * discount : totalPrice,
  });

  // Update the Product Quantity
  const products = await Product.find({ _id: { $in: orderItems } });

  orderItems?.map(async (orderItem) => {
    const product = products?.find((product) => {
      return product?._id?.toString() === orderItem?._id.toString();
    });

    product.totalSold += orderItem.totalQtyBuying;

    await product.save();
  });

  // Push Order into User
  user.orders.push(order._id);
  await user.save();

  // Make Payment (Stripe)

  // Convert order items to have same structure that stripe need

  const convertedOrders = orderItems.map((orderItem) => {
    return {
      price_data: {
        currency: "inr",
        product_data: {
          name: orderItem?.name,
          description: orderItem?.description,
        },
        unit_amount: orderItem?.price * 100,
      },
      quantity: orderItem?.totalQtyBuying,
    };
  });

  const session = await stripe.checkout.sessions.create({
    line_items: convertedOrders,
    metadata: {
      orderId: JSON.stringify(order?._id),
    },
    mode: "payment",
    success_url: "http://loclhost:3000/success",
    cancel_url: "http://loclhost:3000/success",
  });

  res.send({ url: session.url });
  // Payment Webhook
  // Update the user order
  res.json({
    success: true,
    message: "Order Created",
    order,
    user,
  });
});

// @desk Get All Orders
// @route GET api/v1/orders
// @access Private

export const getAllOrders = asyncHandler(async (req, res) => {
  // Fidn all orders
  const orders = await Order.find();

  res.json({
    message: "All orders fetched successfully.",
    orders,
  });
});

// @desk Get Single Order
// @route GET api/v1/orders/:id
// @access Private

export const getSingleOrder = asyncHandler(async (req, res) => {
  // Fidn all orders
  const order = await Order.findById(req.params.id);

  res.json({
    message: "Order fetched successfully.",
    order,
  });
});

// @desk Get Update Order
// @route GET api/v1/orders/:id
// @access Private

export const updateOrder = asyncHandler(async (req, res) => {
  const id = req.params.id;
  // Fidn all orders
  const updatedOrder = await Order.findByIdAndUpdate(
    id,
    {
      status: req.body.status,
    },
    { new: true }
  );

  res.json({
    message: "Order Updated Successfully.",
    updatedOrder,
  });
});

// @desk Get Sales of sum of all orders
// @route GET api/v1/orders/sales/sum
// @access Private/Admin

export const getSalesSum = asyncHandler(async (req, res) => {
  // Get the statestics of sale
  const orderStatestics = await Order.aggregate([
    {
      $group: {
        _id: null,
        totalSale: {
          $sum: "$totalPrice",
        },
        minimumSale: {
          $min: "$totalPrice",
        },
        maximumSale: {
          $max: "$totalPrice",
        },
        avarageSale: {
          $avg: "$totalPrice",
        },
      },
    },
  ]);

  // Get the date

  const date = new Date();
  const todya = new Date(date.getFullYear(), date.getMonth(), date.getDate());

  //  Get the todays sale

  const saleToday = await Order.aggregate([
    {
      $match: {
        createdAt: {
          $gte: todya,
        },
      },
    },
    {
      $group: {
        _id: null,
        totalSale: {
          $sum: "$totalPrice",
        },
      },
    },
  ]);
  res.json({
    status: "true",
    message: "Get Sales Sum Of Orders",
    orderStatestics,
    saleToday,
  });
});
