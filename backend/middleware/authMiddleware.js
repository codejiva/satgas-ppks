const jwt = require('jsonwebtoken');

// Middleware untuk verifikasi token JWT
const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(403).json({ message: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];
    jwt.verify(token, 'secretkey', (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        req.user = decoded;
        next();
    });
};

// Middleware untuk admin
const authorizeAdmin = (req, res, next) => {
    verifyToken(req, res, () => {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Access forbidden: Admins only' });
        }
        next();
    });
};

module.exports = { verifyToken, authorizeAdmin };
