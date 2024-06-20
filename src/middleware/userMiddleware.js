const bcrypt = require("bcryptjs");

const { getUseInfo } = require("../service/userServer");
const {
  userFormateError,
  userAlreadyExited,
  registerError,
  userDoseNotExist,
  userLogin,
  invalidPassword,
} = require("../constant/errType");
/**
 * 校验用户信息是否为空
 */
const uesrValidator = async (ctx, next) => {
  const { account, username, password } = ctx.request.body;
  console.log("11", account, username, password);
  // 合法性
  if (!account || !password) {
    //   错误 触发
    return ctx.app.emit("error", userFormateError, ctx);
  }
  await next();
};
/**
 * 校验是否已注册
 */
const verifyUser = async (ctx, next) => {
  const { account, username, password } = ctx.request.body;
  try {
    const userInfo = await getUseInfo({ account });
    // 合法性

    if (userInfo) return ctx.app.emit("error", userAlreadyExited, ctx);
  } catch (error) {
    ctx.app.emit("error", registerError, ctx);
    return;
  }
  await next();
};

/**
 * 密码加密
 */
const cryptPassword = async (ctx, next) => {
  const { password } = ctx.request.body;
  if (password) {
    // 加盐
    const salt = bcrypt.genSaltSync(10);
    // hash 加密后的密码
    const hash = bcrypt.hashSync(password, salt);
    ctx.request.body.password = hash;
  }
  await next();
};

/**
 * 校验用户登录
 */
const verifyLogin = async (ctx, next) => {
  try {
    const { account, password } = ctx.request.body;
    const res = await getUseInfo({ account });
    // 用户不存在
    if (!res) {
      return ctx.app.emit("error", userDoseNotExist, ctx);
    }
    // 校验密码
    if (!bcrypt.compareSync(password, res.password)) {
      // 密码错误
      return ctx.app.emit("error", invalidPassword, ctx);
    }
    // 获取到用户信息
    ctx.state.userInfo = res;
  } catch (error) {
    // 登录失败
    return ctx.app.emit("error", userLogin, ctx);
  }
  await next();
};

module.exports = { uesrValidator, verifyUser, cryptPassword, verifyLogin };
