const Router = require("koa-router");

// 控制器
const {
  created,
  list,
  detailById,
  update,
  like,
  favorite,
  comment,
  deleteComment,
  comments,
} = require("../controller/article");

// 中间件
const { auth } = require("../middleware/authMiddleware");
const {
  filterEmtyParams,
  validateParams,
} = require("../middleware/validateMiddleware");
const { articleListRule } = require("../validateParamsRules/index");
const ArticleModel = require("../model/articleModel");
const Like = require("../model/like");
const Comment = require("../model/comment");
const Favorite = require("../model/favorite");
const router = new Router({ prefix: "/article" });
// TODO: 未进行参数校验
router.post("/add", auth, created);
router.post(
  "/list",
  auth,
  filterEmtyParams,
  // validateParams(articleListRule),
  list
);
// 根据id 查询详情
router.get("/:id", auth, detailById);
// 根据id 更新文章
router.put("/:id", auth, update);
// 点赞、取消点赞
router.post("/:id/like", auth, like);
// 收藏、取消收藏
router.post("/:id/favorite", auth, favorite);

// 评论
router.post("/:id/comment", auth, comment);
// 删除评论
router.delete("/comments/:id", auth, deleteComment);
// 根据文章id 获取评论列表
router.get("/:id/comments", auth, comments);

module.exports = router;
