const Profile = require('../models/profile.model');

exports.createProfile = async (req, res) => {
  const { _id, preferences } = req.body;

  if (!_id) {
    return res.status(400).json({ msg: "L'ID utilisateur (_id) est requis" });
  }

  try {
    let profile = await Profile.findById(_id);
    if (profile) {
      return res.status(400).json({ msg: 'Ce profil existe déjà' });
    }

    profile = new Profile({
      _id: _id,
      preferences: preferences || { genres_favoris: [], auteurs_preferes: [] },
      history: []
    });

    await profile.save();
    res.status(201).json(profile);

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erreur serveur');
  }
};

exports.getProfileByUserId = async (req, res) => {
  try {
    const profile = await Profile.findById(req.params.userId);

    if (!profile) {
      return res.status(404).json({ msg: 'Profil non trouvé' });
    }

    res.status(200).json(profile);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'Number') {
      return res.status(404).json({ msg: 'Profil non trouvé (ID mal formé)' });
    }
    
    res.status(500).send('Erreur serveur');
  }
};

exports.updateProfile = async (req, res) => {
  const { preferences, historyItem } = req.body;
  const userId = req.params.userId;

  try {
    let profile = await Profile.findById(userId);

    if (!profile) {
      return res.status(404).json({ msg: 'Profil non trouvé' });
    }

    if (preferences) {
      profile.preferences = { ...profile.preferences, ...preferences };
    }

    if (historyItem) { 
      profile.history.push(historyItem);
    }

    await profile.save();
    res.status(200).json(profile);

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erreur serveur');
  }
};
