
const express = require('express');


const Listing = require('../models/listing');


const router = express.Router();
const wrapAsync = require('../utils/wrapAsync.js');

const {isLoggedIn, isOwner} = require('../middleware.js');
const {validateListing} = require('../middleware.js');


//index route
router.get('/', wrapAsync());

//new route
router.get('/new', isLoggedIn ,(req, res) => {

    res.render('listings/new.ejs');
})

//Create route
router.post('/', isLoggedIn,validateListing, wrapAsync(async (req, res , next) => {
   
    const newlisting = new Listing(req.body.listing);
    newlisting.owner = req.user._id;
    await newlisting.save();
    req.flash("success", "Successfully made a new listing");
    res.redirect(`/listings`);
}));

//delete route
router.delete('/:id', isLoggedIn,isOwner,wrapAsync(async (req, res, next) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("danger", "Successfully deleted a listing");
    res.redirect('/listings');
}))


//edit route
router.get('/:id/edit',isLoggedIn,isOwner,wrapAsync(async (req, res, next) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
      if(!listing){
        req.flash("danger", "Listing not found");
        return res.redirect('/listings');
    }
    res.render('listings/edit', { listing });
}))

//update route
router.put('/:id', isLoggedIn,isOwner,validateListing, wrapAsync(async (req, res) => {
  
  const listing = await Listing.findByIdAndUpdate(
    id,
    req.body.listing, // ✅ FIX
    { runValidators: true, new: true }
  );
  req.flash("success", "Successfully updated a listing");
  res.redirect(`/listings/${listing._id}`);
}));


//Show Route
router.get('/:id', wrapAsync(async (req, res, next) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate({path:'reviews',populate: {path:'author'}}).populate('owner');
    if(!listing){
        req.flash("danger", "Listing not found");
        return res.redirect('/listings');
    }
    res.render('listings/show', { listing });
}))

module.exports = router;