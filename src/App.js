import React, { useState } from 'react';
import './App.css';
import ChatBot from './components/ChatBot';
import ProductList from './components/ProductList';
import Cart from './components/Cart';

function App() {
  const [cartUpdated, setCartUpdated] = useState(false);

  const handleCartUpdate = () => {
    setCartUpdated(prev => !prev);
  };

  return (
    <div className="App">
      <div className="main-container">
        <div className="content-area">
          <ProductList onAddToCart={handleCartUpdate} />
          <Cart key={cartUpdated} />
        </div>
        <div className="chatbot-container">
          <ChatBot />
        </div>
      </div>
    </div>
  );
}

export default App;
