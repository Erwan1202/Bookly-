require('dotenv').config();

const express = require('express');
const cors = require('cors');

const connectMongo = require('./config/db.mongo.js');
const pgPool = require('./config/db.postgres.js');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json()); 

connectMongo();

pgPool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Erreur de connexion à PostgreSQL :', err);
  } else {
    console.log('Connexion à PostgreSQL réussie (heure du serveur) :', res.rows[0].now);
  }
});

app.get('/', (req, res) => {
  res.send('API Bookly-Hybrid fonctionne !');
});

app.listen(PORT, () => {
  console.log(`Serveur démarré sur http://localhost:${PORT}`);
});
