const express = require('express');
let authentication = require('./routes/authentication');
const router = express.Router();
const authenticationCtrl = require('../middlewares/authenticationCtrl')

// Auth APIs
router.post('/login', authentication.login);
router.post('/register', authentication.register)
router.get('/getUserDetails', authenticationCtrl.authenticateToken, authentication.getUserDetails)

module.exports = router;