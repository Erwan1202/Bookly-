const express = require('express');
const router = express.Router();
const { getAllBooks, addBook } = require('../controllers/bookController');

router.route('/')
  .get(getAllBooks)
  .post(addBook);

module.exports = router;
