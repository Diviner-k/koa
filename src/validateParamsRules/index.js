/**
 * 分页参数校验规则
 */
class PageRule {
  pageNum = "number";
  pageSize = "number";
}
/**
 * 文章列表参数校验规则
 */
class ArticleListRule extends PageRule {
  constructor() {
    super();
  }
  author = {
    type: "string",
    required: false,
    allowEmpty: true,
  };
  title = {
    type: "string",
    required: false,
    allowEmpty: false,
  };
}

module.exports = {
  articleListRule: new ArticleListRule(),
};
