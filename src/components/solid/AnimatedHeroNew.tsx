// src/components/solid/AnimatedHeroNew.tsx
import { onMount, createSignal } from 'solid-js';
import gsap from 'gsap';
import './AnimatedHeroNew.css';

export default function AnimatedHeroNew() {
  let leftPaneRef: HTMLDivElement | undefined;
  let rightPaneRef: HTMLDivElement | undefined;
  let titleRef: HTMLHeadingElement | undefined;
  let subtitleRef: HTMLParagraphElement | undefined;
  let ctaRef: HTMLDivElement | undefined;
  let imageRef: HTMLImageElement | undefined;
  
  const [mousePos, setMousePos] = createSignal({ x: 0, y: 0 });
  
  onMount(() => {
    // Timeline principal
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    
    // Animação de entrada
    tl.from(leftPaneRef, {
      x: -100,
      opacity: 0,
      duration: 1
    })
    .from(titleRef?.children || [], {
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
    }, '-=0.3')
    .from(rightPaneRef, {
      x: 100,
      opacity: 0,
      duration: 1
    }, '-=1')
    .from(imageRef, {
      scale: 1.2,
      opacity: 0,
      duration: 1.2
    }, '-=0.8');
    
    // Parallax na imagem
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 40;
      const y = (e.clientY / window.innerHeight - 0.5) * 40;
      setMousePos({ x, y });
      
      if (imageRef) {
        gsap.to(imageRef, {
          x: x,
          y: y,
          duration: 1.5,
          ease: 'power2.out'
        });
      }
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    
    return () => window.removeEventListener('mousemove', handleMouseMove);
  });
  
  return (
    <>
      <div class="hero-left-pane" ref={leftPaneRef}>
        <div class="hero-content-wrapper">
          <div class="hero-badge">
            <span class="badge-icon">🏆</span>
            <span>Melhor Chopp Delivery 2024</span>
          </div>
          
          <h1 ref={titleRef}>
            <span class="title-line">Chopp de Bar</span>
            <span class="title-line highlight">Na Sua Casa</span>
            <span class="title-line">Sem Complicação</span>
          </h1>
          
          <p class="hero-subtitle" ref={subtitleRef}>
            Chopeira profissional gratuita, entrega express e instalação completa.
            <strong> Transforme qualquer momento em celebração.</strong>
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
            src="https://images.unsplash.com/photo-1608270586620-248524c67de9?w=800&q=80" 
            alt="Chopeira profissional servindo chopp gelado"
            class="hero-image"
          />
          
          {/* Floating Cards */}
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
    </>
  );
}