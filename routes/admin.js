const express = require('express');
const router = express.Router();
const adminaddfood = require('../controler/admin-functionality');
const isAuth = require('../middleware/auth');
const isAdmin = require('../middleware/checkRole');

router.post('/addfood',isAuth,isAdmin,adminaddfood.addFood);

router.get('/foodlist',isAuth,adminaddfood.adminProducts);

router.put('/edit/:Productid',isAuth,isAdmin,adminaddfood.editFood);

router.delete('/delete/:productId',isAuth,isAdmin,adminaddfood.deleteProducts);

module.exports = router;