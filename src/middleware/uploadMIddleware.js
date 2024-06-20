const path = require("path");
const getFileName = async (ctx, next) => {
  const files = ctx.request.files;
  const paths = [];
  try {
    for (const key in files) {
      if (Object.hasOwnProperty.call(files, key)) {
        const file = files[key];
        paths.push(file.filepath);
      }
    }
  } catch (error) {
    console.error(error);
  }
  ctx.state.paths = paths;
  await next();
};

module.exports = { getFileName };
