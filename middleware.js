const Listing = require("./models/listing");
const ExpressError = require('./utils/ExpressError.js');
const { listingSchema } = require('./schema.js');
const {  reviewSchema } = require('./schema.js');
const Review = require("./models/reviews");
module.exports.isLoggedIn = (req, res, next) => {
    if(!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl;
        req.flash("danger", "You must be signed in first!");
        return res.redirect("/login");
    }
    next();
}

module.exports.saveRedirectUrl = (req, res, next) => {
    if (req.session.returnTo) {
        res.locals.returnTo = req.session.returnTo;
        
    }
    next();
}

module.exports.isOwner = async(req, res, next) => {
  let { id } = req.params;
    let listings = await Listing.findById(id);
    if (!listings.owner.equals(res.locals.currentUser._id)) {
      req.flash("error","You dont have permission to do that");
      return res.redirect(`/listings/${id}`);
    }
    next();
}
module.exports.isAuthor = async(req, res, next) => {
  let { id,reviewId } = req.params;
    let review = await Review.findById(reviewId);
    if (!review.author.equals(res.locals.currentUser._id)) {
      req.flash("error","You dont have permission to do that");
      return res.redirect(`/listings/${id}`);
    }
    next();
}
module.exports.validateListing = (req, res, next) => {
     let {error} = listingSchema.validate(req.body);
    if (error) {
        let msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(400, msg);
    } else {
        next();
    }
}
module.exports.validateReview = (req, res, next) => {
     let {error} = reviewSchema.validate(req.body);
    if (error) {
        let msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(400, msg);
    } else {
        next();
    }
}