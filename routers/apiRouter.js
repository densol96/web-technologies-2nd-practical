const express = require('express');
const router = express.Router();

const animeController = require('../controllers/animeController.js');

// ANIMES
router.route('/anime/all').get(animeController.getAllAnimes);

module.exports = router;
