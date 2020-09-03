const express = require('express');
const router = express.Router();

const  { create , productById , read , remove } = require ('../controllers/product');
const  {requireSignin , isAuth, isAdmin } = require ('../controllers/auth');


router.post('/product/create/:userId',requireSignin, isAuth, isAdmin , create);

router.get('/product/:productId', read);
router.delete('/product/:productId/:userId',requireSignin, isAuth, isAdmin , remove);
router.param('productId',productById);
module.exports = router;