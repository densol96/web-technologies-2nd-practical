const express = require('express');
const router = express.Router();

const authController = require('../controllers/authController.js');
const viewController = require('../controllers/viewController.js');

// Check if the client is a holder of JWT cause on it will depend how we render the pages
router.use(authController.idLoggedInSession);

router.get('/', (req, res) => {
  res.redirect('/overview');
});
router.get('/anime/:slug', viewController.getAnime);
router.get('/overview', viewController.getOverview);
router.get('/login', viewController.login);
router.get('/sign-up', viewController.signUp);
router.get(
  '/email-confirmation/:token',
  authController.confirmEmail,
  viewController.emailConfirmed
);
router.get('/forgot-password', viewController.forgotPassword);
router.get('/password-reset/:token', viewController.resetPassword);

// PROTECTED ROUTES
router.use(authController.protect);
router.get('/logout', authController.logout);
router.get('/me/settings', viewController.meSettings);
router.get('/me/security', viewController.meSecurity);
router.get('/me/reviews', viewController.meReviews);
router.get('/edit/review/:id', viewController.editReviews);
module.exports = router;
