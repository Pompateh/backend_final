const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Cart = require('../models/Cart');

// Get user's cart
router.get('/', auth, (req, res) => {
    // Your cart logic here
    res.json({ message: 'Cart accessed successfully' });
  });

// Add item to cart
router.post('/add', auth, async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    let cart = await Cart.findOne({ userId: req.userId });
    if (!cart) {
      cart = new Cart({ userId: req.userId, items: [] });
    }
    const itemIndex = cart.items.findIndex(item => item.productId.toString() === productId);
    if (itemIndex > -1) {
      cart.items[itemIndex].quantity += quantity;
    } else {
      cart.items.push({ productId, quantity });
    }
    await cart.save();
    res.json(cart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;