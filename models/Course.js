const mongoose =  require('mongoose');

const CourseScema = new mongoose.Schema({
    title: {
        type: String,
        trim: true,
        required: [true, 'Please add a course title']
        },

    description: {
        type: String,
        required: [true, 'Please add a description']
    },

    totalweeks: {
        type: Number,
        required: [true, 'Please add a Number of Totalweeks']
    },
    
    tuition: {
        type: Number,
        required: [true, 'Please add a tution Cost']
    },

    minimumSkill: {
        type: String,
        required: [true, 'Please add a minimum Skill'],
        enum: ['beginner', 'intermediate', 'advanced']
    },

    scholarshipAvailble: {
        type: Boolean,
        default: false
    },
    
    createdAt: {
        type: Date,
        default: Date.now
    },

    bootcamp: {
        type: mongoose.Schema.ObjectId,
        ref: 'Bootcamp',
        required: true
    }
});


module.exports = mongoose.model('Course', CourseScema);