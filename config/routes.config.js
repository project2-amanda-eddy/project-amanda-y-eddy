const router = require('express').Router();
const authController = require('../controllers/auth.controller');
// const userController = require('../controllers/user.controller');
const authMiddleware = require('../middlewares/auth.middleware');

/* Main route */
router.get('/', (req, res, next) => res.send('Hello world'))

/* Auth */
router.get('/signup', authMiddleware.isNotAuthenticated, authController.signup);

module.exports = router;