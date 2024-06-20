const BannerMdel = require("../model/banner");

class BannerService {
  async addBanner(options) {
    const res = await BannerMdel.create(options);
    console.log("res", res);
    return res;
  }
  // 获取轮播图
  async getBannerList() {
    return await BannerMdel.find({ isDelete: false });
    return res.length ? res : null;
  }
  async updatedBanner(_id, { image, isDelete }) {
    const whereopt = { _id };
    const newUser = {};
    image && Object.assign(newUser, { image, isDelete });
    isDelete && Object.assign(newUser, { isDelete });
    try {
      const { modifiedCount } = await BannerMdel.updateOne(whereopt, newUser);

      // 是否更新成功
      console.log("55", modifiedCount);
      return modifiedCount > 0 ? true : false;
    } catch (error) {
      console.log("11", error);
    }
  }
}

module.exports = new BannerService();
