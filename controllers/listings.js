const Listing = require("../models/listing");

module.exports.index = async (req, res) => {
    const listings = await Listing.find({})
        res.render("listings/index.ejs", { listings });
}

module.exports.renderNewForm = (req, res) => {

    res.render('listings/new.ejs');
}

module.exports.showListing = async (req, res, next) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate({path:'reviews',populate: {path:'author'}}).populate('owner');
    if(!listing){
        req.flash("danger", "Listing not found");
        return res.redirect('/listings');
    }
    res.render('listings/show', { listing });
}
module.exports.createListing = async (req, res , next) => {
   let url = req.file.path;
   let filename = req.file.filename;
    const newlisting = new Listing(req.body.listing);
    newlisting.owner = req.user._id;
    await newlisting.save();
    req.flash("success", "Successfully made a new listing");
    res.redirect(`/listings`);
}
module.exports.renderEditForm = async (req, res, next) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
      if(!listing){
        req.flash("danger", "Listing not found");
        return res.redirect('/listings');
    }
    res.render('listings/edit', { listing });
}
module.exports.updateListing = async (req, res) => {
  
  const listing = await Listing.findByIdAndUpdate(
    id,
    req.body.listing, // ✅ FIX
    { runValidators: true, new: true }
  );
  req.flash("success", "Successfully updated a listing");
  res.redirect(`/listings/${listing._id}`);
}
module.exports.deleteListing = async (req, res, next) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("danger", "Successfully deleted a listing");
    res.redirect('/listings');
}