const express = require('express');
const router = express.Router();

const { getAllUsers, 
        addUser,
        getFullUserById
       } = require('../controllers/userController');

router.route('/')
  .get(getAllUsers)
  .post(addUser);

router.route('/user-full/:id')
  .get(getFullUserById);

module.exports = router;
