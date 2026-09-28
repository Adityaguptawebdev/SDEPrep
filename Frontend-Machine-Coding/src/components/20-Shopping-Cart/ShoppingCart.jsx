// Concepts:
// useState with an array of objects
// find() to check if a product is already in the cart
// map() to change a quantity · filter() to remove
// reduce() for the total price and item count
// Derived values (total is NOT stored in state)

import { useState } from "react";
import "./ShoppingCart.css";

// Prices are whole rupees, so there are no floating-point problems
const products = [
  { id: 1, name: "Wireless Mouse", price: 799, emoji: "🖱️" },
  { id: 2, name: "Keyboard", price: 1499, emoji: "⌨️" },
  { id: 3, name: "Headphones", price: 2499, emoji: "🎧" },
  { id: 4, name: "USB-C Cable", price: 299, emoji: "🔌" },
  { id: 5, name: "Webcam", price: 1999, emoji: "📷" },
  { id: 6, name: "Laptop Stand", price: 999, emoji: "💻" },
];

function ShoppingCart() {
  // 1. State
  // Each cart item is a product plus a quantity: { id, name, price, emoji, quantity }
  const [cart, setCart] = useState([]);

  // 2. Event handlers
  function addToCart(product) {
    const existingItem = cart.find((item) => item.id === product.id);

    if (existingItem) {
      // Already in the cart → add 1 to its quantity
      setCart(
        cart.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        )
      );
    } else {
      // New in the cart → add it with quantity 1
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  }

  function removeFromCart(id) {
    setCart(cart.filter((item) => item.id !== id));
  }

  function increaseQuantity(id) {
    setCart(cart.map((item) => (item.id === id ? { ...item, quantity: item.quantity + 1 } : item)));
  }

  function decreaseQuantity(id) {
    // Take 1 away, then drop any item whose quantity reached 0
    setCart(
      cart
        .map((item) => (item.id === id ? { ...item, quantity: item.quantity - 1 } : item))
        .filter((item) => item.quantity > 0)
    );
  }

  // 3. Main logic
  // reduce() walks the array and carries a running `sum`, starting at 0
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // 4. JSX
  return (
    <div className="cart">
      <section>
        <h3>Products</h3>
        <div className="cart-product-grid">
          {products.map((product) => (
            <div key={product.id} className="cart-product">
              <span className="cart-emoji">{product.emoji}</span>
              <p className="cart-product-name">{product.name}</p>
              <p className="cart-price">₹{product.price.toLocaleString("en-IN")}</p>
              <button className="primary-button" onClick={() => addToCart(product)}>
                Add to cart
              </button>
            </div>
          ))}
        </div>
      </section>

      <section className="cart-panel">
        <h3>
          🛒 Cart ({itemCount} {itemCount === 1 ? "item" : "items"})
        </h3>

        {cart.length === 0 ? (
          <p className="cart-empty">Your cart is empty.</p>
        ) : (
          <ul className="cart-list">
            {cart.map((item) => (
              <li key={item.id} className="cart-item">
                <div className="cart-item-row">
                  <span>
                    {item.emoji} {item.name}
                  </span>
                  <span>₹{(item.price * item.quantity).toLocaleString("en-IN")}</span>
                </div>

                <div className="cart-item-row">
                  <div className="cart-quantity">
                    <button onClick={() => decreaseQuantity(item.id)} aria-label={`Decrease ${item.name}`}>
                      −
                    </button>
                    <span>{item.quantity}</span>
                    <button onClick={() => increaseQuantity(item.id)} aria-label={`Increase ${item.name}`}>
                      +
                    </button>
                  </div>
                  <button className="cart-remove" onClick={() => removeFromCart(item.id)}>
                    Remove
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}

        <p className="cart-total">
          Total: <strong>₹{total.toLocaleString("en-IN")}</strong>
        </p>
      </section>
    </div>
  );
}

export default ShoppingCart;
