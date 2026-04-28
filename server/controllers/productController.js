const asyncHandler = require('express-async-handler');
const Product = require('../models/Product');

// @desc    Get all products
// @route   GET /api/products
// @access  Public
const getProducts = asyncHandler(async (req, res) => {
  const pageSize = Number(req.query.limit) || 12;
  const page = Number(req.query.page) || 1;

  const keyword = req.query.search
    ? { name: { $regex: req.query.search, $options: 'i' } }
    : {};

  const category = req.query.category ? { category: req.query.category } : {};
  const featured = req.query.featured ? { featured: true } : {};

  const filter = { ...keyword, ...category, ...featured };
  const count = await Product.countDocuments(filter);

  const products = await Product.find(filter)
    .limit(pageSize)
    .skip(pageSize * (page - 1))
    .sort({ createdAt: -1 });

  res.json({
    products,
    page,
    pages: Math.ceil(count / pageSize),
    total: count,
  });
});

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (product) {
    res.json(product);
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = asyncHandler(async (req, res) => {
  const product = new Product({
    name: req.body.name || 'Sample Product',
    description: req.body.description || 'Sample description',
    price: req.body.price || 0,
    category: req.body.category || 'General',
    brand: req.body.brand || 'Sample Brand',
    image: req.body.image || 'https://via.placeholder.com/400',
    countInStock: req.body.countInStock || 0,
  });

  const created = await product.save();
  res.status(201).json(created);
});

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = asyncHandler(async (req, res) => {
  const { name, description, price, category, brand, image, countInStock, featured, discount } = req.body;
  const product = await Product.findById(req.params.id);

  if (product) {
    product.name = name || product.name;
    product.description = description || product.description;
    product.price = price !== undefined ? price : product.price;
    product.category = category || product.category;
    product.brand = brand || product.brand;
    product.image = image || product.image;
    product.countInStock = countInStock !== undefined ? countInStock : product.countInStock;
    product.featured = featured !== undefined ? featured : product.featured;
    product.discount = discount !== undefined ? discount : product.discount;

    const updated = await product.save();
    res.json(updated);
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (product) {
    await product.deleteOne();
    res.json({ message: 'Product removed' });
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

// @desc    Create product review
// @route   POST /api/products/:id/reviews
// @access  Private
const createReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;
  const product = await Product.findById(req.params.id);

  if (product) {
    const already = product.reviews.find(r => r.user.toString() === req.user._id.toString());
    if (already) {
      res.status(400);
      throw new Error('Product already reviewed');
    }

    const review = { user: req.user._id, name: req.user.name, rating: Number(rating), comment };
    product.reviews.push(review);
    product.numReviews = product.reviews.length;
    product.rating = product.reviews.reduce((acc, r) => acc + r.rating, 0) / product.reviews.length;

    await product.save();
    res.status(201).json({ message: 'Review added' });
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

// @desc    Get product categories
// @route   GET /api/products/categories
// @access  Public
const getCategories = asyncHandler(async (req, res) => {
  const categories = await Product.distinct('category');
  res.json(categories);
});

module.exports = { getProducts, getProductById, createProduct, updateProduct, deleteProduct, createReview, getCategories };
