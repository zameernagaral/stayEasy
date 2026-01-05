
const express = require('express');


const Listing = require('../models/listing');


const router = express.Router();
const wrapAsync = require('../utils/wrapAsync.js');

const {isLoggedIn, isOwner} = require('../middleware.js');
const {validateListing} = require('../middleware.js');
const listingController = require('../controllers/listings.js');


//index route
router.get('/', wrapAsync(listingController.index));

//new route
router.get('/new', isLoggedIn , listingController.renderNewForm)

//Create route
router.post('/', isLoggedIn,validateListing, wrapAsync(listingController.createListing));

//delete route
router.delete('/:id', isLoggedIn,isOwner,wrapAsync(listingController.deleteListing))


//edit route
router.get('/:id/edit',isLoggedIn,isOwner,wrapAsync(listingController.renderEditForm))

//update route
router.put('/:id', isLoggedIn,isOwner,validateListing, wrapAsync(listingController.updateListing));


//Show Route
router.get('/:id', wrapAsync(listingController.showListing))

module.exports = router;