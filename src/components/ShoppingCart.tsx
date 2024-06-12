import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { CartContext, CartContextType } from '../context/CartContext';
import './ShoppingCart.css';

const ShoppingCart: React.FC = () => {
  const { cart } = useContext(CartContext) as CartContextType;

  const totalItems = cart.reduce((sum, item) => sum + item.quantity!, 0);
  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity!, 0);

  return (
    <div className="shopping-cart">
      <div className="cart-info">
        <p>Items: {totalItems}</p>
        <p>Total: ${totalPrice.toFixed(2)}</p>
      </div>
      <Link to="/checkout">
        <button>Checkout</button>
      </Link>
    </div>
  );
};

export default ShoppingCart;
