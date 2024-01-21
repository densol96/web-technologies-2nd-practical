const express = require('express');
const router = express.Router();

const authController = require('../controllers/authController.js');
const viewController = require('../controllers/viewController.js');

const adminRouter = require('./adminRouter.js');
// Check if the client is a holder of JWT cause on it will depend how we render the pages
router.use(authController.idLoggedInSession);

// Redirecting request to the devoted sub-router for this resource: CMS aka Admin panel
// I wanted this router inside viewRouter so the website view renders correctly
// depending on authController.idLoggedInSession above
router.use('/admin', adminRouter);

// Home and overview
router.get('/', (req, res) => {
  res.redirect('/overview');
});
router.get('/overview', viewController.getOverview);
// Anime page
router.get('/anime/:slug', viewController.getAnime);

// Auth related pages
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
// Can't use .protect as a general middleware inside this router cause it would prevent the request from hitting Page Not found route
router.get('/logout', authController.protect, authController.logout);
router.get('/me/settings', authController.protect, viewController.meSettings);
router.get('/me/security', authController.protect, viewController.meSecurity);
router.get('/me/reviews', authController.protect, viewController.meReviews);

// EDITING VIA CMS / ME-REVIEWS PAGE
// Review (can be accessed by the original user and admins  --  auth the action inside the controller)
router.get(
  '/edit/review/:id',
  authController.protect,
  authController.authReviewEdit,
  viewController.editReviews
);

module.exports = router;
