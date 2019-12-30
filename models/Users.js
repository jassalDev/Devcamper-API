const crypto = require('crypto');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const Userscema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please Add a Name ']
    },

    email: {
        type: String,
        unique: true,
        required: [true, 'Please add a email'],

        match: [ 
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please Add a Valid Email '
        ]
    },
    role: {
        type: String,
        enum: ['user', 'publisher', 'admin'],
        default: 'user'
    },
    
    password: {
        type: String,
        required: [true, 'Please add a Password'],
        minlength: 6,
        select: false
    },
    
    resetPasswordToken: String,
    resetPasswordExpire: String,
    createdAt:{
        type: Date,
        default: Date.now
    }
});


//Encrypt passord eith bcrypt
Userscema.pre('save', async function(next){
    if(!this.isModified('password')){
        next();
    }
    
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});


// Sign JWT and return
Userscema.methods.getSignedJwtToken = function() {
    return jwt.sign ({ id: this._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE
    })
}


//match user entered password to hashed password in database
Userscema.methods.matchPassword = async function(enteredPassword){
    return await  bcrypt.compare(enteredPassword, this.password);
}

//generate and hash password token
Userscema.methods.getResetPasswordToken = function() {

    //Generate Token
    const resetToken = crypto.randomBytes(20).toString('hex');

    //Hash token ans set to resetPasswordToken field
    this.resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex')

    //Set expire
    this.resetPasswordExpire = Date.now() + 10 * 60 *1000;
     
    return resetToken
}

module.exports = mongoose.model('users', Userscema);
