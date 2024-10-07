const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => { 
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB connected successfully');
    } catch (error) {
        console.error('Failed to connect to MongoDB', error.message);
        process.exit(1); // Salir del proceso si falla la conexión
    }
}

module.exports = connectDB;