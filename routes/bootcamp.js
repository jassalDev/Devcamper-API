const express = require('express');
const router = express.Router();
const { Getbootcamp, Getbootcamps, Createbootcamps, UpdateBootcamp, DeleteBootcamp, bootcampPhotoUplaod}
 =  require('../controller/bootcamps')

//include other resource  router
const courseRouter = require('./courses');
const reviewRouter = require('./reviews');

const Bootcamp = require('../models/bootcamp');

const advancedResults = require('../middleware/advanceResult');
const { protect , authorize} = require('../middleware/auth');

//Re-route into other resource router 
router.use('/:bootcampId/courses', courseRouter)
router.use('/:bootcampId/reviews', reviewRouter)

router.route('/')
    .get(advancedResults(Bootcamp, 'courses'), Getbootcamps)
    .post(protect, authorize('publisher', 'admin'),  Createbootcamps);

router.route('/:id')
    .get(Getbootcamp)
    .put(protect, authorize('publisher', 'admin'), UpdateBootcamp)
    .delete(protect, authorize('publisher', 'admin'),  DeleteBootcamp);

//Upload photo
router.route('/:id/photo').put(protect, authorize('publisher', 'admin'),  bootcampPhotoUplaod);


module.exports = router;