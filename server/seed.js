const mongoose = require('mongoose');
require('dotenv').config();
const Product = require('./models/Product');

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Connected to MongoDB');
  seedProducts();
}).catch((err) => {
  console.error('MongoDB connection error:', err);
});

const sampleProducts = [
  {
    name: 'Smartphone X',
    description: 'Latest smartphone with advanced camera and long battery life',
    price: 799.99,
    image: 'https://via.placeholder.com/300',
    category: 'electronics',
    stock: 25
  },
  {
    name: 'Laptop Pro',
    description: 'High-performance laptop for professionals and gamers',
    price: 1299.99,
    image: 'https://via.placeholder.com/300',
    category: 'electronics',
    stock: 15
  },
  {
    name: 'Wireless Headphones',
    description: 'Noise-cancelling wireless headphones with premium sound',
    price: 199.99,
    image: 'https://via.placeholder.com/300',
    category: 'electronics',
    stock: 30
  },
  {
    name: 'Cotton T-Shirt',
    description: 'Comfortable cotton t-shirt available in various colors',
    price: 19.99,
    image: 'https://via.placeholder.com/300',
    category: 'clothing',
    stock: 50
  },
  {
    name: 'Denim Jeans',
    description: 'Classic denim jeans with modern fit',
    price: 49.99,
    image: 'https://via.placeholder.com/300',
    category: 'clothing',
    stock: 40
  },
  {
    name: 'Coffee Maker',
    description: 'Programmable coffee maker with thermal carafe',
    price: 89.99,
    image: 'https://via.placeholder.com/300',
    category: 'home',
    stock: 20
  },
  {
    name: 'Fitness Tracker',
    description: 'Water-resistant fitness tracker with heart rate monitor',
    price: 129.99,
    image: 'https://via.placeholder.com/300',
    category: 'electronics',
    stock: 35
  },
  {
    name: 'Bluetooth Speaker',
    description: 'Portable bluetooth speaker with 20-hour battery life',
    price: 79.99,
    image: 'https://via.placeholder.com/300',
    category: 'electronics',
    stock: 28
  }
];

async function seedProducts() {
  try {
    // Clear existing products
    await Product.deleteMany({});
    console.log('Cleared existing products');
    
    // Insert new products
    const products = await Product.insertMany(sampleProducts);
    console.log(`Added ${products.length} products to the database`);
    
    mongoose.connection.close();
    console.log('Database connection closed');
  } catch (error) {
    console.error('Error seeding database:', error);
    mongoose.connection.close();
  }
}