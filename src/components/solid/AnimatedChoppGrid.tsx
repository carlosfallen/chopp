import { onMount, createSignal, For } from 'solid-js';
import gsap from 'gsap';
import anime from 'animejs';
import ScrollTrigger from 'gsap/ScrollTrigger';
import './AnimatedChoppGrid.css';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

type Product = {
  id: string;
  name: string;
  category: string;
  description: string;
  sensorNotes: string;
  pricePerLiter: number;
  featured?: boolean;
  active?: boolean;
};

export default function AnimatedChoppGrid() {
  let containerRef: HTMLDivElement | undefined;
  const [products, setProducts] = createSignal<Product[]>([]);
  const [loading, setLoading] = createSignal(true);

  onMount(async () => {
    // Load products from API
    try {
      const response = await fetch('/api/products');
      const data = await response.json();
      console.log('Produtos carregados na landing:', data);
      setProducts(data.products?.filter((p: Product) => p.active && p.featured).slice(0, 6) || []);
    } catch (error) {
      console.error('Erro ao carregar produtos:', error);
    } finally {
      setLoading(false);
    }

    if (!containerRef) return;

    // Setup animations after products load
    setTimeout(() => {
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
      const cards = containerRef!.children;
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
    }, 100);
  });

  return (
    <>
      {loading() ? (
        <div class="chopp-grid">
          <div style="grid-column: 1/-1; text-align: center; padding: 3rem; color: var(--color-text-muted);">
            Carregando produtos...
          </div>
        </div>
      ) : products().length === 0 ? (
        <div class="chopp-grid">
          <div style="grid-column: 1/-1; text-align: center; padding: 3rem; color: var(--color-text-muted);">
            Nenhum produto em destaque no momento.
          </div>
        </div>
      ) : (
        <div class="chopp-grid" ref={containerRef}>
          <For each={products()}>
            {(product) => (
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
            )}
          </For>
        </div>
      )}
    </>
  );
}
