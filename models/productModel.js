const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const productSchema = new mongoose.Schema({
  productID: {
    type: String,
    unique: true,
    default: uuidv4,
  },
  product_Name: {
    type: String,
    trim: true,
    required: [true, "Product Name is Required"],
  },
  description: {
    type: String,
    trim: true,
  },
  unit: {
    type: Number,
    trim: true,
    required: [true, "Number of Units is Required"],
    default: 1,
  },
  price: {
    type: Number,
    trim: true,
    required: [true, "Price of Unit is Required"],
  },
  currency: {
    type: String,
    trim: true,
    required: [true, "Currency of Amount is Required"],
  },
}, { timestamps: true });

module.exports = mongoose.model("Product", productSchema);
