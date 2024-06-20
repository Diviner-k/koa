const mongoose = require("mongoose");
const ImageSchema = new mongoose.Schema({
  filename: String,
  url: String,
});

module.exports = mongoose.model("Image", ImageSchema);
