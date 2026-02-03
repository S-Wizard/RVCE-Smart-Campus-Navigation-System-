import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import userFeatures from './routes/userFeatures.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
    origin: '*', // Temporarily allow all for debugging, or update FRONTEND_URL in Render
    credentials: true
}));
app.use(express.json());

// Routes
app.get('/', (req, res) => res.send('Smart Campus API is Running'));
app.use('/api', authRoutes);
app.use('/api/user', userFeatures);

// Database Connection
if (!process.env.MONGO_URI) {
    console.error('ERROR: MONGO_URI is not defined in environment variables.');
} else {
    mongoose.connect(process.env.MONGO_URI)
        .then(() => console.log('Connected to MongoDB'))
        .catch(err => console.error('MongoDB connection error:', err));
}

// Start Server
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
});
