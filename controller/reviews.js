const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const Reviews = require('../models/reviews');
const Bootcamp = require('../models/bootcamp');

//@desc GET courses
//@route GET /api/v1/courses
//route GET /api/v1/bootcamps/: bootcampsId/courses
//@access Public

exports.getReviews = asyncHandler(async (req, res, next) => {

    if(req.params.bootcampId) {
        const reviews = await Reviews.find({ bootcamp: req.params.bootcampId  });
        return res.status(200).json({
            success: true,
            count: reviews.length,
            data: reviews
        });
    }
    else {
        res.status(200).json(res.advancedResults);
    }
});

//@desc GET Single review
//@route GET /api/v1/review/:id
//@access Public

exports.getReview = asyncHandler(async (req, res, next) => {
    const review  = await Reviews.findById(req.params.id).populate({
        path: 'bootcamp',
        select: 'name description'
    });
    
    if(!review){
        return next(
            new ErrorResponse (`No review with the ID of ${req.params.id}`, 404)            
        )
    }
  
    res.status(200).json({
        success: true,
        data: review
    });
})

//@desc POST Add Review
//@route POST /api/v1/bootcamps/:bootcampid/reviews
//@access Private

exports.AddReview = asyncHandler(async (req, res, next) => {
    req.body.bootcamp =  req.params.bootcampId;  
    req.body.user = req.user.id;

    const bootcamp = await Bootcamp.findById(req.params.bootcampId);

    if(!bootcamp){
        return next(
            new ErrorResponse (`No bootcamp with the ID of ${req.params.bootcampId}`, 404)            
        )
    }
    const review = await Reviews.create(req.body);
    
    res.status(201).json({
        success: true,
        data: review
    });
})


//@desc Update Review
//@route PUT /api/v1/reviews/:id
//@access Private
exports.UpdateReview = asyncHandler(async (req, res, next) => {
    let review = await Reviews.findById(req.params.id);

    if(!review){
        return next(
            new ErrorResponse (`No review with the ID of ${req.params.id}`, 404)            
        )
    }
   
    //Make sure review belong to user or user role is admin
    if( review.user.toString() != req.user.id && req.usr.role !== 'admin') {
        return next(
            new ErrorResponse (`Not authorized to update Review with role of ${req.user.role}`, 401)            
        )
    }
    
    review = await Reviews.findOneAndUpdate(req.params.id, req.body, {
        new: true, 
        runValidators: true
    })
    
    res.status(201).json({
        success: true,
        data: review
    });
})


//@desc Delete Review
//@route DELETE /api/v1/reviews/:id
//@access Private
exports.DeleteReview = asyncHandler(async (req, res, next) => {
    const review = await Reviews.findById(req.params.id);

    if(!review){
        return next(
            new ErrorResponse (`No review with the ID of ${req.params.id}`, 404)            
        )
    }
   
    //Make sure review belong to user or user role is admin
    if( review.user.toString() != req.user.id && req.usr.role !== 'admin') {
        return next(
            new ErrorResponse (`Not authorized to update Review with role of ${req.user.role}`, 401)            
        )
    }
    
    await review.remove()
    
    res.status(201).json({
        success: true,
        data: {}
    });
})