const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const User = require('../models/userModel');
const expressAsyncHandler = require('express-async-handler');
const { generateToken } = require('../utils/generateToken');
const { isAuth } = require('../utils/isAuth');
const { isAdmin } = require('../utils/isAdmin')

// admin router to get users
router.get('/', isAuth, isAdmin, expressAsyncHandler(async (req, res) => {
  const users = await User.find({});
  res.send(users);
}));

// get user info by admin
router.get('/:id', isAuth, isAdmin, expressAsyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (user) {
    res.send(user);
  } else {
    res.status(404).send({ message: 'USER NOT FOUND' });
  }
}));

// updated user by admin
router.put('/:id', isAuth, isAdmin, expressAsyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (user) {
    user.name = req.body.name || user.name
    user.email = req.body.email || user.email
    user.isAdmin = Boolean(req.body.isAdmin);
    const updatedUser = await user.save();

    res.send({ message: 'User Updated', user: updatedUser });
  } else {
    res.status(404).send({ message: 'USER NOT FOUND' });
  }
}));

// deleted user by admin
router.delete('/:id', isAuth, isAdmin, expressAsyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (user) {
    if (user.email === process.env.ADMIN) {
      res.status(400).send({ message: 'CANNOT DELETE ADMIN' });
    } else {
      await user.remove();
      res.send({ message: `User ${user.name} has been deleted` });
    }
  } else {
    res.status(404).send({ message: 'User Not Found' });
  }
}));

// signin user method post
router.post('/signin', expressAsyncHandler(async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      const validity = await bcrypt.compareSync(req.body.password, user.password);
      if (validity) {
        res.status(200).send({
          _id: user._id,
          name: user.name,
          email: user.email,
          isAdmin: user.isAdmin,
          token: generateToken(user),
        });
      }
      return;
    }
    res.status(401).send({ message: 'Invalid email or password' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}));

router.post('/signup', expressAsyncHandler(async (req, res) => {
  const { email } = req.body.email
  const duplicate = await User.findOne({ email });
  if (duplicate) {
    return res.status(400).send({ message: 'EMAIL IS ALREADY REGISTERED' })
  }
  const newUser = new User({
    name: req.body.name,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 10),
  });

  const user = await newUser.save();
  res.send({
    _id: user._id,
    name: user.name,
    email: user.email,
    isAdmin: user.isAdmin,
    token: generateToken(user),
  });
}));

router.put('/profile', isAuth, expressAsyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    if (req.body.password) {
      user.password = bcrypt.hashSync(req.body.password, 8);
    }

    const updatedUser = await user.save();
    res.send({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
      token: generateToken(updatedUser),
    });
  } else {
    res.status(404).send({ message: "User not found" });
  }
}));

module.exports = router;


