const {
  articleCreateError,
  articleDetailError,
  articleUpdateError,
  articleListError,
} = require("../constant/errType");

const {
  articleCreateSuccess,
  articleUpdateSuccess,
  articleListSuccess,
  articleDetailSuccess,
  articleLikeSuccess,
  articleFavoriteSuccess,
} = require("../constant/succType");

const {
  createArticle,
  getList,
  getDetailById,
  updateArticle,
  likeArticle,
  favoriteArticle,
  commentArticle,
  getComments,
} = require("../service/articleServer");

class ArticleController {
  async created(ctx, next) {
    try {
      const params = ctx.request.body;
      const res = await createArticle({
        ...params,
        author: ctx.state.userInfo._id,
        isDelete: false,
      });
      ctx.body = articleCreateSuccess({ result: res });
    } catch (error) {
      console.error(error);
      ctx.app.emit("error", articleCreateError, ctx);
    }
  }

  async list(ctx, next) {
    try {
      const params = ctx.request.body;
      const res = await getList({ ...params, isDelete: false });
      ctx.body = articleListSuccess({ result: res });
    } catch (error) {
      console.error(error);
      ctx.app.emit("error", articleListError, ctx);
    }
  }

  async detailById(ctx, next) {
    try {
      const _id = ctx.request.params.id;
      const res = await getDetailById(_id);
      ctx.body = articleDetailSuccess({ result: res });
    } catch (error) {
      console.error(error);
      ctx.app.emit("error", articleDetailError, ctx);
    }
  }
  async update(ctx, next) {
    try {
      const _id = ctx.request.params.id;
      const params = ctx.request.body;
      const res = await updateArticle(_id, params);
      ctx.body = articleCreateSuccess({ result: res });
    } catch (error) {
      console.error(error);
      ctx.app.emit("update-error", articleUpdateSuccess, ctx);
    }
  }
  async like(ctx) {
    try {
      // 点赞文章
      const { id } = ctx.params;
      const userId = ctx.state.userInfo._id; // 从请求体中获取用户 ID
      const { likeUsers } = ctx.request.body;
      const res = await likeArticle(ctx, { articleId: id, userId, likeUsers });
      console.log("11111111111", res);

      ctx.body = articleLikeSuccess({ result: res });
    } catch (error) {
      console.error(error);
      ctx.app.emit("like-error", articleLikeSuccess, ctx);
    }
  }
  async favorite(ctx) {
    try {
      // 点赞文章
      const { id } = ctx.params;
      const userId = ctx.state.userInfo._id; // 从请求体中获取用户 ID
      const { favoriteUsers } = ctx.request.body;
      const res = await favoriteArticle(ctx, {
        articleId: id,
        userId,
        favoriteUsers,
      });
      ctx.body = articleFavoriteSuccess({ result: res });
    } catch (error) {
      console.error(error);
      ctx.app.emit("favorite-error", articleFavoriteSuccess, ctx);
    }
  }
  async comment(ctx) {
    try {
      const { id } = ctx.params;
      const { userId, content, parentComment, createTime } = ctx.request.body; // 从请求体中获取用户 ID、评论内容和父评论的 ID
      const res = await commentArticle(
        {
          userId,
          content,
          parentComment,
          articleId: id,
          createTime,
        },
        ctx
      );
      ctx.body = articleFavoriteSuccess({ result: res });
    } catch (error) {
      console.error(error);
      ctx.app.emit("comment-error", articleFavoriteSuccess, ctx);
    }
  }
  async deleteComment(ctx) {
    try {
      const { id } = ctx.params;
      const { userId, content, parentComment } = ctx.request.body; // 从请求体中获取用户 ID、评论内容和父评论的 ID
      const res = await commentArticle(params);
      ctx.body = articleFavoriteSuccess({ result: res });
    } catch (error) {
      console.error(error);
      ctx.app.emit("deleteComment-error", articleFavoriteSuccess, ctx);
    }
  }
  async comments(ctx) {
    try {
      const { id } = ctx.params;
      const res = await getComments(id, ctx);

      ctx.body = articleFavoriteSuccess({ result: res });
    } catch (error) {
      console.error(error);
      ctx.app.emit("comments-error", articleFavoriteSuccess, ctx);
    }
  }
}

module.exports = new ArticleController();
