const mongoose = require("mongoose");
const { DB_HOST, DB_PROT, DB_NAME } = require("../config/config.default");
// mongoose.connect(`mongodb://${DB_HOST}:${DB_PROT}/${DB_NAME}`);
mongoose.connect(
  `mongodb+srv://k13627082604:nWINkzcn5DvGlu1s@kg.wdyxahj.mongodb.net/?retryWrites=true&w=majority&appName=kg`
);
const db = mongoose.connection;

module.exports = (success, error) => {
  if (typeof error !== "function") {
    error = () => {
      console.log("mongodb error  数据库连接失败");
    };
  }
  db.once("open", () => {
    console.log("数据库链接成功");
    success();
  });
  db.on("error", () => {
    error();
  });
};
