const {JWT_KEY} = require("../.env")
const jwt = require("jsonwebtoken")

    function userMiddleware(req, res, next){
        const token = req.headers.token;

    try{
        const decodedvalue = jwt.verify(token, USER_JWT_KEY)

        if(decodedvalue){
            req.userId = decodedvalue.id;
            next()
        }
        else{
            req.status(403).json({
                msg: "You are not authenticated"
            })
        }
    }catch(e){
        res.json({
            msg: "Invalid Inputs"
        })
    }
}

module.exports = userMiddleware

