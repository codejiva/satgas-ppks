const jwt = require('jsonwebtoken');

// Middleware untuk verifikasi token JWT
const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(403).json({ message: 'No token provided' });
    }

    // Pastikan formatnya "Bearer <token>"
    const token = authHeader.split(' ')[1];

    if (!token) {
        return res.status(403).json({ message: 'Token format salah. Harus menggunakan Bearer token.' });
    }

    jwt.verify(token, 'secretkey', (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        // Menyimpan informasi user pada request untuk digunakan selanjutnya
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

// Middleware untuk Satgas
const authorizeSatgas = (req, res, next) => {
    verifyToken(req, res, () => {
        if (req.user.role !== 'satgas') {
            return res.status(403).json({ message: 'Access forbidden: Satgas only' });
        }
        next();
    });
};

// Middleware untuk Pelapor
const authorizePelapor = (req, res, next) => {
    verifyToken(req, res, () => {
        if (req.user.role !== 'pelapor') {
            return res.status(403).json({ message: 'Access forbidden: Pelapor only' });
        }
        next();
    });
};

module.exports = { verifyToken, authorizeAdmin, authorizeSatgas, authorizePelapor };
