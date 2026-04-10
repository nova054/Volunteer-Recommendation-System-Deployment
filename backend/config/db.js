const mongoose = require('mongoose');

const connectDB = async()=>{
    try{
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB connected successfully');
    } catch(err){
        console.error('MongoDB connection error:', err.message);
        // DON'T exit the process - let the server continue running
        // The API will return appropriate errors if DB is unavailable
        console.log('Server will continue without database connection');
    }
}

module.exports = connectDB;