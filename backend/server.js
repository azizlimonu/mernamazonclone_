require('dotenv').config();
const mongoose = require('mongoose');
const express = require("express");
// const data = require('./data.js');
const cors = require('cors');

const app = express();

// routes
const seedRouter = require('./routes/seedRoutes');
const productRouter = require('./routes/productRoutes');
const userRouter = require('./routes/userRoutes');
const orderRouter= require('./routes/orderRoutes');

const corsOptions = {
  origin: ['http://localhost:3000'],
};

mongoose.set('strictQuery', true);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => { console.log('connected to mongoDB') })
  .catch((error) => console.log('connecting failed', error.message));

app.use(cors(corsOptions));

// paypal
app.get('/api/keys/paypal',(req,res)=>{
  res.send(process.env.PAYPAL_CLIENT_ID || 'sb');
});

// router
app.use('/api/seed', seedRouter);
app.use('/api/products', productRouter);
app.use('/api/users', userRouter);
app.use('/api/orders',orderRouter);

// middleware
app.use((err, req, res, next) => {
  res.status(500).send({ message: err.message });
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`server running at http://localhost:${port}`);
});