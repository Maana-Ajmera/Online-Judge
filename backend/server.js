require('dotenv').config({ path: './config.env' });
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

const mongoURI = process.env.MONGO_URI;
const jwtSecret = process.env.JWT_SECRET;
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB Connection
mongoose.connect(mongoURI)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));

// Basic route
app.get('/', (req, res) => {
    res.json({ message: 'Online Judge API is running!' });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!' });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
}); 