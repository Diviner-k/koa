const mongoose = require("mongoose");
// const CollectLikeModel = require("../model/collectLikeModel");
const ArticleSchema = mongoose.Schema(
  {
    type: {
      type: Number,
      required: true,
    },
    title: {
      type: String,
      required: false,
    },
    nickName: {
      type: String,
      required: false,
    },
    name: {
      type: String,
      required: false,
    },
    gender: {
      type: String,
      required: false,
    },
    age: {
      type: String,
      required: false,
    },
    phone: {
      type: String,
      required: false,
    },
    questionType: {
      type: String,
      required: false,
    },
    work: {
      type: String,
      required: false,
    },
    sterilization: {
      type: String,
      required: false,
    },
    deworming: {
      type: String,
      required: false,
    },
    vaccines: {
      type: String,
      required: false,
    },
    addr: {
      type: String,
      required: false,
    },
    variety: {
      type: String,
      required: false,
    },
    condition: {
      type: String,
      required: false,
    },
    article: {
      type: String,
      required: false,
    },
    question: {
      type: String,
      required: false,
    },
    imgList: [String],
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    likeUsers: {
      type: Array,
      default: [],
    },
    favoriteUsers: {
      type: Array,
      default: [],
    },
    audit: {
      type: Boolean,
      required: false,
    },
    isDelete: {
      type: Boolean,
      required: false,
    },
    likes: {
      type: Number,
      default: 0,
    },
    favorites: {
      type: Number,
      default: 0,
    },
    comments: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: { createdAt: "createTime", updatedAt: "updateTime" },
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// ArticleSchema.virtual("collectNum", {
//   // 参数1为加的虚拟字段名称
//   ref: CollectLikeModel, //关联查询的集合
//   localField: "_id", // 内键
//   foreignField: "articleId", // 外键
//   count: true, // count是否只显示总条数;  true为显示,   false为不显示
//   match: (doc) => {
//     return { articleId: doc._id, isCollections: true };
//   },
// });
// ArticleSchema.virtual("collectNum", {
//   // 参数1为加的虚拟字段名称
//   ref: CollectLikeModel, //关联查询的集合
//   localField: "_id", // 内键
//   foreignField: "articleId", // 外键
//   count: true, // count是否只显示总条数;  true为显示,   false为不显示
//   match: (doc) => {
//     return { articleId: doc._id, isCollections: true };
//   },
// });
// ArticleSchema.virtual("likeNum", {
//   // 参数1为加的虚拟字段名称
//   ref: CollectLikeModel, //关联查询的集合
//   localField: "_id", // 内键
//   foreignField: "articleId", // 外键
//   count: true, // count是否只显示总条数;  true为显示,   false为不显示
//   // justOne: true,
//   match: (doc) => {
//     return {
//       articleId: doc._id,
//       isLike: true,
//     };
//   },
// });

// // 下面这两句只有加上了， 虚拟字段才可以显性的看到，不然只能隐性使用
ArticleSchema.set("toObject", { virtuals: true });
ArticleSchema.set("toJSON", { virtuals: true });

module.exports = mongoose.model("article", ArticleSchema);
