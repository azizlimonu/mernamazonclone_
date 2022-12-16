require('dotenv').config();
const mongoose = require('mongoose');
const express = require("express");
// const data = require('./data.js');
const path = require('path');
const cors = require('cors');

const app = express();

// routes
const seedRouter = require('./routes/seedRoutes');
const productRouter = require('./routes/productRoutes');
const userRouter = require('./routes/userRoutes');
const orderRouter = require('./routes/orderRoutes');
const uploadRouter = require('./routes/uploadRoutes');

const corsOptions = {
  origin: ['http://localhost:3000'],
};

mongoose.set('strictQuery', true);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose
  .connect(process.env.MONGODB_URI,
    { usenewurlparser: true, useunifiedtopology: true, })
  .then(() => { console.log('connected to mongoDB') })
  .catch((error) => console.log('connecting failed', error.message));

app.use(cors(corsOptions));

// paypal
app.get('/api/keys/paypal', (req, res) => {
  res.send(process.env.PAYPAL_CLIENT_ID || 'sb');
});

app.get('/api/aziz',(req,res)=>{
  res.send('Hello Aziz');
});

// router
app.use('/api/seed', seedRouter);
app.use('/api/products', productRouter);
app.use('/api/users', userRouter);
app.use('/api/orders', orderRouter);
app.use('/api/upload', uploadRouter);

// const __dirname = path.resolve();
app.use(express.static(path.join(__dirname, '/frontend/build')));
app.get('*', (req, res) => res.sendFile(path.join(__dirname, '/frontend/build/index.html')));

// middleware
app.use((err, req, res, next) => {
  res.status(500).send({ message: err.message });
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`server running at http://localhost:${port}`);
});