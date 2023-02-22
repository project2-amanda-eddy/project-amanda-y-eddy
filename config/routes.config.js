const router = require('express').Router();
const authController = require('../controllers/auth.controller');
const userController = require('../controllers/user.controller');
const communityController = require('../controllers/community.controller');
const spoonacularController = require('../controllers/spoonacular.controller');
const diaryController = require('../controllers/diary.controller');
const fileUploader = require('../config/cloudinary.config');

const authMiddleware = require('../middlewares/auth.middleware');
const GOOGLE_SCOPES = [
  "https://www.googleapis.com/auth/userinfo.profile",
  "https://www.googleapis.com/auth/userinfo.email"
];
const passport = require('passport');
const User = require('../models/User.model');

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
router.post('/profile', authMiddleware.isAuthenticated, userController.createProfile);
router.get('/analytics', authMiddleware.isAuthenticated, userController.showAnalytics);
router.post('/profile/image', authMiddleware.isAuthenticated, fileUploader.single('image'), userController.doEditProfilePicture)

//Recipes
router.get('/recipes', authMiddleware.isAuthenticated, spoonacularController.recipes);
router.get('/recipes/detail/:id', authMiddleware.isAuthenticated, spoonacularController.recipeDetail);
router.get('/recipes/:diet', authMiddleware.isAuthenticated, spoonacularController.dietRecipes);

//Ingredients
router.get('/ingredients', authMiddleware.isAuthenticated, spoonacularController.ingredients);
router.get('/ingredients/details/:id', authMiddleware.isAuthenticated, spoonacularController.ingredientsDetail);

//community
router.get('/community', authMiddleware.isAuthenticated, communityController.create);
router.post('/community', authMiddleware.isAuthenticated, fileUploader.single('image'), communityController.doCreate);
router.post('/comments/:id/delete', authMiddleware.isAuthenticated, communityController.delete);
router.post('/comment/:id/like', authMiddleware.isAuthenticated, userController.like);

//dashboard
router.get('/dashboard', authMiddleware.isAuthenticated, diaryController.dashboard);
router.post('/diary', authMiddleware.isAuthenticated, diaryController.addIngredient);
router.put('/diary/:name', authMiddleware.isAuthenticated, diaryController.deleteIngredient);


module.exports = router;