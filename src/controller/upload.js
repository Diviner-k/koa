const {
  APP_HOST,
  APP_HOST_PORT,
  DB_NAME,
} = require("../config/config.default");
const { uploadSuccess } = require("../constant/succType");
const Image = require("../model/uploadModel");
const path = require("path");
class Upload {
  async uploadImg(ctx, next) {
    try {
      const paths = ctx.state.paths;

      const { dir, base, ext, name } = path.parse(paths[0]);
      const url = `http://${APP_HOST}:${APP_HOST_PORT}/public/upload/${base}`;
      const image = {
        filename: name + ext,
        url,
      };
      await Image.create(image);
      ctx.body = uploadSuccess({ result: url });
    } catch (error) {
      console.log("error", error);
      ctx.body({ error });
    }
  }
}

module.exports = new Upload();
