import { onMount } from 'solid-js';
import gsap from 'gsap';
import { animate, stagger } from 'animejs';
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

  // Animação inicial com ScrollTrigger + Anime.js v4
  ScrollTrigger.create({
    trigger: containerRef,
    start: 'top 75%',
    onEnter: () => {
      const cards = Array.from(containerRef!.children);

      // Animação dos cards
      animate(cards, {
        y: [100, 0],          // antes: translateY: [100, 0]
        opacity: [0, 1],
        scale: [0.9, 1],
        delay: stagger(100),  // antes: anime.stagger(100)
        duration: 900,
        ease: 'outExpo',      // antes: easing: 'easeOutExpo'
      });

      // Animação das categorias
      const categories = containerRef!.querySelectorAll('.chopp-category');
      if (categories.length) {
        animate(categories, {
          x: [-50, 0],                       // antes: translateX: [-50, 0]
          opacity: [0, 1],
          delay: stagger(100, { start: 300 }),
          duration: 600,
          ease: 'outQuad',                   // antes: 'easeOutQuad'
        });
      }

      // Animação dos botões
      const buttons = containerRef!.querySelectorAll('.btn-sm');
      if (buttons.length) {
        animate(buttons, {
          scale: [0, 1],
          delay: stagger(100, { start: 600 }),
          duration: 400,
          ease: 'outBack',                   // antes: 'easeOutBack'
        });
      }
    },
  });

  // Hover effects com Anime.js v4
  const cards = Array.from(containerRef.children);
  cards.forEach((card) => {
    card.addEventListener('mouseenter', () => {
      animate(card, {
        y: -12, // antes: translateY: -12
        boxShadow: '0 20px 40px rgba(212, 175, 55, 0.3)',
        duration: 300,
        ease: 'outQuad', // antes: 'easeOutQuad'
      });
    });

    card.addEventListener('mouseleave', () => {
      animate(card, {
        y: 0,
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)',
        duration: 300,
        ease: 'outQuad',
      });
    });
  });

  // Animação suave dos ícones de chopp (loop)
  const placeholders = containerRef.querySelectorAll('.chopp-image-placeholder');
  if (placeholders.length) {
    animate(placeholders, {
      rotate: [0, 360],
      duration: 20000,
      ease: 'linear',
      loop: true,
    });
  }
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
