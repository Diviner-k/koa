const mongoose = require("mongoose");
// const ArticleModel = require("./articleModel");
const favoriteSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  article: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Article",
  },
});

const Favorite = mongoose.model("Favorite", favoriteSchema);
module.exports = Favorite;
