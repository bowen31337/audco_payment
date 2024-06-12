import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { CartContext, CartContextType } from '../context/CartContext';
import ShoppingCart from '../components/ShoppingCart';
import './ProductList.css';

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
}

const products: Product[] = [
  { id: 1, name: 'Product 1', price: 100, image: 'https://via.placeholder.com/150' },
  { id: 2, name: 'Product 2', price: 200, image: 'https://via.placeholder.com/150' },
  { id: 3, name: 'Product 3', price: 300, image: 'https://via.placeholder.com/150' },
];

const ProductList: React.FC = () => {
  const { addToCart } = useContext(CartContext) as CartContextType;

  return (
    <div className="product-list">
      <ShoppingCart />
      <h1>Product List</h1>
      <div className="product-grid">
        {products.map(product => (
          <div className="product-card" key={product.id}>
            <Link to={`/product/${product.id}`}>
              <img src={product.image} alt={product.name} />
              <h2>{product.name}</h2>
              <p>${product.price}</p>
            </Link>
            <button onClick={() => addToCart(product)}>Add to Cart</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductList;
