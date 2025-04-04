import React, { useState, useEffect } from "react";
import "./App.css";

const PRODUCTS = [
  { id: 1, name: "Laptop", price: 500 },
  { id: 2, name: "Smartphone", price: 300 },
  { id: 3, name: "Headphones", price: 100 },
  { id: 4, name: "Smartwatch", price: 150 },
];

const FREE_GIFT = { id: 99, name: "Wireless Mouse", price: 0 };
const THRESHOLD = 1000;

const ShoppingCartApp = () => {
  const [cart, setCart] = useState([]);
  const [subtotal, setSubtotal] = useState(0);

  useEffect(() => {
    const total = cart.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    setSubtotal(total);
  }, [cart]);

  const addToCart = (product) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.id);
      if (existingItem) {
        return prevCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...prevCart, { ...product, quantity: 1 }];
      }
    });
  };

  const updateQuantity = (id, amount) => {
    setCart((prevCart) =>
      prevCart
        .map((item) =>
          item.id === id ? { ...item, quantity: item.quantity + amount } : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const removeFromCart = (id) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== id));
  };

  useEffect(() => {
    const hasGift = cart.some((item) => item.id === FREE_GIFT.id);
    if (subtotal >= THRESHOLD && !hasGift) {
      setCart((prevCart) => [...prevCart, { ...FREE_GIFT, quantity: 1 }]);
    } else if (subtotal < THRESHOLD && hasGift) {
      setCart((prevCart) =>
        prevCart.filter((item) => item.id !== FREE_GIFT.id)
      );
    }
  }, [subtotal, cart]);

  return (
    <div className="shopping-cart-app">
      <h2>Shopping Cart</h2>
      <div className="product-list">
        {PRODUCTS.map((product) => (
          <div key={product.id} className="product-item">
            <span>
              {product.name} - ${product.price}
            </span>
            <button onClick={() => addToCart(product)} className="add-to-cart">
              Add to Cart
            </button>
          </div>
        ))}
      </div>

      <h2 class="cartsummary">Cart Summary</h2>
      <div className="cart">
        {cart.length === 0 ? (
          <p className="empty-cart">Cart is empty</p>
        ) : (
          cart.map((item) => (
            <div key={item.id} className="cart-item">
              <span>
                {item.name} - ${item.price} x {item.quantity}
              </span>
              {item.id !== FREE_GIFT.id && (
                <>
                  <button
                    onClick={() => updateQuantity(item.id, 1)}
                    className="quantity-btn"
                  >
                    +
                  </button>
                  <button
                    onClick={() => updateQuantity(item.id, -1)}
                    className="quantity-btn"
                  >
                    -
                  </button>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="remove-btn"
                  >
                    Remove
                  </button>
                </>
              )}
            </div>
          ))
        )}
      </div>

      <h3>Subtotal: ${subtotal}</h3>
      <p className="progress-text">
        {subtotal < THRESHOLD
          ? `Add $${THRESHOLD - subtotal} more for a free gift!`
          : "You have earned a free gift!"}
      </p>
      <div className="progress-bar">
        <div
          className="progress"
          style={{ width: `${(subtotal / THRESHOLD) * 100}%` }}
        ></div>
      </div>
    </div>
  );
};

export default ShoppingCartApp;
