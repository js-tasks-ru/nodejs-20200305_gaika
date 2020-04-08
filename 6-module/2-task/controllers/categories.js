const Category = require('../models/Category');

class Categories {
  constructor(props) {
    this.id = props['_id'];
    this.title = props['title'];
    this.subcategories = this.parseSubcategories(props['subcategories']);
  }

  parseSubcategories(subcategories) {
    return subcategories.map((item) => new Subcategory(item));
  }
}

class Subcategory {
  constructor(props) {
    this.id = props['_id'];
    this.title = props['title'];
  }
}

module.exports.categoryList = async function categoryList(ctx, next) {
  const categories = await Category.find({});
  const res = categories.map((item) => new Categories(item));
  ctx.body = {categories: res};
};
