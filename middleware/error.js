const ErrorRespocse = require('../utils/errorResponse')
const errorHandler = (err, req, res, next) =>{
    let error = {...err};
    error.message = err.message;
    
    //Log to console For dev
    console.log(err.stack.red);     
    
    //Mongoose Bad ObjectId
    if(err.name === 'CastError'){
        const message = `Boostcamp is Not Found bY Id ${err.value}`;
        error = new ErrorRespocse (message, 404);
    }
    //Mongoose validation error 
    if(err.name === 'validation Error'){
        const message = Object.values(err.errors).map(val => val.message);
        error = new ErrorRespocse(message, 400)
    }
    if(err.code === 11000){
        const message = 'Duplciate Field Value Entered';
        error = new ErrorRespocse(message, 400);
    }
 
    res.status(err.statusCode || 500).json({
        success: false,
        error: err.message || 'Server Error'
    });
}
module.exports = errorHandler;