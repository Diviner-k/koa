const fs = require("fs");

const Router = require("koa-router");

const router = new Router();

const fileNames = fs.readdirSync(__dirname);
for (const item of fileNames) {
  if (item !== "index.js") {
    const r = require(`./${item}`);
    router.use(r.routes());
  }
}
module.exports = router;
