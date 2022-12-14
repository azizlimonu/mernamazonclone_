const express = require('express');
const expressAsyncHandler = require('express-async-handler');
const Product = require('../models/productModel');

const router = express.Router();

// get product
router.get('/', async (req, res) => {
  const products = await Product.find();
  res.send(products);
});

// categories
router.get('/categories', expressAsyncHandler(async (req, res) => {
  const categories = await Product.find().distinct('category');
  res.send(categories);
}));

// get product by slug
router.get('/slug/:slug', async (req, res) => {
  const product = await Product.findOne({ slug: req.params.slug });
  if (product) {
    res.send(product);
  } else {
    res.status(404).send({ message: 'Product Not Found' });
  }
});

// get product by id
router.get('/:id', async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (product) {
    res.send(product);
  } else {
    res.status(404).send({ message: 'Product Not Found' });
  }
});

module.exports = router;