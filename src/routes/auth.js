// module imports
const express = require('express');
const passport = require('passport');

// file imports
const authController = require('../controllers/auth');
const { verifyToken } = require('../middlewares/auth');

// variable initializations
const router = express.Router();

router.route('/login').post(passport.authenticate('local'), authController.login);
router.route('/register').post(authController.register);
router.route('/change-pass').post(verifyToken, passport.authenticate('local'), authController.changePassword);
router.route('/user').post(authController.findUser);
router.route('/whoami').get(verifyToken, authController.whoami);
router.route('/logout').get((req, res) => {
  req.logout(() => {
    req.session.destroy();
    res.redirect('/');
  });
});

module.exports = router;
