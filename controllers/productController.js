const Product = require('../models/productModel');

exports.addProduct = async (req, res) => {
  try {
    const { product_Name, description, unit, price, currency } = req.body;

    const newProduct = new Product({
      product_Name,
      description,
      unit,
      price,
      currency,
    });

    const savedProduct = await newProduct.save();

    res.status(201).json({
      success: true,
      message: 'Product added successfully',
      data: savedProduct,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error adding product',
      error: error.message,
    });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const { productID } = req.params;
    const updatedData = req.body;

    const updatedProduct = await Product.findOneAndUpdate(
      { productID },
      updatedData,
      { new: true, runValidators: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      data: updatedProduct,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating product',
      error: error.message,
    });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const { productID } = req.params;

    const deletedProduct = await Product.findOneAndDelete({ productID });

    if (!deletedProduct) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Product deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting product',
      error: error.message,
    });
  }
};

exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();

    res.status(200).json({
      success: true,
      message: 'Products fetched successfully',
      data: products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching products',
      error: error.message,
    });
  }
};
