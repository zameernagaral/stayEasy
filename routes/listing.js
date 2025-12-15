const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    Listing.find()
        .then(listings => {
            res.render('listings/index', { listings });
        })
        .catch(err => console.log(err));
});
router.get('/new', (req, res) => {
    res.render('listings/new');
})
router.post('/', validateListing, wrapAsync(async (req, res , next) => {
   
    const newlisting = new Listing(req.body.listing);
    await newlisting.save();
    res.redirect(`/listings`);
}));

router.delete('/:id', wrapAsync(async (req, res, next) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect('/listings');
}))

//reviews
//post route
router.post('/:id/reviews',validateReview,wrapAsync(async (req, res, next) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    let newReview = new Review(req.body.review);
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    res.redirect(`/listings/${listing._id}`);

}))
//delete reviews
//delete route
router.delete('/:id/reviews/:reviewId', wrapAsync(async (req, res, next) => {
    let { id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/listings/${id}`);
}))


router.get('/:id/edit', wrapAsync(async (req, res, next) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render('listings/edit', { listing });
}))

//update route
router.put('/:id',validateListing, wrapAsync(async (req, res, next) => {
    let { id } = req.params;
    const listing = await Listing.findByIdAndUpdate(id, req.body, { runValidators: true, new: true });
    res.redirect(`/listings/${listing._id}`);
}))

//Show Route
router.get('/:id', wrapAsync(async (req, res, next) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate('reviews');
    res.render('listings/show', { listing });
}))

module.exports = router;