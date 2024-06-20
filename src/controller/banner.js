const {
  addBanner,
  getBannerList,
  updatedBanner,
} = require("../service/banner");
class BannerController {
  async add(ctx, next) {
    const params = ctx.request.body;
    try {
      const res = await addBanner(params);
      ctx.body = { code: 200, result: res };
    } catch (error) {
      ctx.app.emit("error", registerError, ctx);
    }
  }
  async updated(ctx, next) {
    const info = ctx.request.body;
    const res = await updatedBanner(info._id, info);
    if (!res)
      return ctx.app.emit("error", registerError, updateUserInfoError, ctx);
    ctx.body = {
      code: "200",
      message: "修改成功",
      result: null,
    };
  }
  async list(ctx, next) {
    const res = await getBannerList();
    ctx.body = {
      code: "200",
      message: "",
      result: res,
    };
  }
}
module.exports = new BannerController();
