const Listing = require("../models/listing");

/**
 * SHOW ALL LISTINGS
 */
module.exports.index = async (req, res) => {
  const listings = await Listing.find({});
  return res.render("listings/index.ejs", {
    listings,
    category: "all",
  });
};

module.exports.filterListing = async (req, res) => {
  const { category } = req.query;

  // If no category or "all", show everything
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

/**
 * SEARCH LISTINGS
 */
module.exports.searchListing = async (req, res) => {
  const { q } = req.query;

  // Guard: empty search should not break regex
  if (!q) {
    return res.redirect("/listings");
  }

  const listings = await Listing.find({
    $or: [
      { title: { $regex: q, $options: "i" } },
      { location: { $regex: q, $options: "i" } },
      { category: { $regex: q, $options: "i" } },
    ],
  });

  return res.render("listings/index.ejs", {
    listings,
    category: "all",
  });
};

/**
 * RENDER NEW LISTING FORM
 */
module.exports.renderNewForm = (req, res) => {
  res.render("listings/new.ejs");
};

/**
 * CREATE LISTING
 */
module.exports.createListing = async (req, res) => {
  const { path: url, filename } = req.file;

  const newListing = new Listing(req.body.listing);
  newListing.owner = req.user._id;
  newListing.image = { url, filename };

  await newListing.save();

  req.flash("success", "Successfully made a new listing");
  return res.redirect("/listings");
};

/**
 * SHOW SINGLE LISTING
 */
module.exports.showListing = async (req, res) => {
  const { id } = req.params;

  const listing = await Listing.findById(id)
    .populate({
      path: "reviews",
      populate: { path: "author" },
    })
    .populate("owner");

  if (!listing) {
    req.flash("danger", "Listing not found");
    return res.redirect("/listings");
  }

  // Safety: avoid EJS crashing if reviews is missing
  listing.reviews = listing.reviews || [];

  res.render("listings/show.ejs", { listing });
};

/**
 * RENDER EDIT FORM
 */
module.exports.renderEditForm = async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);

  if (!listing) {
    req.flash("danger", "Listing not found");
    return res.redirect("/listings");
  }

  let originalImageUrl = listing.image?.url;

  // Cloudinary optimization preview
  if (originalImageUrl && originalImageUrl.includes("/upload")) {
    originalImageUrl = originalImageUrl.replace(
      "/upload",
      "/upload/w_250"
    );
  }

  return res.render("listings/edit.ejs", {
    listing,
    originalImageUrl,
  });
};

/**
 * UPDATE LISTING
 */
module.exports.updateListing = async (req, res) => {
  const { id } = req.params;

  const listing = await Listing.findByIdAndUpdate(
    id,
    req.body.listing,
    { runValidators: true, new: true }
  );

  if (req.file) {
    listing.image = {
      url: req.file.path,
      filename: req.file.filename,
    };
  }

  await listing.save();

  req.flash("success", "Successfully updated a listing");
  res.redirect(`/listings/${listing._id}`);
};

/**
 * DELETE LISTING
 */
module.exports.deleteListing = async (req, res) => {
  const { id } = req.params;

  await Listing.findByIdAndDelete(id);

  req.flash("danger", "Successfully deleted a listing");
  res.redirect("/listings");
};
