const mongoose =  require('mongoose');

const ReviewScema = new mongoose.Schema({
    title: {
        type: String,
        trim: true,
        required: [true, 'Please add a  title For Review'],
        maxlength:100
    },

    text: {
        type: String,
        trim: true,
        required: [true, 'Please add a text']
    },
    rating: {
        type: Number,
        trim: true,
        min: 1,
        max: 10,
        required: [true, 'Please add a Rating between 1 and 10']
    },
    
    createdAt: {
        type: Date,
        default: Date.now
    },

    bootcamp: {
        type: mongoose.Schema.ObjectId,
        ref: 'Bootcamp',
        required: true
    },

    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    }
});

ReviewScema.index({ bootcamp:1, user : 1 }, { unique : true });

module.exports = mongoose.model('Reviews', ReviewScema);