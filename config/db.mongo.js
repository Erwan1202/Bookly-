const mongoose = require('mongoose');
require('dotenv').config();

const MONGO_URI = process.env.MONGO_URI;

const connectMongo = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connexion à MongoDB réussie !');
  } catch (err) {
    console.error('Erreur de connexion à MongoDB :', err.message);
    process.exit(1);
  }
};

module.exports = connectMongo;
