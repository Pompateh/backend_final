const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
    _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String, required: true },
  image1: { type: String, required: true },
  image2: { type: String, required: true },
  image3: { type: String, required: true },
  type: { type: String, required: true },
  story: { type: String }
});

module.exports = mongoose.model("Product", ProductSchema);