const jwt = require('jsonwebtoken');

const isAdmin = (req, res, next) => {
  if (req.user && req.user.isAdmin){
    next();
  }else{
    res.status(401).send({message:'Invalid User Role'})
  }
};

module.exports = { isAdmin }