const mongoose = require("mongoose");

const BrandSchema = new mongoose.Schema({
  _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
  name: { type: String, required: true },
  image: { type: String, required: true },
  story: { type: String },
  gridImage1: { type: String },
  gridImage2: { type: String },
  gridImage3: { type: String },
  client: { type: String },
  publishedDate: { type: String },
});

module.exports = mongoose.model("Brand", BrandSchema);