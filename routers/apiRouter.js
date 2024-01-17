const express = require('express');
const router = express.Router();

const animeController = require('../controllers/animeController.js');
const reviewController = require('../controllers/reviewController.js');
const authController = require('../controllers/authController.js');
const userController = require('../controllers/userController.js');

// ANIMES
router.route('/anime/all').get(animeController.getAllAnimes);
router.route('/users/sign-up').post(authController.signUp);
router.route('/users/login').post(authController.login);
router.route('/users/logout').get(authController.logout);
router.route('/users/forgot-password').post(authController.forgotPassword);
router.route('/password-reset/:token').post(authController.resetPassword);
router
  .route('/post-review')
  .post(authController.protect, reviewController.postReview);
router.route('/reviews').get(reviewController.getReviews);
router
  .route('/me-security')
  .patch(authController.protect, userController.updateSecurity);
router
  .route('/me-settings')
  .patch(
    authController.protect,
    userController.uploadAvatar,
    userController.processImage,
    userController.updateSettings
  );

module.exports = router;
