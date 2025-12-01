import { onMount } from 'solid-js';
import gsap from 'gsap';
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
    
    gsap.from(containerRef.children, {
      scrollTrigger: {
        trigger: containerRef,
        start: 'top 80%'
      },
      y: 80,
      opacity: 0,
      duration: 0.7,
      stagger: 0.1,
      ease: 'power3.out'
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