const ErrorResponse =  require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const User = require('../models/Users');
const SendEmail = require('../utils/sendEmail');
const crypto = require('crypto');
// @desc Register user
// @route POST /api/v1/register
// @access Public
exports.register = asyncHandler(async (req, res, next) => {
    const { name, email, password, role } = req.body;

    //Create user
    const user = await User.create({
        name,
        email,
        password,
        role
    });
    // Create TOken
    const token = user.getSignedJwtToken();

        res.status(200).json({
            success: true,
            token
        });
});


// @desc Login user
// @route POST /api/v1/register
// @access Public
exports.login = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body;
    
    // Validationg email & password
    if(!email || !password){
        return next( new ErrorResponse ('please provide an email ans password', 400));
    }
    
    //Check user
    const user = await User.findOne({ email }).select('+password')

    if(!user){
        return next(new ErrorResponse ('Invalid Crditioals', 401));  
    }
    
    // Check if paasword is matching 
    const isMatch = await user.matchPassword(password);
    
    if(!isMatch){
        return next(new ErrorResponse ('Invalid Crditioals', 401));  
    }
    
    sendTokenResponse(user, 200, res)
});


// @desc GET currunt  user
// @route POST /api/v1/me
// @access Private
exports.getME = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.user.id);

    res.status(200).json({
        success: true,
        data: user
    })
})

// @desc Forgot Password
// @route POST /api/v1/forgotpassword
// @access Private
exports.forgotpassword = asyncHandler(async (req, res, next) => {
    const user = await User.findOne({ email: req.body.email });

    if(!user){
        return (
           new ErrorResponse ('There is no user with that email', 404)
        )
    }
    //Get reset Token
    const resetToken = user.getResetPasswordToken();
    
    await user.save({
       validateBeforeSave:false 
    })
    
    //Crete Reset URL
    const resetURL = `${req.protocol}://${req.get('host')}/api/v1/auth/resetpassword/${resetToken}`;
    const message = `You are reciving email :\n\n ${resetURL}`;

    try{
        await SendEmail ({
            email: user.email,
            subject: 'Password reset token',
            message
        });
        
        
        res.status(200).json({
            success: true,
            data: 'Email sent'
        });
    }

    catch(err) {
        Console.log(err);
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save({
            validateBeforeSave: false
        });
        
        return next( new ErrorResponse('Email Could not be send ', 500));
        
    }
});


// @desc PUT reset Password
// @route PUT /api/v1/auth/resetpassword/:resettokem
// @access Private
exports.resetPassword = asyncHandler(async (req, res, next) => {
    
    //Get hashed Token
    const resetPasswordToken = crypto
        .createHash('sha256')
        .update(req.params.resettoken)
        .digest('hex')
        
    const user = await User.findOne( {
        resetPasswordToken, 
        resetPasswordExpire: { $gt: Date.now() }
    });

    if(!user) {
        return next(new ErrorResponse('Invalid Token', 400))
    }

    //Set new PAssword
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    sendTokenResponse (user, 200, res); 
});

//get token form model also create coookie and send response
const sendTokenResponse =  (user, statusCode, res) => {
    //create Token
    const token = user.getSignedJwtToken();
    
    const options = {
        expires : new Date(Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
        httpOnly: true
    };  

    if(process.env.NODE_ENV === 'producttion'){
        options.secure = true;
    }

    res.
        status(statusCode)
        .cookie('token', token, options)
        .json({
            success: true,
            token
        })
        
}
// @desc LogOut user   / clear Cookie
// @route GET /api/v1/auth/logout
// @access Private
exports.logout = asyncHandler (async (req, res, next) => {
    res.cookie('token', 'none' , {
        expires : new Date(Date.now() + 10 * 1000),
        httpOnly: true
    });
    
    res.status(200).json({
        success: true,
        data : {}
    });      
});


// @desc Upadte user Details
// @route PUT /api/v1/auth/updatedetails
// @access Private
exports.updateDetails = asyncHandler(async (req, res, next) => {
    const fieldsToupdate = {
        name: req.body.name,
        email: req.body.email
    };

    const user = await User.findByIdAndUpdate(req.user.id, fieldsToupdate, {
        new: true,
        runValidators: true
    });
    
    res.status(200).json({
        success: true,
        data: user
    })
})


// @desc Update password
// @route PUT /api/v1/auth/updatepassword
// @access Private
exports.updatePassword = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.user.id).select('+password');
    //Check currunt password
    if(!(await user.matchPassword(req.body.curuntPassword))){
        return next(new ErrorResponse('Password is incorrect', 401));
    }
    user.password = req.body.newPassword;
    await user.save();

    sendTokenResponse(user, 200, res);

})