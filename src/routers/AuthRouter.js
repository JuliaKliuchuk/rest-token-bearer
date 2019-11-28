const express = require('express');
const router = express.Router();
const {AuthController} = require('../controllers/AuthController');


/**
 * AuthService routers
 */
router.use(express.json());
router.post('/signin',AuthController.signin);
router.post('/signup',AuthController.signup);
router.get('/info', AuthController.auth, AuthController.info);
router.get('/logout', AuthController.auth, AuthController.logout);


module.exports.AuthRouter = router;
