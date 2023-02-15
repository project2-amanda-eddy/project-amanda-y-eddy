const router = require('express').Router();
const authController = require('../controllers/auth.controller');
const userController = require('../controllers/user.controller');
const communityController = require('../controllers/community.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const GOOGLE_SCOPES = [
  "https://www.googleapis.com/auth/userinfo.profile",
  "https://www.googleapis.com/auth/userinfo.email"
];
const passport = require('passport');

/* Main route */
router.get('/', authMiddleware.isNotAuthenticated, (req, res, next) => res.render('home'))

/* AUTH */
router.get('/signup', authMiddleware.isNotAuthenticated, authController.signup);
router.post('/signup', authMiddleware.isNotAuthenticated, authController.doSignup);
router.get('/login', authMiddleware.isNotAuthenticated, authController.login);
router.post("/login", authMiddleware.isNotAuthenticated, authController.doLogin);
router.get("/logout", authMiddleware.isAuthenticated, authController.logout);

/* Auth Google */
router.get(
  "/login/google",
  authMiddleware.isNotAuthenticated,
  passport.authenticate("google-auth", { scope: GOOGLE_SCOPES })
);
router.get(
  "/auth/google/callback",
  authMiddleware.isNotAuthenticated,
  authController.doLoginGoogle
);

//User routes
router.get('/profile', authMiddleware.isAuthenticated, userController.profile);
router.post('/profile', authMiddleware.isAuthenticated, userController.createProfile)

router.get('/community', authMiddleware.isAuthenticated, communityController.create);
router.post('/community', authMiddleware.isAuthenticated, communityController.doCreate);

module.exports = router;