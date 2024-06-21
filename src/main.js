// 导入配置
const { APP_HOST_PORT } = require("./config/config.default");
const { sendOfflineMessages } = require("./model/message");
const Koa = require("koa");
const url = require("url");
const os = require("os");
// 导入数据库链接
const db = require("./db/index");
// 链接成功回调
db(() => {
  // 导入 app 应用实例
  const app = require("./app");
  //
  const getServerIP = () => {
    const interfaces = os.networkInterfaces();
    let serverIP = "";

    // Iterate over interfaces
    for (const interfaceName in interfaces) {
      const interface = interfaces[interfaceName];
      // Iterate over each interface
      for (const iface of interface) {
        // Look for IPv4 and skip internal and loopback addresses
        if (
          iface.family === "IPv4" &&
          !iface.internal &&
          iface.address !== "127.0.0.1"
        ) {
          serverIP = iface.address;
          break;
        }
      }
      if (serverIP) break;
    }

    return serverIP;
  };
  // 监听http 服务
  const server = app.listen(APP_HOST_PORT, () => {
    const serverIP = getServerIP();
    console.log("server in running", serverIP, APP_HOST_PORT);
  });
  // WebSocket connection event listener
  // server.on("connection", (socket, request) => {
  //   // console.log("request", socket);
  //   // socket.userId = userId;
  //   // Send offline messages when user comes online
  //   // sendOfflineMessages(userId, socket);
  // });
});
