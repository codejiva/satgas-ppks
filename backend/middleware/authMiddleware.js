const jwt = require('jsonwebtoken');

// Middleware Admin
const authorizeAdmin = (req, res, next) => {
  const token = req.headers['authorization'];

  if (!token) {
    return res.status(403).send('No token provided');
  }

  jwt.verify(token, 'secretkey', (err, decoded) => {
    if (err) {
      return res.status(500).send('Failed to authenticate token');
    }

    if (decoded.role !== 'admin') {
      return res.status(403).send('Access forbidden: Admins only');
    }

    req.user = decoded;
    next();
  });
};

// Middleware Satgas
const authorizeSatgas = (req, res, next) => {
  const token = req.headers['authorization'];

  if (!token) {
    return res.status(403).send('No token provided');
  }

  jwt.verify(token, 'secretkey', (err, decoded) => {
    if (err) {
      return res.status(500).send('Failed to authenticate token');
    }

    if (decoded.role !== 'satgas') {
      return res.status(403).send('Access forbidden: Satgas only');
    }

    req.user = decoded;
    next();
  });
};

module.exports = { authorizeAdmin, authorizeSatgas };
