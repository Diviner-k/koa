const Router = require("koa-router");
const {
  uesrValidator,
  verifyUser,
  cryptPassword,
  verifyLogin,
} = require("../middleware/userMiddleware");
const { auth } = require("../middleware/authMiddleware");
const {
  list,
  register,
  login,
  loginOut,
  changeUserInfo,
  usrInfo,
} = require("../controller/user");

// 路由实例  prefix:路由前缀
const router = new Router({ prefix: "/user" });
// 用户注册
router.post("/register", uesrValidator, verifyUser, cryptPassword, register);
// 用户登录
router.post("/login", uesrValidator, verifyLogin, login);
// 用户列表
router.get("/list", auth, list);
//获取用户信息
router.get("/:id", auth, usrInfo);
//修改用户信息
router.patch("/", auth, cryptPassword, changeUserInfo);

module.exports = router;
