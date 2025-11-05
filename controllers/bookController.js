const pool = require('../config/db.postgres');
exports.getAllBooks = async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM books ORDER BY title ASC');
    res.status(200).json(rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erreur serveur');
  }
};

exports.addBook = async (req, res) => {
  const { title, author, available } = req.body;


  if (!title || !author) {
    return res.status(400).json({ msg: 'Veuillez fournir un titre et un auteur' });
  }

  try {
    const newBookQuery = `
      INSERT INTO books (title, author, available) 
      VALUES ($1, $2, $3) 
      RETURNING *
    `;

    const { rows } = await pool.query(newBookQuery, [title, author, available !== undefined ? available : true]);
    
    res.status(201).json(rows[0]);

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erreur serveur');
  }
};
