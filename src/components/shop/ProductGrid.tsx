// FILE: src/components/shop/ProductGrid.tsx (corrigido)
import { createSignal, For } from 'solid-js';
import { products } from '../../data/products';
import ProductCard from './ProductCard';
import './ProductGrid.css';

export default function ProductGrid() {
  const [filter, setFilter] = createSignal<string>('all');
  
  const categories = ['all', ...new Set(products.map(p => p.category))];
  
  const filteredProducts = () => {
    if (filter() === 'all') return products;
    return products.filter(p => p.category === filter());
  };
  
  return (
    <div class="product-section">
      <div class="container">
        <div class="product-filters">
          <For each={categories}>
            {(cat: string) => (
              <button
                class="filter-btn"
                classList={{ active: filter() === cat }}
                onClick={() => setFilter(cat)}
              >
                {cat === 'all' ? 'Todos' : cat}
              </button>
            )}
          </For>
        </div>
        
        <div class="product-grid">
          <For each={filteredProducts()}>
            {(product: typeof products[0]) => <ProductCard product={product} />}
          </For>
        </div>
      </div>
    </div>
  );
}