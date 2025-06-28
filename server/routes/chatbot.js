const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// Process chatbot queries
router.post('/query', async (req, res) => {
  try {
    const query = req.body.query.toLowerCase();
    let response = '';

    // Simple keyword-based response system
    if (query.includes('hello') || query.includes('hi') || query.includes('hey')) {
      response = 'Hello! How can I help you with your shopping today?';
    } 
    else if (query.includes('help')) {
      response = 'I can help you find products, check prices, add items to your cart, and provide information about our store. What would you like to know?';
    }
    else if (query.includes('product') || query.includes('items') || query.includes('show me')) {
      let category = null;
      
      // Extract category if mentioned
      const categories = ['electronics', 'clothing', 'books', 'home', 'toys'];
      for (const cat of categories) {
        if (query.includes(cat)) {
          category = cat;
          break;
        }
      }
      
      let products;
      if (category) {
        products = await Product.find({ category: { $regex: category, $options: 'i' } }).limit(5);
        response = `Here are some ${category} products:\n`;
      } else {
        products = await Product.find().limit(5);
        response = 'Here are some of our products:\n';
      }
      
      if (products.length > 0) {
        response += products.map(p => `${p.name} - $${p.price}`).join('\n');
      } else {
        response += 'Sorry, I couldn\'t find any products matching your request.';
      }
    } 
    else if (query.includes('price') || query.includes('cost') || query.includes('how much')) {
      // Try to extract product name from query
      const productKeywords = query.split(' ');
      let foundProduct = null;
      
      // Search for products matching keywords
      for (const keyword of productKeywords) {
        if (keyword.length < 3) continue; // Skip short words
        
        const products = await Product.find({
          name: { $regex: keyword, $options: 'i' }
        });
        
        if (products.length > 0) {
          foundProduct = products[0]; // Take the first match
          break;
        }
      }
      
      if (foundProduct) {
        response = `The price of ${foundProduct.name} is $${foundProduct.price}. Would you like to add it to your cart?`;
      } else {
        response = 'I\'m not sure which product you\'re asking about. Could you specify the product name?';
      }
    }
    else if (query.includes('cart') || query.includes('add') || query.includes('buy')) {
      response = 'To add an item to your cart, you can click the "Add to Cart" button on any product. Is there a specific product you\'re interested in?';
    }
    else {
      response = 'I\'m not sure I understand. I can help you find products, check prices, or learn about our store. How can I assist you?';
    }

    res.json({ response });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;