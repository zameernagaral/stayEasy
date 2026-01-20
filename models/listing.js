const mongoose = require("mongoose");
const Review = require("./reviews");

const Schema = mongoose.Schema;

const listingSchema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true, // UX polish
  },

  description: {
    type: String,
    trim: true,
  },

  image: {
    url: String,
    filename: String,
  },

  price: {
    type: Number,
    min: 0, // safety
  },

  location: {
    type: String,
    trim: true,
  },

  country: {
    type: String,
    trim: true,
  },

  category: {
    type: String,
    enum: [
      "beach",
      "mountain",
      "city",
      "landmark",
      "forest",
      "snow",
      "nature",
      "urban",
    ],
    required: true,
  },

  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],

  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

/**
 * CASCADE DELETE REVIEWS
 * When a listing is deleted, remove all associated reviews
 */
listingSchema.post("findOneAndDelete", async (listing) => {
  if (listing && listing.reviews.length) {
    await Review.deleteMany({
      _id: { $in: listing.reviews },
    });
  }
});

module.exports = mongoose.model("Listing", listingSchema);
