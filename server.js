require('dotenv').config();

const express = require('express');
const cors = require('cors');

const connectMongo = require('./config/db.mongo.js');
const pgPool = require('./config/db.postgres.js');
const createSqlTables = require('./models/tables.sql.js');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json()); 

connectMongo();
const initPostgres = async () => {
  try {
    const client = await pgPool.connect();
    const res = await client.query('SELECT NOW()');
    console.log('Connexion à PostgreSQL réussie (heure du serveur) :', res.rows[0].now);
    

    await createSqlTables(); 
    
    client.release();
  } catch (err) {
    console.error('Erreur de connexion ou d initialisation PostgreSQL :', err);
  }
};
initPostgres();

app.get('/', (req, res) => {
  res.send('API Bookly-Hybrid fonctionne !');
});

app.listen(PORT, () => {
  console.log(`Serveur démarré sur http://localhost:${PORT}`);
});
