import mongoose from "mongoose";

function connect(){
    mongoose.connect(process.env.MONGO_URI, {
        maxPoolSize: 10,
        serverSelectionTimeoutMS: 5000
    }).then(() => {
        console.log("✓ Connected to the database successfully")
    }).catch((err) => {
        console.error("✗ Database connection failed:", err.message)
        process.exit(1)
    })
    
    mongoose.connection.on('disconnected', () => {
        console.warn('⚠ Database disconnected')
    })
    
    mongoose.connection.on('error', (err) => {
        console.error('✗ Database error:', err.message)
    })
}

export default connect;