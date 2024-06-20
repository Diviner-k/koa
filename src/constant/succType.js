class Succ {
  code = "200";
  message = "请求成功";
  result = null;
  constructor(options) {
    const { code, message, result } = options;
    code && (this.code = code);
    message && (this.message = message);
    result && (this.result = result);
  }
}

module.exports = {
  /**
   * 用户注册成功
   * @param {*} op code message result
   * @returns
   */
  registerSuccess: (op) => {
    return new Succ(op);
  },

  /**
   * 用户登录成功
   * @param {*} op code message result
   * @returns
   */
  loginSuccess: (op) => {
    return new Succ(op);
  },

  /**
   * 用户退出成功
   * @param {*} op code message result
   * @returns
   */
  loginOutSuccess: (op) => {
    return new Succ(op);
  },

  /**
   * 文章发布成功
   * @param {*} op code message result
   * @returns
   */
  articleCreateSuccess: (op) => {
    return new Succ(op);
  },
  /**
   * 文章更新成功
   * @param {*} op code message result
   * @returns
   */
  articleUpdateSuccess: (op) => {
    return new Succ(op);
  },
  /**
   * 文章点赞操作成功
   * @param {*} op code message result
   * @returns
   */
  articleLikeSuccess: (op) => {
    return new Succ(op);
  },
  /**
   * 文章点赞操作成功
   * @param {*} op code message result
   * @returns
   */
  articleFavoriteSuccess: (op) => {
    return new Succ(op);
  },
  /**
   * 获取文章列表成功
   * @param {*} op code message result
   * @returns
   */
  articleListSuccess: (op) => {
    return new Succ(op);
  },
  /**
   * 获取文章详情成功
   * @param {*} op code message result
   * @returns
   */
  articleDetailSuccess: (op) => {
    return new Succ(op);
  },
  /**
   * 文章收藏/点赞操作成功
   * @param {*} op code message result
   * @returns
   */
  articleCollectLikeSuccess: (op) => {
    return new Succ(op);
  },
  /**
   * 文件上传成功
   * @param {*} op code message result
   * @returns
   */
  uploadSuccess: (op) => {
    return new Succ({ message: "上传成功", ...op });
  },
};
