
const express = require('express');
const router = express.Router({ mergeParams: true });


const Listing = require('../models/listing');


const wrapAsync = require('../utils/wrapAsync.js');

const Review = require('../models/reviews.js');
const {validateReview, isLoggedIn, isAuthor} = require('../middleware.js');

const reviewController = require('../controllers/reviews.js');


//reviews
//post route
router.post('/',isLoggedIn,validateReview,wrapAsync(reviewController.createReview));
//delete reviews
//delete route
router.delete('/:reviewId',isLoggedIn, isAuthor,wrapAsync(reviewController.deleteReview));

module.exports = router;