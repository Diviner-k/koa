const mongoose = require("mongoose");

// 定义离线消息模型
const OfflineMessageSchema = new mongoose.Schema({
  from: mongoose.Schema.Types.ObjectId,
  to: mongoose.Schema.Types.ObjectId,
  read: { type: Boolean, default: false },
  connectionType: { type: String, enum: ["oneToOne", "group"] },
  contentType: { type: String, enum: ["text", "image", "emoji"] }, // 消息内容类型
  content: String, // 如果是文本消息，存储文本内容；如果是图片，存储图片地址；如果是表情，存储表情编码
  timestamp: { type: Date, default: Date.now },
  groupId: mongoose.Schema.Types.ObjectId,
});

const OfflineMessage = mongoose.model("OfflineMessage", OfflineMessageSchema);

module.exports = OfflineMessage;
