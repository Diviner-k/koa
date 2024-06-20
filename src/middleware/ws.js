const moment = require("moment");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
const User = require("../model/userModel");
const Message = require("../model/message");
// 在WebSocket中间件之前定义一个全局变量来存储用户ID和WebSocket连接的映射
const UserWebSocketMap = require("../model/userWebSocket");
const OfflineMessage = require("../model/offlineMessag");
const GroupMember = require("../model/groupMember");

// 在WebSocket中间件之前定义一个全局变量来存储用户ID和WebSocket连接的映射
const usersWebSocketMap = new Map();
// 连接
const clienWs = async (ctx, next) => {
  try {
    console.log("userId", ctx.query.userId);
    console.log("socketId", ctx.query.socketId);
    ctx.user = await User.findById(ctx.query.userId); // Assuming userId is passed as query param
    // console.log("ctx.user", ctx.user);
    if (!ctx.user) {
      ctx.websocket.send(JSON.stringify({ error: "Unauthorized" }));
      ctx.websocket.close();
    } else {
      // 处理 WebSocket 连接
      ctx.websocket.send("连接成功");
      usersWebSocketMap.set(ctx.query.socketId, ctx.websocket);

      await next();
    }
  } catch (error) {
    console.log("clienWs - error", error);
  }
};

// 在WebSocket中间件中，处理连接建立时，将用户ID和WebSocket连接添加到数据库中
const saveWsConnection = async (ctx, next) => {
  const userId = ctx.user.id;
  const socketId = ctx.query.socketId;

  if (userId && socketId) {
    // 存储映射关系到数据库
    await UserWebSocketMap.findOneAndUpdate(
      { userId },
      { socketId },
      { upsert: true }
    );
  }
  await next();
};

const handleMsg = async (ctx, next) => {
  // 处理离线消息
  sendOfflineMessages(ctx, next);
  // 接收消息
  ctx.websocket.on("message", async (data) => {
    const messageData = JSON.parse(data);
    const { connectionType } = messageData;
    // console.log("messageData", messageData);
    // console.log("connectionType：", connectionType);

    // 根据连接类型进行不同的处理
    switch (connectionType) {
      case "messageList":
        await getRecentMessagesWithUsers(ctx.user.id, ctx.websocket);
        break;
      case "history":
        const { userId, toId, groupId } = messageData;
        await getChatHistory(messageData, ctx.websocket);
        break;
      case "oneToOne":
        // 处理一对一消息
        handleOneToOneMessage(messageData);
        break;
      case "group":
        // 处理群消息
        handleGroupMessage(messageData);
        break;
      // case "creatGroup":
      //   // 处理群消息
      //   creatGroup(messageData);
      //   break;
      default:
        console.log("Unknown connection type:", connectionType);
    }
  });
};

// 获取与当前用户发送过消息的用户列表，并返回每个用户的最新一条消息
async function getRecentMessagesWithUsers(userId, ws) {
  try {
    // 聚合查询，按照 from 或 to 字段匹配当前用户的消息，并分组计算每个用户的最新一条消息
    let recentMessages = [];
    // 将 userId 转换成 ObjectId 类型
    const userObjectId = new ObjectId(userId);

    // 查询与当前用户有关的所有消息，包括发送和接收
    const onlineMessages = await Message.find({
      $or: [{ from: userObjectId }, { to: userObjectId }],
    }).sort({ timestamp: -1 });
    const onlineGroupMessage = await GroupMember.find({
      members: { $in: [userObjectId] },
    });
    // console.log("onlineGroupMessage", onlineGroupMessage);

    const offlineMessages = await OfflineMessage.find({
      to: userId,
      read: false,
    }).sort({
      timestamp: -1,
    });

    // 将在线和离线消息合并，并按时间倒序排序
    const allMessages = onlineMessages
      .concat(onlineGroupMessage)
      .concat(offlineMessages)
      .sort((a, b) => b.timestamp - a.timestamp);

    // 使用 Map 对象存储每个聊天对应的消息列表和离线消息数量
    const chatMap = new Map();

    allMessages.forEach((message) => {
      const { from, to, _id } = message;
      const key =
        !from && !to
          ? _id.toString()
          : from.toString() === userId
          ? to?.toString()
          : from?.toString();

      if (!chatMap.has(key)) {
        chatMap.set(key, { messages: [], offlineMessagesCount: 0 });
      }
      chatMap.get(key).messages.push({
        chat: message,
        type: message.to ? "onToOne" : "group",
      });
      if (
        message instanceof OfflineMessage &&
        ((message.to && message.to.toString() === userId) ||
          (message.groupId && message.groupId.toString() === userId))
      ) {
        chatMap.get(key).offlineMessagesCount++;
      }
    });
    // console.log("allMessages", allMessages);
    // console.log("chatMap", chatMap);

    // 查询对应的用户信息，并构建聊天列表
    const chatList = [];
    for (const [key, obj] of chatMap) {
      // 获取最近一条消息（在线或离线）
      const firstObj = obj.messages[0]; // 最近一条消息在排序后的第一条
      if (firstObj.type === "onToOne") {
        const user = await User.findById(key);

        const timestamp = firstObj.chat.timestamp;
        const time = isTimestampBeforeToday(timestamp)
          ? moment(timestamp).format("MM-DD")
          : moment(timestamp).format("HH:mm");
        if (user) {
          chatList.push({
            user,
            latestMessage: {
              ...firstObj.chat.toObject(),
              time: time,
            },
            offlineMessagesCount: obj.offlineMessagesCount,
          });
        }
      } else {
        const groupInfo = await GroupMember.findById(key);
        // 获取最近一条消息（在线或离线）

        const timestamp = firstObj.chat.timestamp;
        const time = isTimestampBeforeToday(timestamp)
          ? moment(timestamp).format("MM-DD")
          : moment(timestamp).format("HH:mm");
        if (groupInfo) {
          chatList.push({
            groupInfo,
            latestMessage: {
              ...firstObj.chat.toObject(),
              time: time,
            },
            offlineMessagesCount: obj.offlineMessagesCount,
          });
        }
      }
    }

    // 返回结果
    return ws.send(
      JSON.stringify({
        connectionType: "messageList",
        result: chatList,
      })
    );
  } catch (error) {
    console.error("Error getting recent messages with users:", error);
    return ws.send(
      JSON.stringify({
        connectionType: "messageList",
        result: [],
      })
    );
  }
}

// 处理一对一消息
function handleOneToOneMessage(messageData) {
  const { from, to, contentType, content } = messageData;

  // 存储消息到数据库
  const message = new Message({
    from,
    to,
    contentType,
    content,
    timestamp: Date.now(),
  });
  message
    .save()
    .then(async () => {
      // 查找接收者的 WebSocket 连接并发送消息
      const receiverWebSocket = await findWebSocketByUserId(to);
      console.log("receiverWebSocket", receiverWebSocket);

      if (receiverWebSocket) {
        receiverWebSocket.send(
          JSON.stringify({ connectionType: "oneToOne", result: messageData })
        );
      } else {
        // 如果接收者离线，则存储离线消息到数据库中
        saveOfflineMessage({ ...messageData, connectionType: "oneToOne" });
      }
    })
    .catch((error) => {
      console.error("Error saving message:", error);
    });
}

// 处理群消息
function handleGroupMessage(messageData) {
  const { from, groupId, contentType, content } = messageData;

  // 存储消息到数据库
  const message = new Message({
    from,
    groupId,
    connectionType: "group",
    contentType,
    content,
  });
  message
    .save()
    .then(async () => {
      // 查找群组成员的 WebSocket 连接并发送消息
      const groupMembers = await findGroupMembersByGroupId(groupId);
      groupMembers.forEach(async ({ members }) => {
        members.forEach(async (userId) => {
          const memberWebSocket = await findWebSocketByUserId(userId);
          if (memberWebSocket) {
            memberWebSocket.send(JSON.stringify(messageData));
          } else {
            // 如果群组成员离线，则存储离线消息到数据库中
            const offlineMessage = new OfflineMessage({
              groupId,
              from,
              to: userId, // 群消息的接收者为群组成员
              connectionType: "group",
              contentType,
              content,
            });
            offlineMessage.save().catch((error) => {
              console.error("Error saving offline message:", error);
            });
          }
        });
      });
    })
    .catch((error) => {
      console.error("Error saving message:", error);
    });
}

// 一对一 保存离线消息的功能
async function saveOfflineMessage(messageData) {
  const offlineMessage = new OfflineMessage(messageData);
  await offlineMessage.save();
}

// 用户上线发送消息
async function sendOfflineMessages(ctx, next) {
  // 假设客户端连接时会发送用户ID
  const userId = ctx.query.userId;
  // 发送欢迎消息
  ctx.websocket.send(
    JSON.stringify({
      type: "welcome",
      content: "Welcome to the chat!",
    })
  );
  await next();
}

// 实现辅助函数，根据用户ID查找WebSocket连接
async function findWebSocketByUserId(userId) {
  console.log("findWebSocketByUserId -- id", userId);
  try {
    const userSocketMap = await UserWebSocketMap.findOne({ userId });
    // console.log("userSocketMap", userSocketMap);
    if (userSocketMap) {
      // 从数据库中获取socketId，然后从全局的WebSocket连接中获取WebSocket对象
      // console.log("usersWebSocketMap", usersWebSocketMap);

      return usersWebSocketMap.get(userSocketMap.socketId);
    }

    return null;
  } catch (error) {
    console.log("findWebSocketByUserId--error", error);
  }
}

// 根据群组ID查找群组成员
async function findGroupMembersByGroupId(groupId) {
  try {
    const groupMembers = await GroupMember.find({ _id: groupId });
    return groupMembers;
  } catch (error) {
    console.error("Error finding group members:", error);
    return [];
  }
}

// 根据用户ID或群组ID获取聊天记录
async function getChatHistory({ userId, toId, groupId }, WS) {
  try {
    let chatHistory = [];

    if (userId && toId) {
      // 查询与指定用户相关的聊天记录（一对一消息）
      // 将 userId 转换成 ObjectId 类型
      const userIdObjectId = new ObjectId(userId);
      const toIdObjectId = new ObjectId(toId);
      await hanldeOfflineMessage(
        {
          connectionType: "oneToOne",
          toId,
          userId,
        },
        WS
      );

      chatHistory = await Message.aggregate([
        {
          $match: {
            $or: [
              { from: userIdObjectId, to: toIdObjectId },
              { from: toIdObjectId, to: userIdObjectId },
            ],
          },
        },
        {
          $addFields: {
            time: {
              $cond: {
                if: {
                  $gte: [
                    "$timestamp",
                    new Date(new Date().setUTCHours(0, 0, 0, 0)),
                  ],
                }, // 判断是否是今天
                then: {
                  $dateToString: {
                    format: "%H:%M:%S",
                    date: { $toDate: { $toLong: "$timestamp" } },
                    timezone: "Asia/Shanghai",
                  },
                }, // 今天内的消息返回时分秒
                else: {
                  $dateToString: {
                    format: "%Y-%m-%d",
                    date: { $toDate: { $toLong: "$timestamp" } },
                    timezone: "Asia/Shanghai",
                  },
                }, // 今天之前的消息返回日期
              },
            },
          },
        },
        {
          $sort: { timestamp: 1 }, // 根据 timestamp 字段排序
        },
      ]);

      // console.log("chatHistory", chatHistory);
    } else if (groupId) {
      await hanldeOfflineMessage(
        {
          connectionType: "group",
          groupId,
        },
        WS
      );
      // 查询指定群组的聊天记录（群消息）

      chatHistory = await Message.aggregate([
        { $match: { groupId: new ObjectId(groupId) } },
        {
          $lookup: {
            from: "users",
            localField: "from",
            foreignField: "_id",
            as: "userInfo",
          },
        },
        {
          $unwind: "$userInfo",
        },
        {
          $project: {
            _id: 1,
            groupId: 1,
            from: 1,
            content: 1,
            contentType: 1,
            timestamp: 1,
            "userInfo._id": 1,
            "userInfo.account": 1,
            "userInfo.username": 1,
            "userInfo.avatar": 1,
          },
        },
        {
          $sort: { timestamp: 1 },
        },
      ]);
      // .find({ groupId })
      // .sort({ timestamp: 1 })
      // .exec();

      //  添加发送消息的 - 头像信息
      // await chatHistory.forEach(async (item) => {
      //   try {
      //     const userInfo = await User.findById(item.from);

      //     item.fromAvatar = userInfo.avatar;
      //     item.fromName = userInfo.username;

      //     console.log("--", chatHistory);
      //   } catch (error) {
      //     console.log("--===", error);
      //   }
      // });
    } else {
      throw new Error("Must provide either userId or groupId");
    }

    return WS.send(
      JSON.stringify({
        connectionType: "history",
        result: chatHistory,
      })
    );
  } catch (error) {
    console.error("Error getting chat history:", error);
    return WS.send(
      JSON.stringify({
        connectionType: "history",
        result: [],
      })
    );
  }
}

async function hanldeOfflineMessage(
  { connectionType, toId, userId, groupId },
  WS
) {
  if (connectionType === "oneToOne") {
    // 查询数据库获取未读的离线消息（一对一消息）
    const offlineMessagesOneToOne = await OfflineMessage.aggregate([
      {
        $match: {
          $or: [
            { from: new ObjectId(userId), to: new ObjectId(toId) },
            { from: new ObjectId(toId), to: new ObjectId(userId) },
          ],
          $and: [{ read: false }, { connectionType: "oneToOne" }],
        },
      },
    ]);

    // 发送一对一离线消息给用户
    offlineMessagesOneToOne.forEach(async (message) => {
      // console.log("message", message);

      // 将离线消息标记为已读
      await OfflineMessage.updateOne({ _id: message._id }, { read: true });
    });
  }
  if (connectionType === "group") {
    // 查询数据库获取未读的离线消息（群消息）
    const offlineMessagesGroup = await OfflineMessage.find({
      groupId: new ObjectId(groupId),
      connectionType: "group",
    });

    // 发送群离线消息给用户
    offlineMessagesGroup.forEach(async (message) => {
      // 将离线消息标记为已读
      await OfflineMessage.updateOne({ _id: message._id }, { read: true });
      await message.save();
    });
  }
  // 更新用户的在线状态
  await User.updateOne({ _id: toId }, { online: true });
}

// 判断时间戳是否在今天之前
function isTimestampBeforeToday(timestamp) {
  // 将时间戳转换为日期对象
  const date = new Date(timestamp);

  // 获取今天的日期对象
  const today = new Date();
  today.setHours(0, 0, 0, 0); // 设置为当天的午夜 00:00:00

  // 比较时间戳的日期是否在今天之前
  return date < today;
}
module.exports = {
  clienWs,
  saveWsConnection,
  handleMsg,
  sendOfflineMessages,
};
