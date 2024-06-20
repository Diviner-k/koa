const mongoose = require("mongoose");
const ArticleModel = require("./articleModel");
const commentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    article: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Article",
    },
    content: String,
    parentComment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment",
      default: null,
    },
  },
  {
    timestamps: { createdAt: "createTime", updatedAt: "updateTime" },
  }
);

const Comment = mongoose.model("Comment", commentSchema);
module.exports = Comment;
