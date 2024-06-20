const { TokenExpiredError } = require("jsonwebtoken");

module.exports = {
  userFormateError: {
    code: "10001",
    message: "用户或密码为空",
    result: "",
  },
  userAlreadyExited: {
    code: "10002",
    message: "用户已存在",
    result: "",
  },
  registerError: {
    code: "10003",
    message: "用户注册错误",
    result: "",
  },
  userDoseNotExist: {
    code: "10004",
    message: "用户不存在",
    result: "",
  },
  userLogin: {
    code: "10005",
    message: "用户登失败",
    result: "",
  },
  invalidPassword: {
    code: "10006",
    message: "密码错误",
    result: "",
  },
  TokenExpiredError: {
    code: "10101",
    message: "token 过期",
    result: "",
  },
  updateUserInfoError: {
    code: "10201",
    message: "修改用户信息失败",
    result: "",
  },

  articleCreateError: {
    code: "10301",
    message: "文章发布",
    result: "",
  },
  articleDetailError: {
    code: "10302",
    message: "获取文章详情失败",
    result: "",
  },
  articleUpdateError: {
    code: "10303",
    message: "更新文章失败",
    result: "",
  },
  articleListError: {
    code: "10304",
    message: "获取文章列表失败",
    result: "",
  },

  paramsValidateError: {
    code: "20101",
    message: "参数校验失败",
    result: "",
  },
};
