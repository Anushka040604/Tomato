import express from 'express';
import cors from 'cors';
import { connectDB } from './config/db.js';
import foodRouter from './routes/foodRoute.js';
import userRouter from './routes/userRoute.js';
import dotenv from 'dotenv';
import cartRouter from './routes/cartRoute.js';
import orderRouter from './routes/orderRoute.js';

dotenv.config();

// App configuration
const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(express.json()); // Use for parsing JSON
app.use(cors()); // Allow access from any frontend

// Database connection 
connectDB();

// Static files middleware
app.use('/images', express.static('uploads'));

// API endpoints
app.use('/api/food', foodRouter);
app.use('/api/user', userRouter); 
app.use('/api/cart', cartRouter);
app.use('/api/order', orderRouter);

// Root endpoint
app.get('/', (req, res) => {
    res.send('API working');
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ success: false, message: 'Something broke!', error: err.message });
});

// Function to start the server
const startServer = (port) => {
    app.listen(port, () => {
        console.log(`Server started on http://localhost:${port}`);
    }).on('error', (err) => {
        if (err.code === 'EADDRINUSE') {
            console.log(`Port ${port} is in use, trying another port...`);
            startServer(port + 1);
        } else {
            console.error(err);
        }
    });
};

// Start the server
startServer(PORT);

// Ensure proper cleanup on exit
process.on('SIGINT', () => {
    console.log('Shutting down server...');
    process.exit();
});

process.on('SIGTERM', () => {
    console.log('Shutting down server...');
    process.exit();
});
