const UserModel = require("../model/userModel");

class UserService {
  // 添加用户
  async creareUser(options) {
    const res = await UserModel.create(options);
    return res;
  }

  /**
   * 根据条件 获取用户信息
   */
  async getUseInfo({ account, username, password, isAdmin }) {
    const whereOpt = {};
    account && Object.assign(whereOpt, { account });
    username && Object.assign(whereOpt, { username });
    password && Object.assign(whereOpt, { password });
    isAdmin && Object.assign(whereOpt, { isAdmin });
    // whereOpt ： 查询条件
    // [string] ： 需要返回的字段
    const res = await UserModel.findOne(whereOpt).exec();
    return res;
  }
  /**
   * 根据 id 更新用户信息
   */
  async changeUserInfoById(
    userId,
    { _id, username, password, isAdmin, avatar }
  ) {
    let whereopt = { userId };

    let newUser = {};
    if (_id) {
      whereopt = { _id };
    }
    username && Object.assign(newUser, { username });
    password && Object.assign(newUser, { password });
    [0, 1].includes(isAdmin) && Object.assign(newUser, { isAdmin: isAdmin });
    avatar && Object.assign(newUser, { avatar });

    try {
      const { modifiedCount } = await UserModel.updateOne(whereopt, newUser);

      // 是否更新成功
      return modifiedCount > 0 ? modifiedCount : false;
    } catch (error) {
      console.log("11", error);
    }
  }

  /**
   * 获取用户列表
   */
  async getUserList(isAdmin) {
    try {
      const params = {};
      ["0", "1"].includes(isAdmin) &&
        Object.assign(params, { isAdmin: Number(isAdmin) });
      const res = await UserModel.find(params, { password: false });

      return res;
    } catch (error) {
      console.log("error", error);
    }
  }
  /**
   * 获取用户信息
   */
  async getUserInfo(_id) {
    const res = await UserModel.find({ _id }, { password: false });
    return res.length ? res : null;
  }
}

module.exports = new UserService();
