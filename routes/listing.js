
const express = require('express');


const Listing = require('../models/listing');


const router = express.Router();
const wrapAsync = require('../utils/wrapAsync.js');

const {isLoggedIn, isOwner} = require('../middleware.js');
const {validateListing} = require('../middleware.js');
const listingController = require('../controllers/listings.js');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

router.route('/').get(wrapAsync(listingController.index)).post(isLoggedIn,validateListing, wrapAsync(listingController.createListing));
//new route
router.get('/new', isLoggedIn , listingController.renderNewForm)
router.route("/:id").get(wrapAsync(listingController.showListing)).put( isLoggedIn,isOwner,validateListing, wrapAsync(listingController.updateListing)).delete(isLoggedIn,isOwner,wrapAsync(listingController.deleteListing))



//edit route
router.get('/:id/edit',isLoggedIn,isOwner,wrapAsync(listingController.renderEditForm))



module.exports = router;