const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('../models/Product');

dotenv.config();

const products = [
  {
    name: 'Premium Wireless Headphones',
    description: 'Experience crystal-clear audio with our premium noise-cancelling wireless headphones. Features 30-hour battery life, Bluetooth 5.0, and premium cushioned ear cups for all-day comfort.',
    price: 299.99,
    category: 'Electronics',
    brand: 'SoundWave',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400',
    countInStock: 50,
    rating: 4.5,
    numReviews: 128,
    featured: true,
    discount: 10,
  },
  {
    name: 'Smart Watch Pro',
    description: 'Stay connected and track your fitness with our advanced smartwatch. Features heart rate monitoring, GPS, sleep tracking, and a stunning AMOLED display.',
    price: 399.99,
    category: 'Electronics',
    brand: 'TechGear',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400',
    countInStock: 35,
    rating: 4.7,
    numReviews: 89,
    featured: true,
    discount: 0,
  },
  {
    name: 'Leather Messenger Bag',
    description: 'Handcrafted genuine leather messenger bag with multiple compartments. Perfect for laptops up to 15 inches, with adjustable shoulder strap and brass hardware.',
    price: 189.99,
    category: 'Fashion',
    brand: 'UrbanCraft',
    image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400',
    countInStock: 20,
    rating: 4.3,
    numReviews: 45,
    featured: false,
    discount: 5,
  },
  {
    name: 'Mechanical Keyboard RGB',
    description: 'Professional mechanical gaming keyboard with Cherry MX switches, per-key RGB lighting, and aluminum frame. Includes wrist rest and USB-C connectivity.',
    price: 149.99,
    category: 'Electronics',
    brand: 'KeyMaster',
    image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400',
    countInStock: 60,
    rating: 4.6,
    numReviews: 203,
    featured: true,
    discount: 15,
  },
  {
    name: 'Yoga Mat Premium',
    description: 'Extra-thick 6mm non-slip yoga mat made from eco-friendly TPE material. Includes carrying strap and alignment lines for proper posture.',
    price: 79.99,
    category: 'Sports',
    brand: 'ZenFit',
    image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400',
    countInStock: 100,
    rating: 4.4,
    numReviews: 67,
    featured: false,
    discount: 0,
  },
  {
    name: 'Coffee Maker Deluxe',
    description: 'Brew café-quality coffee at home with our 12-cup programmable coffee maker. Features built-in grinder, thermal carafe, and customizable brew strength.',
    price: 249.99,
    category: 'Home & Kitchen',
    brand: 'BrewMaster',
    image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400',
    countInStock: 25,
    rating: 4.8,
    numReviews: 156,
    featured: true,
    discount: 20,
  },
  {
    name: 'Running Shoes Pro',
    description: 'Lightweight and responsive running shoes with advanced cushioning technology. Features breathable mesh upper, carbon fiber plate, and reflective details for night running.',
    price: 159.99,
    category: 'Sports',
    brand: 'SpeedStep',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400',
    countInStock: 80,
    rating: 4.5,
    numReviews: 312,
    featured: false,
    discount: 0,
  },
  {
    name: 'Wireless Earbuds',
    description: 'True wireless earbuds with active noise cancellation, 24-hour total battery life with charging case, IPX5 water resistance, and customizable EQ via app.',
    price: 129.99,
    category: 'Electronics',
    brand: 'SoundWave',
    image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400',
    countInStock: 75,
    rating: 4.2,
    numReviews: 189,
    featured: false,
    discount: 10,
  },
  {
    name: 'Scented Candle Set',
    description: 'Luxury hand-poured soy candle set of 3 with calming lavender, eucalyptus, and vanilla scents. 45-hour burn time each, presented in elegant glass vessels.',
    price: 59.99,
    category: 'Home & Kitchen',
    brand: 'SereneScents',
    image: 'https://images.unsplash.com/photo-1602178506542-be8f9e5e8a43?w=400',
    countInStock: 120,
    rating: 4.9,
    numReviews: 78,
    featured: false,
    discount: 0,
  },
  {
    name: 'Denim Jacket Classic',
    description: 'Timeless raw denim jacket with authentic washed finish, copper rivets, and interior pockets. Available in multiple washes, made from 100% organic cotton.',
    price: 119.99,
    category: 'Fashion',
    brand: 'DenimCo',
    image: 'https://images.unsplash.com/photo-1551537482-f2075a1d41f2?w=400',
    countInStock: 40,
    rating: 4.1,
    numReviews: 55,
    featured: false,
    discount: 0,
  },
  {
    name: 'Portable Bluetooth Speaker',
    description: '360-degree surround sound portable speaker with 20-hour battery, IPX7 waterproof rating, and built-in power bank. Perfect for outdoor adventures.',
    price: 89.99,
    category: 'Electronics',
    brand: 'SoundWave',
    image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400',
    countInStock: 55,
    rating: 4.4,
    numReviews: 134,
    featured: true,
    discount: 5,
  },
  {
    name: 'Plant-Based Protein Powder',
    description: 'Complete plant-based protein with 25g protein per serving from pea, hemp, and brown rice. No artificial sweeteners, third-party tested, available in 4 flavors.',
    price: 54.99,
    category: 'Sports',
    brand: 'NutriForce',
    image: 'https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=400',
    countInStock: 200,
    rating: 4.3,
    numReviews: 267,
    featured: false,
    discount: 0,
  },
];

const seedProducts = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    await Product.deleteMany({});
    await Product.insertMany(products);
    console.log('Products seeded successfully!');
    process.exit();
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
};

seedProducts();
