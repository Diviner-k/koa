//导入 koa -router
const Router = require("koa-router");

// 控制器
const { uploadImg } = require("../controller/upload");
// 中间件
const { auth } = require("../middleware/authMiddleware");
const { getFileName } = require("../middleware/uploadMIddleware");
// 实例化 Router示例 并添加前缀
const router = new Router({ prefix: "/upload" });

router.post("/image", getFileName, uploadImg);

module.exports = router;
