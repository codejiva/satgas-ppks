const jwt = require('jsonwebtoken');

// Middleware untuk verifikasi token JWT
const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(403).json({ message: 'No token provided' });
    }

    const token = authHeader.split(' ')[1]; // Pastikan format "Bearer <token>"

    if (!token) {
        return res.status(403).json({ message: 'Token format salah. Harus menggunakan Bearer token.' });
    }

    jwt.verify(token, 'secretkey', (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        req.user = decoded; // Menyimpan data user ke dalam request
        next(); // Melanjutkan ke endpoint yang diminta
    });
};

// Middleware untuk Satgas
const authorizeSatgas = (req, res, next) => {
    verifyToken(req, res, () => {
        if (!req.user || req.user.role !== 'satgas') { // Pastikan req.user dan role ada
            return res.status(403).json({ message: 'Access forbidden: Satgas only' });
        }
        next();
    });
};

// Middleware untuk Admin
const authorizeAdmin = (req, res, next) => {
    verifyToken(req, res, () => {
        if (!req.user || req.user.role !== 'admin') { // Pastikan req.user dan role ada
            return res.status(403).json({ message: 'Access forbidden: Admins only' });
        }
        next();
    });
};

// Middleware untuk Pelapor
const authorizePelapor = (req, res, next) => {
    verifyToken(req, res, () => {
        if (!req.user || req.user.role !== 'pelapor') { // Pastikan req.user dan role ada
            return res.status(403).json({ message: 'Access forbidden: Pelapor only' });
        }
        next();
    });
};

module.exports = { verifyToken, authorizeAdmin, authorizeSatgas, authorizePelapor };
