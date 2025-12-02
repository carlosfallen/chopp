import { onMount } from 'solid-js';
import gsap from 'gsap';
import anime from 'animejs';
import ScrollTrigger from 'gsap/ScrollTrigger';
import { products } from '../../data/products';
import './AnimatedChoppGrid.css';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function AnimatedChoppGrid() {
  let containerRef: HTMLDivElement | undefined;

  const featuredProducts = products.slice(0, 6);

  onMount(() => {
    if (!containerRef) return;

    // Animação inicial com ScrollTrigger + anime.js
    ScrollTrigger.create({
      trigger: containerRef,
      start: 'top 75%',
      onEnter: () => {
        // Animação dos cards
        anime({
          targets: containerRef!.children,
          translateY: [100, 0],
          opacity: [0, 1],
          scale: [0.9, 1],
          delay: anime.stagger(100),
          duration: 900,
          easing: 'easeOutExpo'
        });

        // Animação das categorias
        anime({
          targets: '.chopp-category',
          translateX: [-50, 0],
          opacity: [0, 1],
          delay: anime.stagger(100, { start: 300 }),
          duration: 600,
          easing: 'easeOutQuad'
        });

        // Animação dos botões
        anime({
          targets: '.btn-sm',
          scale: [0, 1],
          delay: anime.stagger(100, { start: 600 }),
          duration: 400,
          easing: 'easeOutBack'
        });
      }
    });

    // Hover effects com anime.js
    const cards = containerRef.children;
    Array.from(cards).forEach((card: any) => {
      card.addEventListener('mouseenter', () => {
        anime({
          targets: card,
          translateY: -12,
          boxShadow: '0 20px 40px rgba(212, 175, 55, 0.3)',
          duration: 300,
          easing: 'easeOutQuad'
        });
      });

      card.addEventListener('mouseleave', () => {
        anime({
          targets: card,
          translateY: 0,
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)',
          duration: 300,
          easing: 'easeOutQuad'
        });
      });
    });

    // Animação suave dos ícones de chopp
    anime({
      targets: '.chopp-image-placeholder',
      rotate: [0, 360],
      duration: 20000,
      easing: 'linear',
      loop: true
    });
  });

  return (
    <div class="chopp-grid" ref={containerRef}>
      {featuredProducts.map(product => (
        <div class="chopp-card">
          <div class="chopp-image">
            <div class="chopp-image-placeholder">🍺</div>
          </div>
          <div class="chopp-content">
            <span class="chopp-category">{product.category}</span>
            <h3 class="chopp-name">{product.name}</h3>
            <p class="chopp-description">{product.description}</p>
            <p class="chopp-sensor">{product.sensorNotes}</p>
            <div class="chopp-footer">
              <span class="chopp-price">
                A partir de <strong>R$ {product.pricePerLiter.toFixed(2)}/L</strong>
              </span>
              <a href="/loja" class="btn btn-secondary btn-sm">Ver mais</a>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
