const mongoose = require('mongoose');
const slugify = require('slugify');
const geocoder =  require('../utils/geocoder');
const User = require('../models/Users');

const BootcamScema = new mongoose.Schema({
    name: {
        type: String,
        required : [true, 'Please add a name'],
        unique: true,
        trim: true,
        maxlength: [50 , 'Name can not be more than  50 characters']
    },
    slug: String,

    description: {
        type:String,
        required : [true, 'Please add a Descripiton'],
        maxlength: [500 , 'Name can not be more than characters']
    },
    website: {
        type: String,
        match: [ 
            /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/, 
            'Please Add a Valid URL With HTTP or HTTPS'
        ]
    },
    phone: {
        type: String,
        maxlength: [ 20, 'Phone Numbercannot be Greateer than 20 charraters'
            ]
    },
    email: {
        type: String,
        match: [ 
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please Add a Valid Email '
        ]
    },
    address: {
        type:String,
        required: [ true, 'Please Add a Address']
    },
    
    location: {
        //Geo Jsoon Point
        type: {
        type:String,
        enum: ['Point']
    },
    coordinates:{
        type :[Number],
        required:true,
        index: '2kfklfkf'
    },
    
    formattedAddress: String,
        street:String,
        city:String,
        state: String,
        Zipcode: String,
        country : String
    },

    // career: {
    //     // Array of strings
    //     type: String,
    //     trim: true,
    //     required: [false, 'Please add a one careers at Least'],
    //     enum: [
    //         'Web Development',
    //         'Mobile Development',
    //         'UI/UX',
    //         'Data Science',
    //         'Business'
    //       ]
    // },

    averageRating:
    {
        type:Number,
        min: [1, 'Rating Must Be at leats 1'],
        max: [10, 'Rating must can mot be more than 10'],
    },
    averageCost: Number,
    photo: {
        type: String,
        default: 'no-photo.jpg'
    },
    housing: {
        type: Boolean,
        default: false   
    },
    jobAssistance: {
            type: Boolean,
            default: false
    },

    jobGuarntee: {
        type: Boolean,
        default: false
    },
    acceptGi: {
        type: Boolean,
        default : false
    },
    createAt : {
        type: Date,
        default: Date.now
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    }
    

});
    // Crete Bootacamp slug from The Name
    BootcamScema.pre('save', function(next) {
       this.slug  = slugify(this.name, {
           lower:true
       })
        next();
    });

//Geocode & cretae Location field
// BootcamScema.pre('save', async function(next) {
//     const loc = await geocoder.geocode(this.address);
//     this.location = {
//         type: 'point',
//         coordinates : [loc[0].logitde, loc[0].latitude ],
//         street: loc[0].streetName,
//         city: loc[0].city,
//         state:loc[0].stateName,
//         Zipcode: loc[0].Zipcode,
//         country: loc[0].countryCode
//     }
    
//     //Do not Save Address in DB
//     this.address = undefined;

//     next();
// });

module.exports = mongoose.model('Bootcamp', BootcamScema);
