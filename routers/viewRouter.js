const express = require('express');
const router = express.Router();

const authController = require('../controllers/authController.js');
const viewContoller = require('../controllers/viewController.js');

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
router.get(
  '/password-reset/:token',
  authController.resetPassword,
  viewContoller.resetPassword
);

module.exports = router;
