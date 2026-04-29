const productService = require("../services/product.service");

exports.addProduct = async (req, res) => {
  try {
    const product = await productService.addProduct(req.body, req.user.id);
    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getAllProducts = async (req, res) => {
  try {
    const products = await productService.getAllProducts();
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
