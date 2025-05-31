const { Router } = require("express")
const userMiddleware = require("../middlewares/userMiddleware");
const { PurchasedCourse, Course } = require("../db");
const courseRouter = Router()

courseRouter.post('/purchase',userMiddleware, async function(req, res){
    const userId = req.userId;
    const courseId = req.body.courseId;
    
    try{
    await PurchasedCourse.create({
        userId,
        courseId
    })

    res.json({
        msg: "Succesfully Bought the Course"
    })
    }catch(e){
        res.json("Something went wrong" + e);
    }

})

courseRouter.get('/preview', async function(req, res){
    const courses = await Course.find({})

    res.json({
       courses
    })
})


module.exports = {
    courseRouter: courseRouter
}