// 导入配置
const { APP_HOST_PORT } = require("./config/config.default");
const { sendOfflineMessages } = require("./model/message");
const Koa = require("koa");
const url = require("url");
// 导入数据库链接
const db = require("./db/index");
// 链接成功回调
db(() => {
  // 导入 app 应用实例
  const app = require("./app");
  //

  // 监听http 服务
  const server = app.listen(APP_HOST_PORT, () => {
    console.log("server in running", APP_HOST_PORT);
  });
  // WebSocket connection event listener
  // server.on("connection", (socket, request) => {
  //   // console.log("request", socket);
  //   // socket.userId = userId;
  //   // Send offline messages when user comes online
  //   // sendOfflineMessages(userId, socket);
  // });
});
