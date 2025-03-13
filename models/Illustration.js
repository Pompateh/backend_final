const mongoose = require("mongoose");

const IllustrationSchema = new mongoose.Schema({
    _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
  name: { type: String, required: true },
  image: { type: String, required: true },
  image1: { type: String, required: true },
  image2: { type: String, required: true },
  image3: { type: String, required: true },
  story: { type: String },
  artist: { type: String },
  year: { type: String, required: true },
  style: { type: String }
});

module.exports = mongoose.model("Illustration", IllustrationSchema);