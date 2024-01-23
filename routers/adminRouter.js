const express = require('express');
const router = express.Router();

const authController = require('../controllers/authController.js');
const viewController = require('../controllers/viewController.js');

// Protect and restricted access for users with .role === 'admin'
router.use(authController.protect, authController.restrictTo('admin'));

// REVIEWS
router.get('/reviews', viewController.adminReviews);
router.route('/reviews/edit/:id').get(viewController.adminEditReviews);

// USERS
router.get('/users', viewController.adminUsers);
router.get('/users/edit/:id', viewController.adminEditUsers);
router.get('/users/create', viewController.adminCreateUser);
// ANIMES
router.get('/animes', viewController.adminAnimes);
router.get('/animes/edit/:id', viewController.adminEditAnimes);
router.get('/animes/create', viewController.adminCreateAnimes);
module.exports = router;
