const express = require('express');
const router = express.Router();

const authController = require('../controllers/authController.js');
const viewContoller = require('../controllers/viewController.js');

// Check if the client is a holder of JWT cause on it will depend how we render the pages
router.use(authController.idLoggedInSession);

router.get('/', (req, res) => {
  res.redirect('/overview');
});
router.get('/anime/:slug', viewContoller.getAnime);
router.get('/overview', viewContoller.getOverview);
router.get('/login', viewContoller.login);
router.get('/sign-up', viewContoller.signUp);
router.get(
  '/email-confirmation/:token',
  authController.confirmEmail,
  viewContoller.emailConfirmed
);
router.get('/forgot-password', viewContoller.forgotPassword);
router.get('/password-reset/:token', viewContoller.resetPassword);

// PROTECTED ROUTES
router.use(authController.protect);
router.get('/logout', authController.logout);
router.get('/me/settings', viewContoller.meSettings);
router.get(
  '/me/security',
  (req, res, next) => {
    console.log('This route exists');
    next();
  },
  viewContoller.meSecurity
);
module.exports = router;
