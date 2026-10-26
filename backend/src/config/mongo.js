const mongoose = require('mongoose');
require('dotenv').config();

const conectarMongo = async () => {
    while (true) {
        try {
            await mongoose.connect(process.env.MONGO_URI, {
                serverSelectionTimeoutMS: 10000,
                socketTimeoutMS: 45000,
            });
            console.log('✅ MongoDB conectado');
            return;
        } catch (err) {
            console.error('❌ Error MongoDB:', err.message);
            console.log('🔄 Reintentando MongoDB en 5s...');
            await new Promise(r => setTimeout(r, 5000));
        }
    }
};

module.exports = conectarMongo;
