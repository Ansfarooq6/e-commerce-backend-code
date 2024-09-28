const express = require('express');
const router = express.Router();
const authUser = require('../controler/user')


router.post('/signUp',authUser.signUp);

router.post('/login',authUser.Login);

module.exports = router;