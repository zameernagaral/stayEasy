const mongoose = require('mongoose');
const express = require('express');
const app = express();
const path = require('path');
const methodOverride = require('method-override');
const Listing = require('./models/listing');
const Mongo_URL = 'mongodb://127.0.0.1:27017/stayeasy';
const ejsMate = require('ejs-mate');
const wrapAsync = require('./utils/wrapAsync.js');
const ExpressError = require('./utils/ExpressError.js');
const { listingSchema, reviewSchema } = require('./schema.js');
const Review = require('./models/reviews.js');

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.engine('ejs', ejsMate);



main()
    .then(() => console.log('Database connected'))
    .catch(err => console.log(err));

async function main() {
    await mongoose.connect(Mongo_URL);
}

app.get('/', (req, res) => {
    res.redirect('/listings');
});

const validateListing = (req, res, next) => {
     let {error} = listingSchema.validate(req.body);
    if (error) {
        let msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(400, msg);
    } else {
        next();
    }
}
const validateReview = (req, res, next) => {
     let {error} = reviewSchema.validate(req.body);
    if (error) {
        let msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(400, msg);
    } else {
        next();
    }
}

app.get('/listings', (req, res) => {
    Listing.find()
        .then(listings => {
            res.render('listings/index', { listings });
        })
        .catch(err => console.log(err));
});
app.get('/listings/new', (req, res) => {
    res.render('listings/new');
})
app.post('/listings', validateListing, wrapAsync(async (req, res , next) => {
   
    const newlisting = new Listing(req.body.listing);
    await newlisting.save();
    res.redirect(`/listings`);
}));
app.delete('/listings/:id', wrapAsync(async (req, res, next) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect('/listings');
}))

//reviews
//post route
app.post('/listings/:id/reviews',validateReview,wrapAsync(async (req, res, next) => {
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
app.delete('/listings/:id/reviews/:reviewId', wrapAsync(async (req, res, next) => {
    let { id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/listings/${id}`);
}))


app.get('/listings/:id/edit', wrapAsync(async (req, res, next) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render('listings/edit', { listing });
}))

//update route
app.put('/listings/:id',validateListing, wrapAsync(async (req, res, next) => {
    let { id } = req.params;
    const listing = await Listing.findByIdAndUpdate(id, req.body, { runValidators: true, new: true });
    res.redirect(`/listings/${listing._id}`);
}))

//Show Route
app.get('/listings/:id', wrapAsync(async (req, res, next) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate('reviews');
    res.render('listings/show', { listing });
}))

app.all("*", (req, res, next) => {
    next(new ExpressError(404, "Page not found"));
});


app.use((err, req, res, next) => {
    const { statusCode = 500, message = 'Something went wrong' } = err;
    res.status(statusCode).render("error.ejs",{message});
});
app.listen(8080, () => {
    console.log('Server is running on port 8080');
});