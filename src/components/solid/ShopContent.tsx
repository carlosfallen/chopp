// FILE: src/components/solid/ShopContent.tsx
import { createSignal, For, Show, onMount } from 'solid-js';
import { products } from '../../data/products';
import { cartStore } from '../../store/cart';
import './ShopContent.css';

export default function ShopContent() {
  const [filter, setFilter] = createSignal<string>('all');
  const [selectedSizes, setSelectedSizes] = createSignal<Record<string, number>>({});
  
  const categories = ['all', ...new Set(products.map(p => p.category))];
  
  const filteredProducts = () => {
    if (filter() === 'all') return products;
    return products.filter(p => p.category === filter());
  };
  
  const getSelectedSize = (productId: string) => {
    return selectedSizes()[productId] || products.find(p => p.id === productId)?.availableSizes[0] || 30;
  };
  
  const setSize = (productId: string, size: number) => {
    setSelectedSizes({ ...selectedSizes(), [productId]: size });
  };
  
  const handleAddToCart = (product: typeof products[0]) => {
    const size = getSelectedSize(product.id);
    cartStore.addItem({
      id: product.id,
      name: product.name,
      category: product.category,
      description: product.description,
      pricePerLiter: product.pricePerLiter,
      liters: size,
      image: product.image || ''
    });
    cartStore.openCart();
  };
  
  onMount(() => {
    const hash = window.location.hash;
    if (hash === '#carrinho') {
      cartStore.openCart();
    }
  });
  
  return (
    <div class="shop-container">
      <div class="container">
        <div class="shop-filters">
          <For each={categories}>
            {(cat) => (
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
        
        <div class="products-grid">
          <For each={filteredProducts()}>
            {(product) => (
              <div class="product-card visible">
                <div class="product-image">🍺</div>
                <div class="product-content">
                  <span class="product-category">{product.category}</span>
                  <h3 class="product-name">{product.name}</h3>
                  <p class="product-description">{product.description}</p>
                  
                  <div class="product-sizes">
                    <For each={product.availableSizes}>
                      {(size) => (
                        <button
                          class="size-btn"
                          classList={{ active: getSelectedSize(product.id) === size }}
                          onClick={() => setSize(product.id, size)}
                        >
                          {size}L
                        </button>
                      )}
                    </For>
                  </div>
                  
                  <div class="product-price">
                    R$ {(product.pricePerLiter * getSelectedSize(product.id)).toFixed(2)}
                  </div>
                  
                  <button 
                    class="btn btn-primary add-to-cart" 
                    onClick={() => handleAddToCart(product)}
                  >
                    Adicionar ao carrinho
                  </button>
                </div>
              </div>
            )}
          </For>
        </div>
      </div>
      
      <div 
        class="cart-overlay" 
        classList={{ visible: cartStore.isOpen() }}
        onClick={() => cartStore.closeCart()}
      />
      
      <div class="cart-sidebar" classList={{ open: cartStore.isOpen() }}>
        <div class="cart-header">
          <h2>Carrinho</h2>
          <button class="close-cart" onClick={() => cartStore.closeCart()}>
            ✕
          </button>
        </div>
        
        <div class="cart-items">
          <Show
            when={cartStore.items().length > 0}
            fallback={
              <div class="empty-cart">
                <p>Seu carrinho está vazio</p>
              </div>
            }
          >
            <For each={cartStore.items()}>
              {(item) => (
                <div class="cart-item">
                  <div class="cart-item-image">🍺</div>
                  <div class="cart-item-details">
                    <div class="cart-item-name">{item.name}</div>
                    <div class="cart-item-info">
                      {item.liters}L • R$ {(item.pricePerLiter * item.liters).toFixed(2)}/un
                    </div>
                    <div class="cart-item-controls">
                      <button 
                        class="qty-btn"
                        onClick={() => cartStore.updateQuantity(item.id, item.liters, item.quantity - 1)}
                      >
                        −
                      </button>
                      <span class="cart-item-qty">{item.quantity}</span>
                      <button 
                        class="qty-btn"
                        onClick={() => cartStore.updateQuantity(item.id, item.liters, item.quantity + 1)}
                      >
                        +
                      </button>
                      <button 
                        class="remove-item"
                        onClick={() => cartStore.removeItem(item.id, item.liters)}
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </For>
          </Show>
        </div>
        
        <Show when={cartStore.items().length > 0}>
          <div class="cart-footer">
            <div class="cart-total">
              <span>Total:</span>
              <span>R$ {cartStore.getTotal().toFixed(2)}</span>
            </div>
            <div class="cart-actions">
              <button class="btn btn-primary btn-block" onClick={() => {
                const items = cartStore.items();
                const total = cartStore.getTotal();
                
                let message = 'Olá! Gostaria de fazer o seguinte pedido:\n\n';
                
                items.forEach(item => {
                  message += `${item.quantity}x ${item.name} (${item.liters}L)\n`;
                  message += `R$ ${(item.pricePerLiter * item.liters * item.quantity).toFixed(2)}\n\n`;
                });
                
                message += `*Total: R$ ${total.toFixed(2)}*`;
                
                const encoded = encodeURIComponent(message);
                window.open(`https://wa.me/5511999999999?text=${encoded}`, '_blank');
              }}>
                Finalizar pelo WhatsApp
              </button>
              <button class="btn btn-secondary btn-block" onClick={() => cartStore.clear()}>
                Limpar carrinho
              </button>
            </div>
          </div>
        </Show>
      </div>
    </div>
  );
}