const { number } = require("joi");
const Listing = require("../models/listing");

module.exports.index = async (req, res) => {
  const listings = await Listing.find({});
  return res.render("listings/index.ejs", {
    listings,
    category: "all",
  });
};


module.exports.filterListing = async (req, res) => {
  const { category } = req.query;

  if (!category || category === "all") {
    const listings = await Listing.find({});
    return res.render("listings/index.ejs", {
      listings,
      category: "all",
    });
  }

 const listings = await Listing.find({ category });
return res.render("listings/index.ejs", {
  listings,
  category,
});

};

module.exports.searchListing = async (req, res) => {
   const { q } = req.query;
  const listings = await Listing.find({
    $or: [
      { title: { $regex: q, $options: "i" } },
      { location: { $regex: q, $options: "i" } },
      { category: { $regex: q, $options: "i" } }
    ]
  });

  return res.render("listings/index", {
  listings,
  category: "all", // important
});

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
    newlisting.image = {url,filename}
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
let originalImageUrl = listing.image.url;
originalImageUrl = originalImageUrl.replace("/upload", "/upload/w_400");
    res.render('listings/edit', { listing,originalImageUrl });
}
module.exports.updateListing = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findByIdAndUpdate(
    id,
    req.body.listing, // ✅ FIX
    { runValidators: true, new: true }
  );
  if(typeof req.file !== 'undefined'){
     let url = req.file.path;
   let filename = req.file.filename;
   listing.image = {url,filename};
  }
  req.flash("success", "Successfully updated a listing");
  res.redirect(`/listings/${listing._id}`);
}
module.exports.deleteListing = async (req, res, next) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("danger", "Successfully deleted a listing");
    res.redirect('/listings');
}