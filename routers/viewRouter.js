const express = require('express');
const router = express.Router();

const viewContoller = require('../controllers/viewController.js');

router.get('/', (req, res) => {
  res.redirect('/overview');
});
router.get('/anime/:slug', viewContoller.getAnime);
router.get('/overview', viewContoller.getOverview);
router.get('/login', viewContoller.login);
router.get('/sign-up', viewContoller.signUp);

module.exports = router;
