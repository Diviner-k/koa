const mongoose = require("mongoose");
const messageSchema = new mongoose.Schema({
  from: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  to: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  contentType: { type: String, enum: ["text", "image", "emoji"] }, // 消息内容类型
  content: String, // 如果是文本消息，存储文本内容；如果是图片，存储图片地址；如果是表情，存储表情编码
  timestamp: { type: Date, default: Date.now },
  groupId: mongoose.Schema.Types.ObjectId,
});
module.exports = mongoose.model("Message", messageSchema);
