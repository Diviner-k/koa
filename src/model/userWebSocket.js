const mongoose = require("mongoose");

const UserWebSocketMapSchema = new mongoose.Schema({
  userId: String,
  socketId: String,
});

const UserWebSocketMap = mongoose.model(
  "UserWebSocketMap",
  UserWebSocketMapSchema
);

module.exports = UserWebSocketMap;
