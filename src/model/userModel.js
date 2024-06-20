const mongoose = require("mongoose");
// const CollectLikeModel = require("../model/collectLikeModel");
const ArticleModel = require("../model/articleModel");
const UserSchema = mongoose.Schema(
  {
    account: {
      required: true,
      type: String,
    },
    username: {
      required: true,
      type: String,
    },
    password: {
      required: true,
      type: String,
    },
    isAdmin: {
      type: Number,
      enum: [1, 0],
      default: "",
    },
    avatar: {
      type: String,
    },
  },
  {
    timestamps: { createdAt: "createTime", updatedAt: "updateTime" },
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

UserSchema.virtual("myArticleNum", {
  // 参数1为加的虚拟字段名称
  ref: ArticleModel, //关联查询的集合
  localField: "_id", // 内键
  foreignField: "author", // 外键
  count: true, // count是否只显示总条数;  true为显示,   false为不显示
  match: (doc) => {
    return { author: doc._id, audit: true };
  },
});
// UserSchema.virtual("myCollectNum", {
//   // 参数1为加的虚拟字段名称
//   ref: CollectLikeModel, //关联查询的集合
//   localField: "_id", // 内键
//   foreignField: "userId", // 外键
//   count: true, // count是否只显示总条数;  true为显示,   false为不显示
//   match: (doc) => {
//     return { userId: doc._id, isCollections: true };
//   },
// });
// UserSchema.virtual("myLikeNum", {
//   // 参数1为加的虚拟字段名称
//   ref: CollectLikeModel, //关联查询的集合
//   localField: "_id", // 内键
//   foreignField: "userId", // 外键
//   count: true, // count是否只显示总条数;  true为显示,   false为不显示
//   // justOne: true,
//   match: (doc) => {
//     return {
//       userId: doc._id,
//       isLike: true,
//     };
//   },
// });

module.exports = mongoose.model("User", UserSchema);
