// FILE: src/components/solid/AnimatedChoppGrid.tsx
import { onMount, createSignal, For } from 'solid-js';
import gsap from 'gsap';
import { animate, stagger } from 'animejs';
import ScrollTrigger from 'gsap/ScrollTrigger';
import './AnimatedChoppGrid.css';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface Product {
  id: string;
  name: string;
  category: string;
  description: string;
  sensorNotes: string;
  pricePerLiter: number;
  image?: string;
  imageUrl?: string;
}

export default function AnimatedChoppGrid() {
  let containerRef: HTMLDivElement | undefined;
  const [products, setProducts] = createSignal<Product[]>([]);
  const [loading, setLoading] = createSignal(true);

  const getImageUrl = (product: Product) => {
    return product.imageUrl || product.image || '';
  };

  onMount(async () => {
    try {
      const response = await fetch('/api/products');
      const data = await response.json();
      console.log('Products loaded:', data.products);
      const featuredProducts = data.products.slice(0, 6);
      setProducts(featuredProducts);
      setLoading(false);

      setTimeout(() => {
        if (!containerRef) return;

        ScrollTrigger.create({
          trigger: containerRef,
          start: 'top 75%',
          onEnter: () => {
            const cards = Array.from(containerRef!.children);

            animate(cards, {
              y: [100, 0],
              opacity: [0, 1],
              scale: [0.9, 1],
              delay: stagger(100),
              duration: 900,
              ease: 'outExpo',
            });

            const categories = containerRef!.querySelectorAll('.chopp-category');
            if (categories.length) {
              animate(categories, {
                x: [-50, 0],
                opacity: [0, 1],
                delay: stagger(100, { start: 300 }),
                duration: 600,
                ease: 'outQuad',
              });
            }

            const buttons = containerRef!.querySelectorAll('.btn-sm');
            if (buttons.length) {
              animate(buttons, {
                scale: [0, 1],
                delay: stagger(100, { start: 600 }),
                duration: 400,
                ease: 'outBack',
              });
            }
          },
        });

        const cards = Array.from(containerRef.children);
        cards.forEach((card) => {
          card.addEventListener('mouseenter', () => {
            animate(card, {
              y: -12,
              boxShadow: '0 20px 40px rgba(212, 175, 55, 0.3)',
              duration: 300,
              ease: 'outQuad',
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

        const placeholders = containerRef.querySelectorAll('.chopp-image-placeholder');
        if (placeholders.length) {
          animate(placeholders, {
            rotate: [0, 360],
            duration: 20000,
            ease: 'linear',
            loop: true,
          });
        }
      }, 100);
    } catch (error) {
      console.error('Error loading products:', error);
      setLoading(false);
    }
  });

  return (
    <div class="chopp-grid" ref={containerRef}>
      {loading() ? (
        <div style="grid-column: 1 / -1; text-align: center; padding: 3rem; color: rgba(255, 255, 255, 0.6);">
          Carregando produtos...
        </div>
      ) : products().length === 0 ? (
        <div style="grid-column: 1 / -1; text-align: center; padding: 3rem; color: rgba(255, 255, 255, 0.6);">
          Nenhum produto cadastrado
        </div>
      ) : (
        <For each={products()}>
          {(product) => (
            <div class="chopp-card">
              <div class="chopp-image">
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
                      const placeholder = e.currentTarget.nextElementSibling;
                      if (placeholder) {
                        (placeholder as HTMLElement).style.display = 'flex';
                      }
                    }}
                  />
                ) : null}
                <div 
                  class="chopp-image-placeholder" 
                  style={{
                    display: getImageUrl(product) ? 'none' : 'flex'
                  }}
                >
                  🍺
                </div>
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
      )}
    </div>
  );
}