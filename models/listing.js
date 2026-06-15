const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const review = require("./reviews");

const listingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  image: {
    filename: {
      type: String,
      default: "ListingImage",
    },
    url: {
      type: String,
      required: true,
      default:
        "https://cdn.pixabay.com/photo/2025/09/07/14/57/evil-queen-9820638_1280.jpg",
      set: (default_value) =>
        default_value === "" || !default_value
          ? "https://cdn.pixabay.com/photo/2025/09/07/14/57/evil-queen-9820638_1280.jpg"
          : default_value,
    },
  },
  location: String,
  price: Number,
  country: String,
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Reviews",
    },
  ],
});

listingSchema.post("findOneAndDelete", async (listing) => {
  if (listing) {
    await review.deleteMany({ _id: { $in: listing.reviews } });
  };
});

module.exports = mongoose.model("Listing Schema", listingSchema);
