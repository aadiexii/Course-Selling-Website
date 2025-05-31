const express = require('express')
require('dotenv').config();
const app = express()
const port = 3000
const mongoose = require('mongoose')
const {connectToDb} = require('./db')
const {userRouter} = require('./routes/user')
const {courseRouter} = require('./routes/course')
const {adminRouter} = require('./routes/admin')

// const  {User, Admin, Course, PurchasedCourse} = require('./db')

app.use(express.json());

app.use('/api/v1/user', userRouter)
app.use('/api/v1/course', courseRouter)
app.use('/api/v1/admin', adminRouter)

async function main(){
    //use .env file to store enviroment variables
    await connectToDb()
    app.listen(port, () => {
        console.log(`express server running succesfully on ${port}`)
    })
} 

main();
 