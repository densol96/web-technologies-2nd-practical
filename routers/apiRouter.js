const express = require('express');
const router = express.Router();

const animeController = require('../controllers/animeController.js');
const authController = require('../controllers/authController.js');
// ANIMES
router.route('/anime/all').get(animeController.getAllAnimes);
router.route('/users/sign-up').post(authController.signUp);
router
  .route('/users/email-confirmation/:token')
  .get(authController.confirmEmail);
router.route('/login').post(authController.login);
module.exports = router;
