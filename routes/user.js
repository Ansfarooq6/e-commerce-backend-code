const express = require('express');
const router = express.Router();
const userCont = require('../controler/userCont');
const isAuth = require('../middleware/auth');

//////////////....////////////////

router.get('/foodlist',userCont.foodlist);

router.get('/fooddetail/:foodId',userCont.foodDetail);

router.post('/addcart',isAuth,userCont.postaddCart);

router.delete('/clearCart',isAuth,userCont.deleteCart);

router.get('/checkout',isAuth,userCont.checkout);

router.get('/success/checkout', isAuth,userCont.checkoutsuccess);



module.exports = router;