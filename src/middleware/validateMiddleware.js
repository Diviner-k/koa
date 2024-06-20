const { paramsValidateError } = require("../constant/errType");
/**
 * 过滤掉参数是 null undefined 的条件
 * @param {*} ctx
 * @param {*} next
 */
const filterEmtyParams = async (ctx, next) => {
  try {
    const params = ctx.request.body || {};
    const p = {};
    Object.keys(params).forEach((key) => {
      if (![null, undefined].includes(params[key])) {
        p[key] = params[key];
      }
    });
    ctx.request.body = p;
    await next();
  } catch (error) {
    console.log(error);
  }
};
/**
 * 校验接口参数 类型
 * @param {*} rules 校验规则
 * @returns
 */
const validateParams = (rules = {}) => {
  return async (ctx, next) => {
    try {
      ctx.verifyParams(rules);
      await next();
    } catch (error) {
      paramsValidateError.result = error.errors;
      return ctx.app.emit("error", paramsValidateError, ctx);
    }
  };
};

module.exports = {
  filterEmtyParams,
  validateParams,
};
