const mongoose = require('mongoose');

const historySchema = new mongoose.Schema({
  book: {
    type: String, 
    required: true
  },
  rating: {
    type: Number,
    min: 1,
    max: 5
  },
  review: String
}, { _id: false });

const profileSchema = new mongoose.Schema({
  _id: {
    type: Number, 
    required: true,
    alias: 'userId'
  },
  preferences: {
    genres_favoris: [String],
    auteurs_preferes: [String]
  },
  history: [historySchema] 
}, {
  timestamps: true,
  _id: false 
});

const Profile = mongoose.model('Profile', profileSchema);

module.exports = Profile;
