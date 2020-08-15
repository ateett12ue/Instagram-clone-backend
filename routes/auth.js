const express = require("express");
const router = express.Router();
const mongoose = require('mongoose');
const User = mongoose.model("User");
const brcypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const {JWT_SECRET} = require("../keys");
const requireLogin = require("../middleware/requireLogin")


router.get('/', (req,res)=>{
    res.send("hello")
});

router.post('/signup', (req,res)=>{
    const {name, email, password} = req.body;
    if(!email || !password || !name){
        return res.status(422).json({error: "please add all the fields"})    
    }
    User.findOne({email:email}).then((savedUser)=>{
        if(savedUser){
            return res.status(422).json({error: "User already exits with this email"})
        }
        brcypt.hash(password, 12).then(hashedPassword=>{
            const user = new User({
                email,
                password: hashedPassword,
                name
            })
            user.save().then(user=>{
                res.json({message: "saved successfully"})
            })
            .catch(err=>{
                console.log(err)
            })
        })
        
    }).catch(err=>{
        console.log(err)
    })
})

router.post('/signin', (req,res)=>{
    const {email,password} = req.body;
    if(!email || !password){
        req.status(422).json({error:"please add email or password"})
    }
    User.findOne({email:email}).then(savedUser=>{
        if(!savedUser){
           return res.status(422).json({error: "Invalid Email or Password"}) 
        }
        brcypt.compare(password, savedUser.password).then(doMatch=>{
            if(doMatch){
                const token = jwt.sign({_id:savedUser._id}, JWT_SECRET);
                const {id, name, email, followers, following} = savedUser;
                res.json({token, user:{id, name, email,followers, following}});
            }
            else{
                return res.status(422).json({error: "Invalid Email or Password"}) 
            }
        })
    }).catch(err=>{
        console.log(err);
    })
})



module.exports = router;