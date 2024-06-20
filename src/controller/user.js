const jwt = require("jsonwebtoken");
const { JWT_SECRET_KEY } = require("../config/config.default");
const { registerError, updateUserInfoError } = require("../constant/errType");
const { loginSuccess } = require("../constant/succType");
const {
  creareUser,
  changeUserInfoById,
  getUserList,
  getUserInfo,
} = require("../service/userServer");

class UserController {
  async register(ctx, next) {
    const params = ctx.request.body;
    try {
      const res = await creareUser({ ...params, isAdmin: 0 });
      ctx.body = { code: 200, result: res };
    } catch (error) {
      ctx.app.emit("error", registerError, ctx);
    }
  }

  async login(ctx, next) {
    const { password, ...res } = ctx.state.userInfo;

    const token = jwt.sign(res, JWT_SECRET_KEY, { expiresIn: "1d" });
    ctx.body = loginSuccess({
      message: "登录成功",
      result: { token, ...res._doc },
    });
  }
  async loginOut(ctx, next) {
    ctx.body = "退出成功";
  }
  /**
   * 修改用户信息
   */
  async changeUserInfo(ctx, next) {
    // state.userInfo 在 authMiddleware中间件中添加
    const { _id = "658be7aa39ace380115555e9" } = ctx.state.userInfo;
    const user = ctx.request.body;
    if (!user) {
      return (ctx.body = {
        code: "400",
        message: "请填写修改信息",
        result: null,
      });
    }
    const res = await changeUserInfoById(_id, user);
    if (!res)
      return ctx.app.emit("error", registerError, updateUserInfoError, ctx);
    ctx.body = {
      code: "200",
      message: "修改成功",
      result: res,
    };
  }
  /**
   * 获取用户信息
   */
  async usrInfo(ctx, next) {
    const _id = ctx.request.params.id;

    const user = ctx.request.body;

    const res = await getUserInfo(_id);
    if (!res)
      return ctx.app.emit("error", registerError, updateUserInfoError, ctx);
    ctx.body = {
      code: "200",
      message: "获取成功",
      result: res,
    };
  }
  /**
   *
   * @param {*} ctx
   * @param {*} next
   */
  async list(ctx, next) {
    const { isAdmin } = ctx.request.query;
    const res = await getUserList(isAdmin);
    ctx.body = {
      code: "200",
      message: "获取成功",
      result: res,
    };
  }
}

module.exports = new UserController();
