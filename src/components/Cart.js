import React, { useState, useEffect } from 'react';
import './Cart.css';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const userId = 'user123'; // TODO: Replace with actual user authentication

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/cart/${userId}`);
      const data = await response.json();
      setCartItems(data.items || []);
    } catch (error) {
      console.error('Error fetching cart:', error);
    }
  };

  const updateQuantity = async (itemId, change) => {
    try {
      const response = await fetch(`http://localhost:8080/api/cart/${userId}/items`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId: itemId,
          quantity: change
        }),
      });
      if (response.ok) {
        fetchCart(); // Refresh cart after update
      }
    } catch (error) {
      console.error('Error updating cart:', error);
    }
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  return (
    <div className="cart">
      <h2>Shopping Cart</h2>
      {cartItems.length === 0 ? (
        <p>Your cart is empty</p>
      ) : (
        <>
          <div className="cart-items">
            {cartItems.map(item => (
              <div key={item.id} className="cart-item">
                <img src={item.image} alt={item.name} />
                <div className="item-details">
                  <h3>{item.name}</h3>
                  <p>${item.price}</p>
                  <div className="quantity-controls">
                    <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</button>
                    <span>{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="cart-summary">
            <h3>Total: ${calculateTotal().toFixed(2)}</h3>
            <button onClick={() => {/* TODO: Implement checkout */}}>Checkout</button>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;