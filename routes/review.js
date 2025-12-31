
const express = require('express');
const router = express.Router({ mergeParams: true });


const Listing = require('../models/listing');


const wrapAsync = require('../utils/wrapAsync.js');

const Review = require('../models/reviews.js');
const {validateReview} = require('../middleware.js');




//reviews
//post route
router.post('/',validateReview,wrapAsync(async (req, res, next) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    let newReview = new Review(req.body.review);
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    req.flash("success", "Successfully made a new review");
    res.redirect(`/listings/${listing._id}`);

}))
//delete reviews
//delete route
router.delete('/:reviewId', wrapAsync(async (req, res, next) => {
    let { id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash("danger", "Successfully deleted a review");
    res.redirect(`/listings/${id}`);
}))

module.exports = router;