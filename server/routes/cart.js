const express = require('express');
const router = express.Router();
const Cart = require('../models/Cart');
const Product = require('../models/Product');

// Get cart
router.get('/:userId', async (req, res) => {
  try {
    let cart = await Cart.findOne({ userId: req.params.userId }).populate('items.product');
    if (!cart) {
      cart = { userId: req.params.userId, items: [], total: 0 };
    }
    res.json(cart);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add item to cart
router.post('/:userId/items', async (req, res) => {
  try {
    let cart = await Cart.findOne({ userId: req.params.userId });
    
    if (!cart) {
      cart = new Cart({
        userId: req.params.userId,
        items: []
      });
    }
    
    const itemIndex = cart.items.findIndex(item => 
      item.product.toString() === req.body.productId
    );

    if (itemIndex > -1) {
      // Product exists in cart, update quantity
      cart.items[itemIndex].quantity += req.body.quantity;
    } else {
      // Product does not exist in cart, add new item
      cart.items.push({
        product: req.body.productId,
        quantity: req.body.quantity
      });
    }

    const updatedCart = await cart.save();
    await updatedCart.populate('items.product');
    res.json(updatedCart);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update cart item quantity
router.put('/:userId/items/:productId', async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.params.userId });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    const itemIndex = cart.items.findIndex(item => 
      item.product.toString() === req.params.productId
    );

    if (itemIndex > -1) {
      if (req.body.quantity <= 0) {
        // Remove item if quantity is 0 or negative
        cart.items.splice(itemIndex, 1);
      } else {
        // Update quantity
        cart.items[itemIndex].quantity = req.body.quantity;
      }
    } else {
      return res.status(404).json({ message: 'Item not found in cart' });
    }

    const updatedCart = await cart.save();
    await updatedCart.populate('items.product');
    res.json(updatedCart);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Remove item from cart
router.delete('/:userId/items/:productId', async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.params.userId });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    const itemIndex = cart.items.findIndex(item => 
      item.product.toString() === req.params.productId
    );

    if (itemIndex > -1) {
      cart.items.splice(itemIndex, 1);
    } else {
      return res.status(404).json({ message: 'Item not found in cart' });
    }

    const updatedCart = await cart.save();
    await updatedCart.populate('items.product');
    res.json(updatedCart);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;