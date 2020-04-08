const Product = require('../models/Product');
const mongoose = require('mongoose');

class Products {
  constructor(props) {
    this.id = props['_id'];
    this.title = props['title'];
    this.category = props['category'];
    this.subcategory = props['subcategory'];
    this.description = props['description'];
    this.price = props['price'];
    this.images = props['images'];
  }
}

module.exports.productsBySubcategory = async function productsBySubcategory(ctx, next) {
  const subcategory = ctx.query.subcategory;
  if (!subcategory) {
    return next();
  }

  const products = await Product.find({subcategory: subcategory});
  const res = products.map((item) => new Products(item));
  ctx.body = {products: res};
};

module.exports.productList = async function productList(ctx, next) {
  const products = await Product.find({});
  const res = products.map((item) => new Products(item));
  ctx.body = {products: res};
};

module.exports.productById = async function productById(ctx, next) {
  const id = ctx.params.id;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    ctx.throw(400);
  }
  const product = await Product.findById(id);

  if (product === null) {
    ctx.throw(404);
  }
  const res = new Products(product);
  ctx.body = {product: res};
};

