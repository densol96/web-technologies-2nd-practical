const express = require('express');
const router = express.Router();

const authController = require('../controllers/authController.js');
const viewController = require('../controllers/viewController.js');

router.use(authController.protect, authController.restrictTo('admin'));
router.get('/reviews', viewController.adminReviews);
router.route('/reviews/edit/:id').get(viewController.adminEditReviews);
module.exports = router;
