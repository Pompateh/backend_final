const mongoose = require("mongoose");

const TypefaceSchema = new mongoose.Schema({
    _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
  name: { type: String, required: true },
  designer: { type: String },
  publicOn: { type: String },
  version: { type: String },
  updateDate: { type: String },
  story: { type: String },
  features: { type: String },
  weights: [{ type: String }],
  fontFile: { type: String },
  images: [{ type: String }],
  capHeight: { type: String },
  xHeight: { type: String },
  baseLine: { type: String },
  descender: { type: String },
  image: { type: String },
  image1: { type: String },
  image2: { type: String },
  image3: { type: String },
  image4: { type: String },
  image5: { type: String }
});

module.exports = mongoose.model("Typeface", TypefaceSchema);