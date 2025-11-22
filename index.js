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
app.post('/listings', wrapAsync(async (req, res , next) => {
    const listing = await Listing.create(req.body);
    res.redirect(`/listings`);
}))
app.delete('/listings/:id', wrapAsync(async (req, res, next) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect('/listings');
}))
app.get('/listings/:id/edit', wrapAsync(async (req, res, next) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render('listings/edit', { listing });
}))
app.put('/listings/:id', wrapAsync(async (req, res, next) => {
    let { id } = req.params;
    const listing = await Listing.findByIdAndUpdate(id, req.body, { runValidators: true, new: true });
    res.redirect(`/listings/${listing._id}`);
}))
app.get('/listings/:id', wrapAsync(async (req, res, next) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render('listings/show', { listing });
}))

app.all("*", (req, res, next) => {
    next(new ExpressError(404, "Page not found"));
});


app.use((err, req, res, next) => {
    const { status = 500, message = 'Something went wrong' } = err;
    res.status(status).send(message);
});
app.listen(8080, () => {
    console.log('Server is running on port 8080');
});