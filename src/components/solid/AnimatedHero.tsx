// FILE: src/components/solid/AnimatedHero.tsx
import { onMount } from 'solid-js';
import gsap from 'gsap';
import { animate, stagger  } from "animejs"

import './AnimatedHero.css';

export default function AnimatedHero() {
  let containerRef: HTMLDivElement | undefined;
  let leftPaneRef: HTMLDivElement | undefined;
  let rightPaneRef: HTMLDivElement | undefined;
  let titleRef: HTMLHeadingElement | undefined;
  let subtitleRef: HTMLParagraphElement | undefined;
  let ctaRef: HTMLDivElement | undefined;
  let imageRef: HTMLImageElement | undefined;

  onMount(() => {
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
    .fromTo(
      ctaRef?.children || [],
      {
        y: 30,
        scale: 0.9,
        opacity: 0
      },
      {
        y: 0,
        scale: 1,
        opacity: 1,
        duration: 0.6,
        stagger: 0.15,
        clearProps: 'all' // remove inline styles so CTA fica visível mesmo se animação falhar depois
      },
      '-=0.3'
    );

// Animação da imagem com animejs v4 (animate)

if (rightPaneRef) {
  animate(rightPaneRef, {
    translateX: [100, 0],
    opacity: [0, 1],
    duration: 1000,
    easing: 'easeOutExpo',
    delay: 400
  });
}

if (imageRef) {
  animate(imageRef, {
    scale: [1.2, 1],
    opacity: [0, 1],
    duration: 1500,
    easing: 'easeOutCubic',
    delay: 600
  });
}
const cards = rightPaneRef?.querySelectorAll('.floating-card');
// Animação dos floating cards
if (rightPaneRef) {
  const cards = rightPaneRef.querySelectorAll('.floating-card');
  if (cards.length > 0) {
    animate(cards, {
      translateY: [-100, 0],
      opacity: [0, 1],
      duration: 800,
      delay: stagger(200, { start: 1200 }),
      easing: 'spring(1, 80, 10, 0)'
    });
  }
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

// Floating animation contínua nos cards (Anime.js v4)
if (cards && cards.length > 0) {
  cards.forEach((card, index) => {
    animate(card, {
      translateY: [0, -10, 0, 10, 0], // leve "flutuação"
      duration: 3000 + index * 500,
      ease: 'inOutSine',              // antes: 'easeInOutSine'
      loop: true                      // loop infinito
    });
  });
}

    return () => window.removeEventListener('mousemove', handleMouseMove);
  });

  return (
    <div class="hero-container" ref={containerRef}>
      <div class="hero-left-pane" ref={leftPaneRef}>
        <div class="hero-content-wrapper">
          <h1 ref={titleRef} class="hero-title">
            <span class="title-line">Chopp de Bar</span>
            <span class="title-line highlight">Na Sua Casa</span>
            <span class="title-line">Sem Complicação</span>
          </h1>

          <p class="hero-subtitle" ref={subtitleRef}>
            Chopeira profissional gratuita, entrega express e instalação completa. Transforme qualquer momento em celebração.
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
        </div>
      </div>

      <div class="hero-right-pane" ref={rightPaneRef}>
        <div class="hero-image-wrapper">
          <div class="image-glow"></div>
          <img
            ref={imageRef}
            src="https://pub-59d8b8edbc6f497984f8a95046b2263b.r2.dev/1764702094867-barril_50l.png"
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
