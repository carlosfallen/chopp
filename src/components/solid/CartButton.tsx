// FILE: src/components/solid/CartButton.tsx (corrigido)
import { cartStore } from '../../store/cart';
import { onMount } from 'solid-js';
import './CartButton.css';

export default function CartButton() {
  onMount(() => {
    cartStore.initFromStorage();
  });

  const totalItems = () => cartStore.getTotalItems();

  return (
    <button class="cart-button" onClick={() => {
      if (window.location.pathname !== '/loja') {
        window.location.href = '/loja#carrinho';
      } else {
        cartStore.toggleCart();
      }
    }}>
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="9" cy="21" r="1"/>
        <circle cx="20" cy="21" r="1"/>
        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
      </svg>
      <span
        classList={{ 'cart-badge': true, hidden: totalItems() === 0 }}
        aria-hidden={totalItems() === 0}
      >
        {totalItems()}
      </span>
    </button>
  );
}
