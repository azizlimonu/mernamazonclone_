const express = require('express');
const router = express.Router();
const expressAsyncHandler = require('express-async-handler');
const Order = require('../models/orderModel');
const User = require('../models/userModel');
const Product = require('../models/productModel');
const { isAdmin } = require('../utils/isAdmin');
const { isAuth } = require('../utils/isAuth');
const { mailgun } = require('../utils/mailgun');
const { payOrderEmailTemplate } = require('../utils/payOrderEmailTemplate');

// router for orders
router.get('/', isAuth, isAdmin, expressAsyncHandler(async (req, res) => {
  const orders = await Order.find().populate('user', 'name');
  res.send(orders);
}));

// order for update delivered product
router.put('/:id/deliver', isAuth, expressAsyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (order) {
    order.isDelivered = true;
    order.deliveredAt = Date.now();
    await order.save();
    res.send({ message: 'Order Delivered' });
  } else {
    res.status(404).send({ message: 'Order Not Found' });
  }
}));

// router for delete order
router.delete('/:id', isAuth, isAdmin, expressAsyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (order) {
    await order.remove();
    res.send({ message: 'Order has been deleted' });
  } else {
    res.status(404).send({ message: 'Order Not Found' });
  }
}));

// router for create an order
router.post('/', isAuth, expressAsyncHandler(async (req, res) => {
  const newOrder = new Order({
    orderItems: req.body.orderItems.map((x) => ({ ...x, product: x._id})),
    shippingAddress: req.body.shippingAddress,
    paymentMethod: req.body.paymentMethod,
    itemsPrice: req.body.itemsPrice,
    shippingPrice: req.body.shippingPrice,
    taxPrice: req.body.taxPrice,
    totalPrice: req.body.totalPrice,
    user: req.user._id,
  });

  const order = await newOrder.save();
  res.status(201).send({ message: "New Order Created", order });
}));

// router for admin to know summary of the orders
router.get('/summary', isAuth, isAdmin, expressAsyncHandler(async (req, res) => {
  const orders = await Order.aggregate([
    {
      $group: {
        _id: null,
        numOrders: { $sum: 1 },
        totalSales: { $sum: '$totalPrice' },
      },
    },
  ]);

  const users = await User.aggregate([
    {
      $group: {
        _id: null,
        numUsers: { $sum: 1 },
      },
    },
  ]);

  const dailyOrders = await Order.aggregate([
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
        orders: { $sum: 1 },
        sales: { $sum: '$totalPrice' },
      },
    },
  ]);

  const productCategories = await Product.aggregate([
    {
      $group: {
        _id: '$category',
        count: { $sum: 1 },
      },
    },
  ]);

  res.send({ users, orders, dailyOrders, productCategories });
}));

router.get('/:id', isAuth, expressAsyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (order) {
    res.send(order);
  } else {
    res.status(404).send({ message: 'Order Not Found' });
  }
}));

router.put('/:id/pay', isAuth, expressAsyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate(
    'user',
    'email name'
  );
  if (order) {
    order.isPaid = true;
    order.paidAt = Date.now();
    order.paymentResult = {
      id: req.body.id,
      status: req.body.status,
      update_time: req.body.update_time,
      email_address: req.body.email_address,
    };
    const updatedOrder = await order.save();
    mailgun()
      .messages()
      .send(
        {
          from: 'Amazona <amazona@mg.yourdomain.com>',
          to: `${order.user.name} <${order.user.email}>`,
          subject: `New order ${order._id}`,
          html: payOrderEmailTemplate(order),
        },
        (error, body) => {
          if (error) {
            console.log(error);
          } else {
            console.log(body);
          }
        }
      );
    res.send({ message: "order Paid", order: updatedOrder });
  } else {
    res.status(404).send({ message: 'Order Not Found' });
  }
}));

router.get('/:id/mine', isAuth, expressAsyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id });
  res.send(orders);
}));

module.exports = router;