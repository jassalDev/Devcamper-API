const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const Course = require('../models/Course');
const Bootcamp = require('../models/bootcamp');

//@desc GET courses
//@route GET /api/v1/courses
//route GET /api/v1/bootcamps/: bootcampsId/courses
//@access Public

exports.getCourses = asyncHandler(async (req, res, next) => {

    if(req.params.bootcampId) {
        const courses = await Course.find({ bootcamp: req.params.bootcampId  });
        return res.status(200).json({
            success: true,
            count: courses.length,
            data: courses
        });
    }
    else {
        res.status(200).json(res.advancedResults);
    }
});

//@desc GET Single courses
//@route GET /api/v1/courses/:id
//@access Public

exports.getCourse = asyncHandler(async (req, res, next) => {
    const course  = await Course.findById(req.params.id).populate({
        path: 'bootcamp',
        select: 'name description'
    });
    
    if(!course){
        return next(
            new ErrorResponse (`No course with the ID of ${req.params.id}`),
            404
        )
    }
  
    res.status(200).json({
        success: true,
        data: course
    });
})

//@desc ADD courses
//@route GET /api/v1/bootcapms/bootcampId/courses
//@access Private

exports.addCourse = asyncHandler(async (req, res, next) => {
    req.body.bootcamp = req.params.bootcampId;
    req.body.user = req.user.id;

    const bootcamp  = await Bootcamp.findById(req.params.bootcampId);
   
    if(!bootcamp){
        return next(
            new ErrorResponse (`No bootcamp with the ID of ${req.params.bootcampId}`),
            404
        )
    }

    //Make sure user is Bootcamp owner
    if(bootcamp.user.toString() !==  req.user.id && req.user.role !== 'admin'){
        return next(
            new ErrorResponse (`User ${req.user.id} is not authorize to Add this Course to Bootcamp ${bootcamp._id}`), 401
        )
    }
    
    const course =  await  Course.create(req.body);
    
    res.status(200).json({
        success: true,
        data: course
    });
})

//@desc Update courses
//@route PUT /api/courses/:id
//@access Private

exports.deleteCourse = asyncHandler(async (req, res, next) => {

    const course  = await Course.findById(req.params.id);
  
    if(!course){
        return next(
            new ErrorResponse (`No Course  with the ID of ${req.params.id}`),
            404
        )
    }

    //Make sure user is course owner
    if(course.user.toString() !==  req.user.id && req.user.role !== 'admin'){
        return next(
            new ErrorResponse (`User ${req.user.id} is not authorize to Update this Course to course ${course._id}`), 401
        )
    }
        
    await course.remove();
    
    res.status(200).json({
        success: true,
        data: {}
    });
})

//@desc updateCourse courses
//@route updateCourse /api/courses/:id
//@access Private

exports.updateCourse = asyncHandler(async (req, res, next) => {
    let  course  = await Course.findById(req.params.id);
  
    if(!course){
        return next(
            new ErrorResponse (`No Course  with the ID of ${req.params.id}`),
            404
        )
    }

    //Make sure user is course owner
    if(course.user.toString() !==  req.user.id && req.user.role !== 'admin'){
        console.log(course.user);
        return next(
            new ErrorResponse (`User ${req.user.id} is not authorize to Delete this Course to course ${course._id}`), 401
        )
    }
   
    course = await Course.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    })


    res.status(200).json({
        success: true,
        data: course
    });
})