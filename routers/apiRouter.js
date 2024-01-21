const express = require('express');
const router = express.Router();

const animeController = require('../controllers/animeController.js');
const reviewController = require('../controllers/reviewController.js');
const authController = require('../controllers/authController.js');
const userController = require('../controllers/userController.js');

// ANIMES
router.route('/anime/all').get(animeController.getAllAnimes);
// AUTH
router.route('/users/sign-up').post(authController.signUp);
router.route('/users/login').post(authController.login);
router
  .route('/users/logout')
  .get(authController.protect, authController.logout);
router.route('/users/forgot-password').post(authController.forgotPassword);
router.route('/password-reset/:token').post(authController.resetPassword);
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
// REVIEWS
router.route('/reviews').get(reviewController.getReviews);
router
  .route('/post-review')
  .post(authController.protect, reviewController.postReview);
router
  .route('/review/:id')
  .all(authController.protect, authController.authReviewEdit)
  .patch(reviewController.updateReview)
  .delete(reviewController.deleteReview);

module.exports = router;
