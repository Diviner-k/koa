const mongoose = require("mongoose");
const BannerSchema = new mongoose.Schema({
  image: String,
  num: Number,
  isDelete: {
    type: Boolean,
    required: false,
  },
});

module.exports = mongoose.model("banner", BannerSchema);
