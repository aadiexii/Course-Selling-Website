const { Router } = require('express')
const userRouter = Router();
const  {z} = require("zod");
const bcrypt = require('bcrypt');
const { User, PurchasedCourse } = require("../db")
const jwt = require('jsonwebtoken');
const userMiddleware = require('../middlewares/userMiddleware');
require('dotenv').config();
const  USER_JWT_KEY = process.env.USER_JWT_KEY


userRouter.post('/signup',async function(req, res){
    const { firstName, lastName, email, password } = req.body
    
    const schema = z.object({
        firstName: z.string().max(8),
        lastName: z.string().max(8),
        email: z.string().email(),
        password: z.string().min(5).max(20)       
    })

    const validation = schema.safeParse(req.body);
    if(!validation.success){
        return res.status(400).json({
            msg: "Entered Wrong Inputs",
         })
    }

    try{
        const existingUser = await User.findOne({
            email: email
        })
        
        if(existingUser){
            return res.status(400).json({
                msg: "User Already exist with the email"
            });
        }
        
        const saltRound = 10;
        const hash = await bcrypt.hash(password, saltRound)

        await User.create({
        firstName: firstName,
        lastName: lastName,
        email: email,
        password: hash
        })

        res.json({
            msg: "User created successfully"
        })

    }catch(e){
       res.json({
           msg: "Some Error Occured while creating User " + e
       })
    }    
});

userRouter.post('/signin',async function(req, res){
    const {email, password} = req.body
    
    const user = await User.findOne({email})

    if(!user){
        return res.json({
            msg: "User Doesnt exits"
        })
    }

    const match = bcrypt.compare(password, user.password);
    
    if(match){
        const token = jwt.sign({
            id: user._id
        }, USER_JWT_KEY);

        //If we want to cookie based authentication we will do here
        res.json({
             token: token
        })
    }else{
        res.status(403).json({
            msg: "Incorrect Credentials"
        })
    }
})

userRouter.get('/purchansedcourses',userMiddleware, async function(req, res){
    const userId = req.userId;

        const purchases = await PurchasedCourse.find({
            userId,
        })

        res.json({
            purchases
        })
})

module.exports = {
    userRouter: userRouter
}