const jwt = require("jsonwebtoken")
require('dotenv').config();
const  ADMIN_JWT_KEY = process.env.ADMIN_JWT_KEY

function adminMiddleware(req, res, next){
        const token = req.headers.token;
 
    try{
        const decodedvalue = jwt.verify(token, ADMIN_JWT_KEY)
        if(decodedvalue){
            req.adminId = decodedvalue.id;
            next()
        }
        else{
            res.status(403).json({
                msg: "You are not authenticated"
            })
        }
    }catch(e){
        res.json({
            msg: "Invalid Inputs"
        })
    }
    }

module.exports = adminMiddleware