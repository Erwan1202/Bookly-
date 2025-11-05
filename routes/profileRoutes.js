const express = require('express');
const router = express.Router();
const { 
  createProfile, 
  getProfileByUserId, 
  updateProfile 
} = require('../controllers/profileController');

router.route('/')
  .post(createProfile);

router.route('/:userId')
  .get(getProfileByUserId)
  .put(updateProfile);

module.exports = router;
