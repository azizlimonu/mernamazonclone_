const jwt = require('jsonwebtoken');

const isAuth = (req, res, next) => {
  const authorization = req.headers.authorization;

  if (authorization) {
    const token = authorization.slice(7, authorization.length);
    // slice the bearer header of the token
    jwt.verify(token, process.env.JWT_SECRET, (error, decode) => {
      if (error) {
        res.status(401).send({ message: 'invalid token' });
      } else {
        req.user = decode;
        next();
      }
    });
  } else {
    res.status(401).send({ message: 'No token found' });
  }
}

module.exports = { isAuth }