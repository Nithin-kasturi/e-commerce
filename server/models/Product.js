const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: true },
}, { timestamps: true });

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  price: { type: Number, required: true, min: 0 },
  category: { type: String, required: true },
  brand: { type: String, required: true },
  image: { type: String, required: true },
  images: [{ type: String }],
  countInStock: { type: Number, required: true, default: 0 },
  reviews: [reviewSchema],
  rating: { type: Number, default: 0 },
  numReviews: { type: Number, default: 0 },
  featured: { type: Boolean, default: false },
  discount: { type: Number, default: 0, min: 0, max: 100 },
}, { timestamps: true });

productSchema.virtual('discountedPrice').get(function () {
  return this.price * (1 - this.discount / 100);
});

module.exports = mongoose.model('Product', productSchema);
