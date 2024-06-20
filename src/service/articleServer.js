const ArticleModel = require("../model/articleModel");
const moment = require("moment");
const Like = require("../model/like");
const Comment = require("../model/comment");
const Favorite = require("../model/favorite");
// schema 使用了 virtual 属性，需要在 populated 中填写对应的 字段名
// populated 有两种传参方式
//  1、 只有一个字段的情况 使用   path: stinge(字段名), " string string " : 过滤出的文档字段
// /2、多个子文档的查询并需要对单个字段进行处理情况  [
// path(第一个字段)，{
// path:string，第二个字段
// select: " string string " // 过滤出的文档字段
// ...
// }
// ]
const populateParams = [
  // "likeNum",
  // "collectNum",
  { path: "author", select: "username avatar" },
];
// 递归函数，构建评论树
const buildCommentTree = (comments, parentId = null) => {
  const tree = [];

  const filteredComments = comments.filter((comment) => {
    return (
      (comment.parentComment || "").toString() === (parentId || "").toString()
    );
  });

  for (const comment of filteredComments) {
    const replies = buildCommentTree(comments, comment._id);
    obj = comment.toObject();

    obj.createTime = moment(obj.createTime).format("YYYY-MM-DD HH:mm:ss");
    tree.push({ ...obj, replies });
  }

  return tree;
};

class ArticleServer {
  async createArticle(options) {
    try {
      const res = await ArticleModel.create(options);
      return res;
    } catch (error) {
      console.error(error);
    }
  }

  async getList(query) {
    const {
      pageSize = 10,
      pageNum = 1,
      likeUserId,
      favoriteUserId,
      searchVal,
      ...quer
    } = query;
    const result = {
      pageSize,
      pageNum,
      total: 0,
      list: [],
    };
    const q = { ...quer };
    likeUserId && (q.likeUsers = { $in: [likeUserId] });
    favoriteUserId && (q.favoriteUsers = { $in: [favoriteUserId] });
    var regex = new RegExp(searchVal);
    searchVal &&
      (q.$or = [
        { title: { $in: [regex] } },
        { nickName: { $in: [regex] } },
        { name: { $in: [regex] } },
        { gender: { $in: [regex] } },
        { phone: { $in: [regex] } },
        { work: { $in: [regex] } },
        { sterilization: { $in: [regex] } },
        { deworming: { $in: [regex] } },
        { vaccines: { $in: [regex] } },
        { addr: { $in: [regex] } },
        { variety: { $in: [regex] } },
        { condition: { $in: [regex] } },
        { article: { $in: [regex] } },
        { question: { $in: [regex] } },
      ]);
    // 查询符合条件的总数
    const total = await ArticleModel.countDocuments(q);
    result.total = total || 0;
    if (total > 0) {
      //  查询文档集合

      const res = await ArticleModel.find(q)
        .populate(populateParams)
        .skip((pageNum - 1) * pageSize)
        .limit(pageSize)
        .exec();

      result.list = res;
      return result;
    }
    return result;
  }
  /**
   * 根据id查看文章详情
   * @param {*}
   */
  async getDetailById(params) {
    try {
      const doc = await ArticleModel.findOne({ _id: params })
        .populate(populateParams)
        .exec();
      return doc;
    } catch (error) {
      console.log(error);
    }
  }

  /**
   *更新文章
   *@param {string} _id 文章索引
   *@param {object} params 更新条件
   */
  async updateArticle(_id, params) {
    const res = await ArticleModel.findByIdAndUpdate(
      _id,
      { $set: params }, // params 需要更新的数据
      { new: true } //  new: true  返回更新后的文档 ，false 返回更新前的文档
    );
    return res;
  }
  /**
   * 点赞/取消点赞
   */
  async likeArticle(ctx, params) {
    try {
      let { userId, articleId, likeUsers } = params;

      //检查用户是否已经点赞了文章
      let like = await Like.findOne({
        user: userId,
        article: articleId,
      });
      if (like) {
        // 查找并删除点赞记录
        like = await Like.findOneAndDelete({
          user: userId,
          article: articleId,
        });
        like = like.toObject();
        like.islike = false;
        likeUsers = (likeUsers || []).filter((id) => id != userId);
        like.likeUsers = likeUsers;
        await ArticleModel.findByIdAndUpdate(articleId, {
          $inc: { likes: -1 },
          $set: {
            likeUsers: likeUsers,
          },
        });
      } else {
        // 创建点赞记录
        like = new Like({ user: userId, article: articleId });
        await like.save();
        like = like.toObject();
        like.islike = true;
        likeUsers.push(userId);
        like.likeUsers = likeUsers;
        // 更新文章点赞数
        await ArticleModel.findByIdAndUpdate(articleId, {
          $inc: { likes: 1 },
          $set: {
            likeUsers: likeUsers,
          },
        });
      }

      return like;
    } catch (error) {
      console.log("likeArticle-error", error);

      ctx.throw(500, "Internal server error");
    }
  }
  /**
   * 收藏/取消收藏
   */
  async favoriteArticle(ctx, params) {
    try {
      let { userId, articleId, favoriteUsers } = params;
      // 检查用户是否已经收藏了文章
      let favorite = await Favorite.findOne({
        user: userId,
        article: articleId,
      });

      if (favorite) {
        // 查找并删除收藏记录
        favorite = await Favorite.findOneAndDelete({
          user: userId,
          article: articleId,
        });
        favorite = favorite.toObject();
        favorite.isfavorite = false;
        favoriteUsers = (favoriteUsers || []).filter((id) => id != userId);
        favorite.favoriteUsers = favoriteUsers;
        // 更新文章数据
        await ArticleModel.findByIdAndUpdate(articleId, {
          $inc: { favorites: -1 },
          $set: {
            favoriteUsers: favoriteUsers,
          },
        });
      } else {
        // 创建收藏记录
        favorite = new Favorite({ user: userId, article: articleId });
        await favorite.save();
        favorite = favorite.toObject();
        favorite.isfavorite = true;
        favoriteUsers.push(userId);
        favorite.favoriteUsers = favoriteUsers;
        // 更新文章数据
        await ArticleModel.findByIdAndUpdate(articleId, {
          $inc: { favorites: 1 },
          $set: {
            favoriteUsers: favoriteUsers,
          },
        });
      }

      return favorite;
    } catch (error) {
      console.log("favorite-error", error);

      ctx.throw(500, "Internal server error");
    }
  }
  /**
   * 评论
   */
  async commentArticle(params, ctx) {
    try {
      const { userId, articleId, content, parentComment, createTime } = params;
      // 创建评论记录
      const comment = new Comment({
        user: userId,
        article: articleId,
        content,
        parentComment,
        createTime,
      });

      // 如果提供了父评论的 ID，则表示这是一条回复评论
      if (parentComment) {
        comment.parentComment = parentComment;
      }

      await comment.save();

      // 更新相应文章的评论数
      await ArticleModel.findByIdAndUpdate(articleId, {
        $inc: { comments: 1 },
      });

      return comment;
    } catch (error) {
      ctx.throw(500, "Internal server error");
    }
  }
  /**
   * 删除评论
   */
  async deleteComment(params) {
    const { commentId } = params;
    try {
      // 查找并删除评论记录
      const comment = await Comment.findByIdAndDelete(commentId);
      if (!comment) {
        ctx.throw(404, "Comment not found");
      }
      // 如果评论有父评论，则更新父评论的回复数
      if (comment.parentComment) {
        await Comment.findByIdAndUpdate(comment.parentComment, {
          $inc: { replies: -1 },
        });
      }

      // 更新相应文章的评论数
      await ArticleModel.findByIdAndUpdate(comment.article, {
        $inc: { comments: -1 },
      });

      return comment;
    } catch (error) {
      ctx.throw(500, "Internal server error");
    }
  }
  /**
   * 评论列表
   */
  async getComments(articleId, ctx) {
    try {
      // 查询相应文章的所有评论
      const comments = await Comment.find({ article: articleId }).populate({
        path: "user",
        select: "username avatar",
      });
      // 使用 populate 方法填充 user 字段，以便返回用户信息
      // 构建评论树

      const commentTree = buildCommentTree(comments);
      return { list: commentTree, total: comments.length };
    } catch (error) {
      ctx.throw(500, "Internal server error");
    }
  }
}

module.exports = new ArticleServer();
