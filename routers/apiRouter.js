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

// ------- CMS CALLS TO API ---------
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

// USERS
router.route('/users').get(userController.getUsers);
router
  .route('/admin/users/edit/:id')
  .patch(
    authController.protect,
    authController.restrictTo('admin'),
    userController.uploadAvatar,
    userController.processImage,
    userController.adminUpdateUser
  );
router
  .route('/admin/users/create')
  .post(
    authController.protect,
    authController.restrictTo('admin'),
    userController.adminCreateUser
  );
module.exports = router;
