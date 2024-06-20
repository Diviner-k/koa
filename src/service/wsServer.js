const Message = require("../model/message");
const GroupMember = require("../model/groupMember");
const { clienWs, saveWsConnection, handleMsg } = require("../middleware/ws");
const wsServer = (app) => {
  console.log("wsServer");
  app.ws.use(clienWs);
  app.ws.use(saveWsConnection);
  app.ws.use(handleMsg);
};

const list = async (ctx, next) => {
  try {
    const id = ctx.request.params.id;
    console.log("id", id);
    const list = await getRecentMessagesWithUsers(id);
    console.log("list", list);
    ctx.body = {
      code: 200,
      message: "请求成功",
      result: list,
    };
  } catch (error) {
    console.log("message-list-error:", error);
    ctx.body({
      code: 500,
      message: "请求失败",
      result: null,
    });
  }
};

const createGroup = async (ctx, next) => {
  try {
    const { userId, groupName, avatar } = ctx.request.body;
    const group = new GroupMember({
      name: groupName,
      avatar,
      members: [userId],
    });

    await group.save();
    const message = new Message({
      from: userId,
      groupId: group._id,
      connectionType: "group",
      contentType: "text",
      content: "欢迎加入",
    });
    message.save();
    ctx.body = {
      code: 200,
      message: "创建成功",
      result: group,
    };
  } catch (error) {
    console.log("createGroup-error", error);
    ctx.body({
      code: 500,
      message: "创建失败",
      result: null,
    });
  }
};

const joinGroup = async (ctx, next) => {
  try {
    const { groupId, userId } = ctx.request.body;
    await GroupMember.findByIdAndUpdate(groupId, {
      $addToSet: { members: userId },
    });
    ctx.body = {
      code: 200,
      message: "加入成功",
      result: { groupId, userId },
    };
  } catch (error) {
    console.log("joinGroup-error", error);
    ctx.body({
      code: 500,
      message: "加入群聊失败",
      result: null,
    });
  }
};

module.exports = { wsServer, list, createGroup, joinGroup };
