const express = require('express');
const auth = require('../../middleware/auth');
const User = require('../../models/User');
const config = require('config');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const { check, validationResult } = require('express-validator');
const router = express.Router();

router.get('/',auth,async(req,res)=>{
    try{
        const user = await User.findById(req.user.id).select('-password');
        res.send(user);
    }catch(e){
        res.status(500).send('Server error');
    }
});

router.post('/',[
    check('email','Please include a valid email').isEmail(),
    check(
        'password',
        'Please is required'
    ).exists()
],async (req,res)=>{


    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()})
    }
    try{
        const {email,password} = req.body;
        const user = await User.findOne({email});
        if(!user){
            return res.status(400).json({errors:[{msg:"Invalid Credentials"}]})
        }

        const isMatch = bcrypt.compare(password,user.password);
        if(!isMatch){
            return res.status(400).json({errors:[{msg:"Invalid Credentials"}]})
        }
        const jwtToken = config.get('jwtToken');
        const payLoad = {
            user:{
                id:user.id,
            }
        }
        jwt.sign(payLoad,jwtToken,{expiresIn:360000},(err,token)=>{
            if(err){
                throw new Error(err);
            }
            return res.json({token:token});
        });
    }catch(e){
        console.log(e)
        res.status(500).send('Server Error');
    }
});


module.exports = router;