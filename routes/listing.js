
const express = require('express');


const Listing = require('../models/listing');


const router = express.Router();
const wrapAsync = require('../utils/wrapAsync.js');
const ExpressError = require('../utils/ExpressError.js');
const { listingSchema } = require('../schema.js');




const validateListing = (req, res, next) => {
     let {error} = listingSchema.validate(req.body);
    if (error) {
        let msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(400, msg);
    } else {
        next();
    }
}
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