const express = require('express');
const router = express.Router();
const {AuthController} = require('../controllers/AuthController');
const {ExternalController} = require('../controllers/ExternalController');


/**
 * ExternalService routers
 */
router.get('/latency', AuthController.auth, ExternalController.latency);

module.exports.ExternalRouter = router;
