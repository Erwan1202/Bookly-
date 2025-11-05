const pool = require('../config/db.postgres.js');

const createUserTableQuery = `
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
`;

const createBookTableQuery = `
CREATE TABLE IF NOT EXISTS books (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  author VARCHAR(255) NOT NULL,
  available BOOLEAN DEFAULT true,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
`;

const createTables = async () => {
  const client = await pool.connect();
  try {
    await client.query(createUserTableQuery);
    console.log('Table "users" créée ou déjà existante.');
    
    await client.query(createBookTableQuery);
    console.log('Table "books" créée ou déjà existante.');
  } catch (err) {
    console.error('Erreur lors de la création des tables :', err.stack);
  } finally {
    client.release(); 
  }
};

module.exports = createTables;
