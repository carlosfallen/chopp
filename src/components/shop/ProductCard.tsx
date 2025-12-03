// FILE: src/components/shop/ProductCard.tsx
import { createSignal } from 'solid-js';
import { cartStore } from '../../store/cart';
import './ProductCard.css';

type Product = {
  id: string;
  name: string;
  category: string;
  description: string;
  pricePerLiter: number;
  availableSizes: number[];
  image?: string;
};

export default function ProductCard(props: { product: Product }) {
  const [selectedSize, setSelectedSize] = createSignal(props.product.availableSizes[0]);
  
  const handleAddToCart = () => {
    cartStore.addItem({
      id: props.product.id,
      name: props.product.name,
      category: props.product.category,
      description: props.product.description,
      pricePerLiter: props.product.pricePerLiter,
      liters: selectedSize(),
      image: props.product.image || ''
    });
    
    cartStore.openCart();
  };
  
  return (
    <div class="product-card">
      <div class="product-image">🍺</div>
      <div class="product-content">
        <span class="product-category">{props.product.category}</span>
        <h3 class="product-name">{props.product.name}</h3>
        <p class="product-description">{props.product.description}</p>
        
        <div class="product-sizes">
          {props.product.availableSizes.map(size => (
            <button
              class="size-btn"
              classList={{ active: selectedSize() === size }}
              onClick={() => setSelectedSize(size)}
            >
              {size}L
            </button>
          ))}
        </div>
        
        <button class="btn btn-primary add-to-cart" onClick={handleAddToCart}>
          Adicionar ao carrinho
        </button>
      </div>
    </div>
  );
}