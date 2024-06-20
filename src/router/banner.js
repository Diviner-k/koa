const Router = require("koa-router");
const { add, updated, list } = require("../controller/banner");
// 路由实例  prefix:路由前缀
const router = new Router({ prefix: "/banner" });

router.post("/", add);
// banner列表
router.get("/list", list);
//更新
router.patch("/", updated);

module.exports = router;
