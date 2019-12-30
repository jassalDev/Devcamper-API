const express = require('express');

const { getReviews, getReview, AddReview, UpdateReview, DeleteReview } =  require('../controller/reviews')

const router = express.Router({mergeParams: true});

const Reviews = require('../models/reviews')

const advancedResults = require('../middleware/advanceResult');
const { protect, authorize } = require('../middleware/auth');

router
    .route('/')
        .get(advancedResults(Reviews, {
            path:'bootcamp',
            select:'name description'
        }),
        getReviews)
            .post(protect, authorize('user', 'admin'), AddReview);
    
    router
        .route('/:id')
            .get(getReview)
        
            .put(protect, authorize('user', 'admin'), UpdateReview)
            .delete(protect, authorize('user', 'admin'), DeleteReview)
            
module.exports = router;