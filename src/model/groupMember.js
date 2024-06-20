const mongoose = require("mongoose");

// 定义群组成员模型
const GroupMemberSchema = new mongoose.Schema({
  groupId: String,
  name: String,
  members: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  avatar: String,
  userId: String,
});

const GroupMember = mongoose.model("GroupMember", GroupMemberSchema);

module.exports = GroupMember;
