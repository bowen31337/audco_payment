import React, { useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CartContext, CartContextType } from '../context/CartContext';
import ShoppingCart from '../components/ShoppingCart';
import './ProductDetail.css';

interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  image: string;
}

const products: Product[] = [
  { id: 1, name: 'Product 1', price: 100, description: 'Description of Product 1', image: 'https://via.placeholder.com/150' },
  { id: 2, name: 'Product 2', price: 200, description: 'Description of Product 2', image: 'https://via.placeholder.com/150' },
  { id: 3, name: 'Product 3', price: 300, description: 'Description of Product 3', image: 'https://via.placeholder.com/150' },
];

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { addToCart } = useContext(CartContext) as CartContextType;
  const product = products.find(p => p.id === parseInt(id as string));

  if (!product) {
    return <div>Product not found</div>;
  }

  return (
    <div className="product-detail">
      <ShoppingCart />
      <img src={product.image} alt={product.name} />
      <h1>{product.name}</h1>
      <p>{product.description}</p>
      <p>${product.price}</p>
      <button onClick={() => addToCart(product)}>Add to Cart</button>
      <Link to="/checkout">
        <button>Buy Now</button>
      </Link>
      <Link to="/">Back to Product List</Link>
    </div>
  );
};

export default ProductDetail;
