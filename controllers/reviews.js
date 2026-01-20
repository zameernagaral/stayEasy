const Listing = require("../models/listing");
const Review = require("../models/reviews");

/**
 * CREATE REVIEW
 */
module.exports.createReview = async (req, res) => {
  const { id } = req.params;

  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash("danger", "Listing not found");
    return res.redirect("/listings");
  }

  const newReview = new Review(req.body.review);
  newReview.author = res.locals.currentUser._id;

  listing.reviews.push(newReview);

  await newReview.save();
  await listing.save();

  req.flash("success", "Successfully made a new review");
  res.redirect(`/listings/${listing._id}`);
};

/**
 * DELETE REVIEW
 */
module.exports.deleteReview = async (req, res) => {
  const { id, reviewId } = req.params;

  // Remove reference from listing
  await Listing.findByIdAndUpdate(id, {
    $pull: { reviews: reviewId },
  });

  // Remove actual review document
  await Review.findByIdAndDelete(reviewId);

  req.flash("danger", "Successfully deleted a review");
  res.redirect(`/listings/${id}`);
};
