const express = require('express');
const router = express.Router();
const {
  createOrder, getOrderById, getMyOrders, getAllOrders,
  createStripePaymentIntent, updateOrderToPaid
} = require('../controllers/orderController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/').post(protect, createOrder).get(protect, admin, getAllOrders);
router.get('/myorders', protect, getMyOrders);
router.get('/:id', protect, getOrderById);
router.post('/:id/pay/stripe', protect, createStripePaymentIntent);
router.put('/:id/pay', protect, updateOrderToPaid);

module.exports = router;
