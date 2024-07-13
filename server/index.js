const express = require('express');
let authentication = require('./routes/authentication');
const router = express.Router();

// Auth APIs
router.post('/login', authentication.login);
router.post('/register', authentication.register)

module.exports = router;