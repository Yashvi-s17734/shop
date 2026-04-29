const Product = require("../models/Product");

async function addProduct(data, userId) {
  const product = await Product.create({
    name: data.name,
    category: data.category,
    price: data.price,
    description: data.description,
    images: data.images || [],
    stock: data.stock || 0,
    createdBy: userId,
  });

  return product;
}

async function getAllProducts() {
  return await Product.find({ isActive: true }).sort({ createdAt: -1 });
}

module.exports = {
  addProduct,
  getAllProducts,
};
