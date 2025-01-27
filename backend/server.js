const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const authRoutes = require('./routes/authRoutes');
const reportRoutes = require('./routes/reportRoutes');
const appointmentRoutes = require('./routes/appointmentRoutes');
const userRoutes = require('./routes/userRoutes');
const db = require('./db');
const app = express();
const port = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use('/api', userRoutes);

// Middleware untuk autentikasi token
function authenticateToken(req, res, next) {
  const token = req.header('Authorization')?.replace('Bearer ', ''); // Ambil token dari header

  if (!token) return res.sendStatus(401); // Jika token tidak ada, kirim status 401 Unauthorized

  jwt.verify(token, 'secretkey', (err, user) => {
    if (err) return res.sendStatus(403); // Jika token tidak valid, kirim status 403 Forbidden
    req.user = user; // Simpan data user dalam request
    next(); // Lanjutkan ke route berikutnya
  });
}

// Routes
app.use('/api/auth', authRoutes); // Route autentikasi
app.use('/api/reports', authenticateToken, reportRoutes); // Route untuk reports, hanya bisa diakses setelah login
app.use('/api/appointments', authenticateToken, appointmentRoutes); // Route untuk appointments, hanya bisa diakses setelah login

// Test route (hanya bisa diakses oleh user yang terautentikasi)
app.get('/api/protected', authenticateToken, (req, res) => {
  res.send('This is a protected route');
});

// Test route
app.get('/', (req, res) => {
  res.send('Welcome to Satgas PPKS STIS');
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
