const pool = require('../config/db.postgres');

const Profile = require('../models/profile.model');

exports.getAllUsers = async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT id, name, email FROM users ORDER BY id ASC');
    res.status(200).json(rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erreur serveur');
  }
};

exports.addUser = async (req, res) => {
  const { name, email } = req.body;


  if (!name || !email) {
    return res.status(400).json({ msg: 'Veuillez fournir un nom et un email' });
  }

  try {
    const newUserQuery = `
      INSERT INTO users (name, email) 
      VALUES ($1, $2) 
      RETURNING id, name, email
    `;
    const { rows } = await pool.query(newUserQuery, [name, email]);
    const newUser = rows[0];

    res.status(201).json(newUser);

  } catch (err) {
    console.error(err.message);

    if (err.code === '23505') {
      return res.status(400).json({ msg: 'Cet email est déjà utilisé' });
    }
    res.status(500).send('Erreur serveur');
  }
};

exports.getFullUserById = async (req, res) => {
  const userId = req.params.id;

  try {
    const userQuery = 'SELECT id, name, email FROM users WHERE id = $1';
    const userResult = await pool.query(userQuery, [userId]);

    if (userResult.rows.length === 0) {
      return res.status(404).json({ msg: 'Utilisateur non trouvé (SQL)' });
    }
    const userSql = userResult.rows[0];
    const userMongo = await Profile.findById(userSql.id);

    if (!userMongo) {
      return res.status(200).json({
        ...userSql,
        profile: null, 
        note: "Cet utilisateur n'a pas encore de profil "
      });
    }

  
    const fullUser = {
      ...userSql, 
      profile: {
        preferences: userMongo.preferences,
        history: userMongo.history
        }
    };

      res.status(200).json(fullUser);

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erreur serveur');
  }
};
