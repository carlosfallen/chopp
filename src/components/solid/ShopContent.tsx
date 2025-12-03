// FILE: src/components/solid/ShopContent.tsx
import { createSignal, For, Show, onMount } from 'solid-js';
import { cartStore, type CartItem } from '../../store/cart';
import './ShopContent.css';

interface Product {
  id: string;
  name: string;
  category: string;
  description: string;
  pricePerLiter: number;
  availableSizes: number[];
  image?: string;
  imageUrl?: string;
}

export default function ShopContent() {
  const [filter, setFilter] = createSignal<string>('all');
  const [selectedSizes, setSelectedSizes] = createSignal<Record<string, number>>({});
  const [products, setProducts] = createSignal<Product[]>([]);
  const [loading, setLoading] = createSignal(true);
  
  const categories = () => {
    const cats = products().map(p => p.category);
    return ['all', ...new Set(cats)];
  };
  
  const filteredProducts = () => {
    if (filter() === 'all') return products();
    return products().filter(p => p.category === filter());
  };

  const getImageUrl = (product: Product) => {
    return product.imageUrl || product.image || '';
  };
  
  const getSelectedSize = (productId: string) => {
    const product = products().find(p => p.id === productId);
    return selectedSizes()[productId] || product?.availableSizes[0] || 30;
  };
  
  const setSize = (productId: string, size: number) => {
    setSelectedSizes({ ...selectedSizes(), [productId]: size });
  };
  
  const handleAddToCart = (product: Product) => {
    const size = getSelectedSize(product.id);
    cartStore.addItem({
      id: product.id,
      name: product.name,
      category: product.category,
      description: product.description,
      pricePerLiter: product.pricePerLiter,
      liters: size,
      image: getImageUrl(product)
    });
    cartStore.openCart();
  };
  
  onMount(async () => {
    cartStore.initFromStorage();
    const hash = window.location.hash;
    if (hash === '#carrinho') {
      cartStore.openCart();
    }

    try {
      const response = await fetch('/api/products');
      const data = await response.json();
      console.log('Products loaded:', data.products);
      setProducts(data.products);
      setLoading(false);
    } catch (error) {
      console.error('Error loading products:', error);
      setLoading(false);
    }
  });
  
  return (
    <div class="shop-container">
      <div class="container">
        <div class="shop-filters">
          <For each={categories()}>
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
        
        {loading() ? (
          <div style="text-align: center; padding: 4rem; color: rgba(255, 255, 255, 0.6);">
            Carregando produtos...
          </div>
        ) : products().length === 0 ? (
          <div style="text-align: center; padding: 4rem; color: rgba(255, 255, 255, 0.6);">
            Nenhum produto cadastrado
          </div>
        ) : (
          <div class="products-grid">
            <For each={filteredProducts()}>
              {(product: Product) => (

<div class="product-card visible">
  <a href={`/produto/${product.id}`} class="product-link">
    <div class="product-image">
      {getImageUrl(product) ? (
        <img 
          src={getImageUrl(product)} 
          alt={product.name} 
          style={{
            width: '100%',
            height: '100%',
            'object-fit': 'cover',
            'border-radius': '0.75rem'
          }}
          onError={(e) => {
            console.error('Image failed to load:', getImageUrl(product));
            e.currentTarget.style.display = 'none';
            const parent = e.currentTarget.parentElement;
            if (parent) {
              parent.innerHTML = '<div style="width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; font-size: 4rem;">🍺</div>';
            }
          }}
        />
      ) : (
        <div style="width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; font-size: 4rem;">
          🍺
        </div>
      )}
    </div>
    <div class="product-content">
      <span class="product-category">{product.category}</span>
      <h3 class="product-name">{product.name}</h3>
      <p class="product-description">{product.description}</p>
    </div>
  </a>
  
  <div class="product-actions">
    <div class="product-sizes">
      <For each={product.availableSizes}>
        {(size: number) => (
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
        )}
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
              {(item: CartItem) => (
                <div class="cart-item">
                  <div class="cart-item-image">
                    {item.image ? (
                      <img 
                        src={item.image} 
                        alt={item.name} 
                        style={{
                          width: '100%',
                          height: '100%',
                          'object-fit': 'cover',
                          'border-radius': '0.5rem'
                        }}
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                          const parent = e.currentTarget.parentElement;
                          if (parent) {
                            parent.innerHTML = '<div style="width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; font-size: 2rem;">🍺</div>';
                          }
                        }}
                      />
                    ) : (
                      <div style="width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; font-size: 2rem;">
                        🍺
                      </div>
                    )}
                  </div>
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
              <a href="/checkout" class="btn btn-primary btn-block" style="text-align: center; text-decoration: none; display: block;">
                Finalizar Pedido
              </a>
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