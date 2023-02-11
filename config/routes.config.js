const router = require('express').Router();
const authController = require('../controllers/auth.controller');
// const userController = require('../controllers/user.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const passport = require('passport');

/* Main route */
router.get('/', (req, res, next) => res.render('home'))

/* Auth */
router.get('/signup', authMiddleware.isNotAuthenticated, authController.signup);
router.post('/signup', authMiddleware.isNotAuthenticated, authController.doSignup)
router.get('/login', authMiddleware.isNotAuthenticated, authController.login)

/* Google */
router.get("/login/google", authMiddleware.isNotAuthenticated, passport.authenticate("google", { scope: [
    "https://www.googleapis.com/auth/userinfo.profile",
    "https://www.googleapis.com/auth/userinfo.email"
  ]}));
router.get(
    "/auth/google/callback",
    passport.authenticate("google", {
      successRedirect: "/private-page",
      failureRedirect: "/" // here you would redirect to the login page using traditional login approach
    })
  );
module.exports = router;