const jwt  = require('jsonwebtoken');
const asyncHandler = require('./async');
const ErrorResponse = require('../utils/errorResponse');
const User = require('../models/Users');


//Protect Routes
exports.protect = asyncHandler(async (req, res, next) => {
    let token;
    
    //Set token From BEARE token From header
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        token = req.headers.authorization.split(' ')[1];
    }
    
    //set Token From cookie
    else if(req.cookies.token){
        token = req.cookies.token
    }

    //Make sure token exists
    if(!token){
        return next(new ErrorResponse ('Not authorization to accees this route because Token Is Not Exist ', 401));
    }

    try
        //Verify token
        {
            const decoded = jwt.verify(token , process.env.JWT_SECRET);

            console.log(decoded);

            req.user = await User.findById(decoded.id);
            
            next();

        }  catch (err) {

            return next( new ErrorResponse ('Not Authorzation to acessthis route', 401));
        }
});

//Grant access to specific roles 
exports.authorize = (...roles) => {
    return (req, res, next) =>  {
        if(!roles.includes(req.user.role)) {
            return next(new ErrorResponse(`User role ${req.user.role} is not authorized to acees this route`, 403))
        }

        next();
    }
}
