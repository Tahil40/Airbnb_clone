const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const listingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  image: {
    type: String,
    required: true,
    default: "https://cdn.pixabay.com/photo/2025/09/07/14/57/evil-queen-9820638_1280.jpg",
    set: (default_value) => default_value ===  "" ? "https://cdn.pixabay.com/photo/2025/09/07/14/57/evil-queen-9820638_1280.jpg" : default_value
  },
  location: String,
  price: Number,
  country: String,
});

module.exports = mongoose.model("Listing Schema", listingSchema);
