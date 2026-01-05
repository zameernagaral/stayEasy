const Listing = require('../models/listing');
const Review = require('../models/reviews');


module.exports.deleteReview = async (req, res, next) => {
    let { id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash("danger", "Successfully deleted a review");
    res.redirect(`/listings/${id}`);
}

module.exports.createReview = async (req, res, next) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    let newReview = new Review(req.body.review);
    newReview.author = res.locals.currentUser._id;
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    req.flash("success", "Successfully made a new review");
    res.redirect(`/listings/${listing._id}`);

}



