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

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/users', userRoutes);

// Test route
app.get('/', (req, res) => {
    res.send('Welcome to Satgas PPKS Backend!');
});

// Start server
app.listen(port, () => {
    console.log(`✅ Server running at http://localhost:${port}🔥🔥🔥`);
});
