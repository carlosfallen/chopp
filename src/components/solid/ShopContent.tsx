// FILE: src/components/solid/ShopContent.tsx
import { createSignal, For, Show, onMount } from 'solid-js';
import { products } from '../../data/products';
import { cartStore, type CartItem } from '../../store/cart';
import './ShopContent.css';

export default function ShopContent() {
  const [filter, setFilter] = createSignal<string>('all');
  const [selectedSizes, setSelectedSizes] = createSignal<Record<string, number>>({});
  const [showCheckout, setShowCheckout] = createSignal(false);
  const [checkoutData, setCheckoutData] = createSignal({
    name: '',
    phone: '',
    email: '',
    paymentMethod: 'pix'
  });
  
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
  
  const handleCheckout = async () => {
    const data = checkoutData();
    
    if (!data.name || !data.phone) {
      alert('Por favor, preencha nome e telefone');
      return;
    }
    
    const items = cartStore.items();
    const total = cartStore.getTotal();
    
    const order = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      customerName: data.name,
      customerPhone: data.phone,
      customerEmail: data.email,
      paymentMethod: data.paymentMethod,
      items: items.map(item => ({
        productId: item.id,
        productName: item.name,
        liters: item.liters,
        quantity: item.quantity,
        price: item.pricePerLiter * item.liters * item.quantity
      })),
      total: total,
      status: 'pending' as const,
      createdAt: new Date().toISOString()
    };
    
    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(order)
      });
      
      if (!response.ok) throw new Error('Erro ao criar pedido');
      
      alert('Pedido enviado com sucesso! Aguarde confirmação do pagamento.');
      cartStore.clear();
      setShowCheckout(false);
      setCheckoutData({ name: '', phone: '', email: '', paymentMethod: 'pix' });
    } catch (error) {
      console.error('Error creating order:', error);
      alert('Erro ao enviar pedido. Tente novamente.');
    }
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
        
        <div class="products-grid">
          <For each={filteredProducts()}>
            {(product: typeof products[0]) => (
              <div class="product-card visible">
                <div class="product-image">🍺</div>
                <div class="product-content">
                  <span class="product-category">{product.category}</span>
                  <h3 class="product-name">{product.name}</h3>
                  <p class="product-description">{product.description}</p>
                  
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
      </div>
      
      <div 
        class="cart-overlay" 
        classList={{ visible: cartStore.isOpen() || showCheckout() }}
        onClick={() => {
          cartStore.closeCart();
          setShowCheckout(false);
        }}
      />
      
      <Show when={!showCheckout()}>
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
      </Show>
      
      <Show when={showCheckout()}>
        <div class="checkout-modal" classList={{ open: showCheckout() }}>
          <div class="modal-header">
            <h2>Finalizar Pedido</h2>
            <button class="modal-close" onClick={() => setShowCheckout(false)}>✕</button>
          </div>
          
          <div class="checkout-form">
            <div class="form-group">
              <label>Nome Completo *</label>
              <input
                type="text"
                value={checkoutData().name}
                onInput={(e) => setCheckoutData({ ...checkoutData(), name: e.currentTarget.value })}
                required
              />
            </div>
            
            <div class="form-group">
              <label>Telefone (WhatsApp) *</label>
              <input
                type="tel"
                value={checkoutData().phone}
                onInput={(e) => setCheckoutData({ ...checkoutData(), phone: e.currentTarget.value })}
                placeholder="(11) 99999-9999"
                required
              />
            </div>
            
            <div class="form-group">
              <label>E-mail</label>
              <input
                type="email"
                value={checkoutData().email}
                onInput={(e) => setCheckoutData({ ...checkoutData(), email: e.currentTarget.value })}
              />
            </div>
            
            <div class="form-group">
              <label>Forma de Pagamento *</label>
              <select
                value={checkoutData().paymentMethod}
                onChange={(e) => setCheckoutData({ ...checkoutData(), paymentMethod: e.currentTarget.value })}
              >
                <option value="pix">PIX</option>
                <option value="credit">Cartão de Crédito</option>
                <option value="debit">Cartão de Débito</option>
                <option value="cash">Dinheiro</option>
              </select>
            </div>
            
            <div class="checkout-summary">
              <h3>Resumo do Pedido</h3>
              <For each={cartStore.items()}>
                {(item) => (
                  <div class="summary-item">
                    <span>{item.quantity}x {item.name} ({item.liters}L)</span>
                    <span>R$ {(item.pricePerLiter * item.liters * item.quantity).toFixed(2)}</span>
                  </div>
                )}
              </For>
              <div class="summary-total">
                <strong>Total:</strong>
                <strong>R$ {cartStore.getTotal().toFixed(2)}</strong>
              </div>
            </div>
            
            <button class="btn btn-primary btn-block" onClick={handleCheckout}>
              Confirmar Pedido
            </button>
          </div>
        </div>
      </Show>
    </div>
  );
}