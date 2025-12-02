// FILE: src/components/shop/Cart.tsx (corrigido)
import { Show, For, createSignal, onMount } from 'solid-js';
import { cartStore, type CartItem } from '../../store/cart';
import './Cart.css';

export default function Cart() {
  const [whatsappNumber, setWhatsappNumber] = createSignal('5511999999999');

  onMount(async () => {
    try {
      const response = await fetch('/api/settings');
      if (response.ok) {
        const settings = await response.json();
        if (settings.whatsapp) {
          // Remove caracteres não numéricos
          const cleaned = settings.whatsapp.replace(/\D/g, '');
          setWhatsappNumber('55' + cleaned);
        }
      }
    } catch (error) {
      console.error('Error loading WhatsApp number:', error);
    }
  });

  const handleCheckout = () => {
    const items = cartStore.items();
    const total = cartStore.getTotal();

    let message = 'Olá! Gostaria de fazer o seguinte pedido:\n\n';

    items.forEach(item => {
      message += `${item.quantity}x ${item.name} (${item.liters}L)\n`;
      message += `R$ ${(item.pricePerLiter * item.liters * item.quantity).toFixed(2)}\n\n`;
    });

    message += `*Total: R$ ${total.toFixed(2)}*`;

    const encoded = encodeURIComponent(message);
    window.open(`https://wa.me/${whatsappNumber()}?text=${encoded}`, '_blank');
  };
  
  return (
    <>
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
              <button class="btn btn-primary btn-block" onClick={handleCheckout}>
                Finalizar pelo WhatsApp
              </button>
              <button class="btn btn-secondary btn-block" onClick={() => cartStore.clear()}>
                Limpar carrinho
              </button>
            </div>
          </div>
        </Show>
      </div>
    </>
  );
}