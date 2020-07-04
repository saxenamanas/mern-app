const express = require('express');
const User = require('../../models/User');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const { check, validationResult } = require('express-validator');

router.get('/',[
    check('name','Name is required').not().isEmpty(),
    check('email','Please include a valid email').isEmail(),
    check(
        'password',
        'Please enter a password with 6 or more characters'
    ).isLength({min: 6})
],async (req,res)=>{


    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()})
    }
    try{
        const {name,email,password} = req.body;
        const user = await User.findOne({email});
        if(user){
            return res.status(400).json({errors:[{msg:"User Already Exists"}]})
        }

        const avatar = gravatar.url(email,{
            s:'200',
            r:'pg',
            d:'mm'
        });

        const newUser = new User({
            name,
            email,
            password,
            avatar
        });

        const salt = await bcrypt.genSalt(10);
        newUser.password = await bcrypt.hash(password,salt);
        await newUser.save();
        res.send(newUser);
    }catch(e){
        console.log(e)
        res.status(500).send('Server Error');
    }
});

module.exports = router;