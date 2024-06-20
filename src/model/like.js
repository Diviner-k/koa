const mongoose = require("mongoose");

const likeSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  article: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Article",
  },
});

const Like = mongoose.model("Like", likeSchema);
module.exports = Like;
