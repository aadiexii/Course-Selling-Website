const { Schema, default: mongoose } = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

async function connectToDb(){
    try{
        await mongoose.connect(process.env.URI_DBKey)
        console.log("Connected to MongoDb")
    }
    catch(e){
        console.log("Couldnt Connect ",e.message);
        process.exit(1)
    }
}

const userSchema = new mongoose.Schema({
     firstName: String,
     lastName: String,
     email: { type: String, unique: true},
     password: String
})

const courseSchema = new mongoose.Schema({
      title: String,
      discription: String,
      price: Number,
      imageUrl: String,
      creatorId: ObjectId
})

const adminSchema = new mongoose.Schema({
     firstName: String,
     lastName: String,
     email: { type: String, unique: true},
     password: String 
})

const purchasedCourseSchema = new mongoose.Schema({
    userId: ObjectId,
    courseId: ObjectId
})

const User = mongoose.model('User', userSchema)
const Course = mongoose.model('Course', courseSchema)
const Admin = mongoose.model('Admin', adminSchema)
const PurchasedCourse = mongoose.model('PurchasedCourse', purchasedCourseSchema)


module.exports = {
    connectToDb,
    User,
    Course,
    Admin,
    PurchasedCourse
}