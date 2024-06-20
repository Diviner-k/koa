const jwt = require("jsonwebtoken");
const { JWT_SECRET_KEY } = require("../config/config.default");

/**
 * 校验token
 * @param {*} ctx
 * @param {*} next
 * @returns
 */
const auth = async (ctx, next) => {
  const { token } = ctx.request.header;
  // const token = authorization.replace("Bearer ", "");
  try {
    const { _doc } = jwt.verify(token, JWT_SECRET_KEY);
    ctx.state.userInfo = _doc;
  } catch (error) {
    console.log("error", JSON.stringify(error));
    // token 校验失败 --TODO
    let code = "500";
    // switch (error.name) {
    //   case "TokenExpiredError": // token 过期
    code = "401";
    //     break;

    //   default:
    //     break;
    // }
    return (ctx.body = {
      code,
      message: "登录超时，请重新登录",
      result: null,
    });
    return ctx.app.emit("error", error, ctx);
  }
  await next();
};

module.exports = {
  auth,
};
