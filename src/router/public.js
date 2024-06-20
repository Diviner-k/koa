//导入 koa -router
const Router = require("koa-router");
const path = require("path");
const fs = require("fs");
const mime = require("mime-types");
// 实例化 Router示例 并添加前缀
const router = new Router({ prefix: "/public" });
router.get("/upload/:fileName", async (ctx, next) => {
  const url = ctx.request.url;

  let filePath = path.join(__dirname, "../../" + url); //图片地址
  let file = null;
  try {
    file = fs.readFileSync(filePath); //读取文件
  } catch (error) {
    //如果服务器不存在请求的图片，返回默认图片
    filePath = path.join(__dirname, "/images/default.png"); //默认图片地址
    file = fs.readFileSync(filePath); //读取文件
  }

  let mimeType = mime.lookup(filePath); //读取图片文件类型
  ctx.set("content-type", mimeType); //设置返回类型
  ctx.body = file; //返回图片
});
module.exports = router;
