// 导入 koa
const Koa = require("koa");

const KoaStatic = require("koa-static");
const errHandler = require("./errHandler");
const { koaBody } = require("koa-body");
const parameter = require("koa-parameter");
const path = require("path");

const { wsServer } = require("../service/wsServer");
// 路由统一导入
const router = require("../router");

const websockify = require("koa-websocket");

//实例化 koa 应用实例 ,并把实例传入 websockify
const app = websockify(new Koa());
// const app = new Koa();
// 实例化router

// 注册 KoaBody 中间件 解析 body
app.use(
  koaBody({
    multipart: true, // 支持文件上传
    formidable: {
      uploadDir: path.join(__dirname, "../../public/upload"), // 上传文件存放目录
      keepExtensions: true, // 是否保留扩展名 默认false
      multiples: true, // 是否支持多文件上传
    },
  })
);
app.use(KoaStatic(path.join(__dirname, "../../public")));

// 参数校验中间件
app.use(parameter(app));

wsServer(app);
// 注册路由
app.use(router.routes()).use(router.allowedMethods());
// 错误监听 处理
app.on("error", errHandler);
// 导出app 应用实例
module.exports = app;
