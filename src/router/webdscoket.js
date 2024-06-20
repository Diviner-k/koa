const Router = require("koa-router");
const { list, createGroup, joinGroup } = require("../service/wsServer");
// 路由实例  prefix:路由前缀
const router = new Router({ prefix: "/ws" });
// 消息列表
router.get("/list/:id", list);
// 创建群聊
router.post("/group/create", createGroup);
// 加入群聊
router.post("/group/joinGroup", joinGroup);
module.exports = router;
