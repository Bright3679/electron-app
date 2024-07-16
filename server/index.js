const express = require('express');
let authentication = require('./routes/authentication');
let todoTasks = require('./routes/taskOperations')
const router = express.Router();
const authenticationCtrl = require('../middlewares/authenticationCtrl')
// const app = express();
// app.use(express.json());

// Auth APIs
router.post('/login', authentication.login);
router.post('/register', authentication.register)
router.get('/getUserDetails', authenticationCtrl.authenticateToken, authentication.getUserDetails)

//Task Operations
router.post('/insertTask', todoTasks.taskInsert)

module.exports = router;