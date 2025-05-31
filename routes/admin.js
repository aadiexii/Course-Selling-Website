const { Router } = require('express')
const adminRouter = Router()
const  {z} = require("zod");
const { Admin, Course } = require('../db')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt');
require('dotenv').config();
const  ADMIN_JWT_KEY = process.env.ADMIN_JWT_KEY
const adminMiddleware = require("../middlewares/adminMiddleware")

//bcrypt, zod, jsonwebtoken
adminRouter.post('/signup',async function(req, res){
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
        const ExistingAdmin = await Admin.findOne({
            email: email
        })
        
        if(ExistingAdmin){
            return res.status(400).json({
                msg: "Admin Already exist with the email"
            });
        }
        
        const saltRound = 10;
        const hash = await bcrypt.hash(password, saltRound)

        await Admin.create({
        firstName: firstName,
        lastName: lastName,
        email: email,
        password: hash
        })

        res.json({
            msg: "Admin created successfully"
        })

    }catch(e){
       res.json({
           msg: "Some Error Occured while creating Admin " + e
       })
    }
})

adminRouter.post('/signin', async function(req, res){
    const {email, password} = req.body
    
    const admin = await Admin.findOne({email})

    if(!admin){
        return res.json({
            msg: "Admin Doesnt exits"
        })
    }

    const match = await bcrypt.compare(password, admin.password);
    
    if(match){
        const token = jwt.sign({
            id: admin._id
        }, ADMIN_JWT_KEY);
         
        //If we want to cookie based authentication we will do here
        console.log("Generated token:", token);
        res.json({
             token: token
        })
    }else{
        res.status(403).json({
            msg: "Incorrect Credentials"
        })
    }
})

adminRouter.post('/createCourse', adminMiddleware, async function(req, res){
    const adminId = req.adminId;
    const {title, discription, price, imageUrl} = req.body

    try{
        const newCourse = await Course.create({
            title,
            discription,
            price,
            imageUrl,
            creatorId: adminId
        })

        res.json({
            msg: "Course Created Succesfully",
            courseId: newCourse._id
        })
    } catch(e){
        res.json({
            msg: "Error Occured while creating the course"
        })
    }
})

adminRouter.put('/addCourseContent', adminMiddleware, async function(req, res){
    const adminId = req.adminId;
    const {title, discription, price, imageUrl, courseId} = req.body
    
    //Check if the course belongs to the specific admin or not then only we can add course content
    try{
        const newCourse = await Course.updateOne({
            _id: courseId,
            adminId: adminId
        },{
            courseTitle,
            courseDescription,
            courseThumbnail,
            coursePrice,
        })

        res.json({
            msg: "Course Updated Succesfully",
            courseId: newCourse._id

        })
    } catch(e){
        res.json({
            msg: "Error Occured while updating the course"
        })
    }
})

adminRouter.get('/course/bulk', adminMiddleware, async function(req, res){
    const adminId = req.adminId;

    const allCourses = await Course.find({
        creatorId: adminId,
    })

    res.json({
        msg: "All Courses",
        allCourses: allCourses
    })
})

adminRouter.get('/deleteCourse', adminMiddleware, async function(req, res){
    const adminId = req.adminId;
    const courseId = req.courseId;

    const deletedCourse = await Course.deleteOne({
        adminId,
        courseId
    })

    res.json({
        msg: "Deleted Course"
    })
})

module.exports = {
    adminRouter: adminRouter
}