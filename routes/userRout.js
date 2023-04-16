const express =require('express');
const { body } = require('express-validator');
const router=express.Router();
const userConstroller=require('../controller/userController')
router.post('/signup',[
    body('email').isEmail(),
    body('password').isLength({min:4}),
    body('name').isLength({min:2}).withMessage('name is too min')
],userConstroller.createUser);

router.post('/login',[
    body('email').isEmail(),
    body('password').isLength({min:4}),
],userConstroller.login);

module.exports=router;