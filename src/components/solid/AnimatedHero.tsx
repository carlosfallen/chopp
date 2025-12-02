// FILE: src/components/solid/AnimatedHero.tsx
import { createSignal, onMount } from 'solid-js';
import gsap from 'gsap';
import anime from 'animejs';
import './AnimatedHero.css';

interface LayoutConfig {
  heroTitle?: string;
  heroSubtitle?: string;
  heroImage?: string;
  backgroundColor?: string;
  primaryColor?: string;
  secondaryColor?: string;
  showStats?: boolean;
  showBadge?: boolean;
}

export default function AnimatedHero() {
  const [config, setConfig] = createSignal<LayoutConfig>({
    heroTitle: 'Chopp de Bar\nNa Sua Casa\nSem Complicação',
    heroSubtitle: 'Chopeira profissional gratuita, entrega express e instalação completa. Transforme qualquer momento em celebração.',
    heroImage: 'https://images.unsplash.com/photo-1608270586620-248524c67de9?w=1200&q=80',
    backgroundColor: '#0a0a0a',
    primaryColor: '#d4af37',
    secondaryColor: '#ffbf00',
    showStats: true,
    showBadge: true
  });

  let containerRef: HTMLDivElement | undefined;
  let leftPaneRef: HTMLDivElement | undefined;
  let rightPaneRef: HTMLDivElement | undefined;
  let titleRef: HTMLHeadingElement | undefined;
  let subtitleRef: HTMLParagraphElement | undefined;
  let ctaRef: HTMLDivElement | undefined;
  let imageRef: HTMLImageElement | undefined;

  onMount(async () => {
    // Carregar configurações do admin
    try {
      const [settingsRes, layoutRes] = await Promise.all([
        fetch('/api/settings'),
        fetch('/api/layout-config')
      ]);

      if (settingsRes.ok) {
        const settings = await settingsRes.json();
        if (settings.heroImage) {
          setConfig(c => ({ ...c, heroImage: settings.heroImage }));
        }
      }

      if (layoutRes.ok) {
        const layout = await layoutRes.json();
        setConfig(c => ({ ...c, ...layout }));
      }
    } catch (error) {
      console.error('Error loading config:', error);
    }

    // Animação inicial com GSAP
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    tl.from(leftPaneRef, {
      x: -100,
      opacity: 0,
      duration: 1
    })
    .from(titleRef?.querySelectorAll('.title-line') || [], {
      y: 80,
      opacity: 0,
      duration: 0.8,
      stagger: 0.2
    }, '-=0.6')
    .from(subtitleRef, {
      y: 40,
      opacity: 0,
      duration: 0.7
    }, '-=0.4')
    .from(ctaRef?.children || [], {
      y: 30,
      scale: 0.9,
      opacity: 0,
      duration: 0.6,
      stagger: 0.15
    }, '-=0.3');

    // Animação da imagem com anime.js
    anime({
      targets: rightPaneRef,
      translateX: [100, 0],
      opacity: [0, 1],
      duration: 1000,
      easing: 'easeOutExpo',
      delay: 400
    });

    anime({
      targets: imageRef,
      scale: [1.2, 1],
      opacity: [0, 1],
      duration: 1500,
      easing: 'easeOutCubic',
      delay: 600
    });

    // Animação dos floating cards
    const cards = rightPaneRef?.querySelectorAll('.floating-card');
    if (cards) {
      anime({
        targets: cards,
        translateY: [-50, 0],
        opacity: [0, 1],
        duration: 800,
        delay: anime.stagger(200, { start: 1200 }),
        easing: 'spring(1, 80, 10, 0)'
      });
    }

    // Parallax com mouse
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 30;
      const y = (e.clientY / window.innerHeight - 0.5) * 30;

      if (imageRef) {
        gsap.to(imageRef, {
          x: x,
          y: y,
          duration: 1.5,
          ease: 'power2.out'
        });
      }

      // Parallax nos cards
      if (cards) {
        cards.forEach((card, index) => {
          const factor = (index + 1) * 0.5;
          gsap.to(card, {
            x: x * factor,
            y: y * factor,
            duration: 1.5,
            ease: 'power2.out'
          });
        });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Floating animation contínua nos cards
    if (cards) {
      cards.forEach((card, index) => {
        anime({
          targets: card,
          translateY: [0, -10, 0],
          duration: 3000 + (index * 500),
          easing: 'easeInOutSine',
          loop: true
        });
      });
    }

    return () => window.removeEventListener('mousemove', handleMouseMove);
  });

  const titleLines = () => config().heroTitle?.split('\n') || [];

  return (
    <div class="hero-container" ref={containerRef}>
      <div class="hero-left-pane" ref={leftPaneRef}>
        <div class="hero-content-wrapper">
          {config().showBadge && (
            <div class="hero-badge">
              <span class="badge-icon">🏆</span>
              <span>Melhor Chopp Delivery 2024</span>
            </div>
          )}

          <h1 ref={titleRef} class="hero-title">
            {titleLines().map((line, index) => (
              <span class="title-line" classList={{ highlight: index === 1 }}>
                {line}
              </span>
            ))}
          </h1>

          <p class="hero-subtitle" ref={subtitleRef}>
            {config().heroSubtitle}
          </p>

          <div class="hero-cta-group" ref={ctaRef}>
            <a href="/#calculadora" class="btn btn-primary btn-hero">
              <span>Calcular Quantidade</span>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="5" y1="12" x2="19" y2="12"/>
                <polyline points="12 5 19 12 12 19"/>
              </svg>
            </a>
            <a href="/loja" class="btn btn-secondary btn-hero">
              <span>Ver Produtos</span>
            </a>
          </div>

          {config().showStats && (
            <div class="hero-stats">
              <div class="stat-item">
                <strong>5.000+</strong>
                <span>Eventos Realizados</span>
              </div>
              <div class="stat-divider"></div>
              <div class="stat-item">
                <strong>4.9/5</strong>
                <span>Avaliação Média</span>
              </div>
              <div class="stat-divider"></div>
              <div class="stat-item">
                <strong>24h</strong>
                <span>Entrega Express</span>
              </div>
            </div>
          )}
        </div>
      </div>

      <div class="hero-right-pane" ref={rightPaneRef}>
        <div class="hero-image-wrapper">
          <div class="image-glow"></div>
          <img
            ref={imageRef}
            src={config().heroImage}
            alt="Chopeira profissional servindo chopp gelado"
            class="hero-image"
          />

          <div class="floating-card card-1">
            <div class="card-icon">🍺</div>
            <div class="card-text">
              <strong>8+ Estilos</strong>
              <span>Pilsen, IPA, Weiss...</span>
            </div>
          </div>

          <div class="floating-card card-2">
            <div class="card-icon">❄️</div>
            <div class="card-text">
              <strong>-2°C</strong>
              <span>Temperatura ideal</span>
            </div>
          </div>

          <div class="floating-card card-3">
            <div class="card-icon">✓</div>
            <div class="card-text">
              <strong>Grátis</strong>
              <span>Chopeira inclusa</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
