import { onMount } from 'solid-js';
import gsap from 'gsap';
import './AnimatedHero.css';

export default function AnimatedHero() {
  let containerRef: HTMLDivElement | undefined;
  let titleRef: HTMLHeadingElement | undefined;
  let subtitleRef: HTMLParagraphElement | undefined;
  let ctaRef: HTMLDivElement | undefined;
  let badgesRef: HTMLDivElement | undefined;
  
  onMount(() => {
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    
    tl.from(titleRef, {
      y: 60,
      opacity: 0,
      duration: 1
    })
    .from(subtitleRef, {
      y: 40,
      opacity: 0,
      duration: 0.8
    }, '-=0.6')
    .from(ctaRef?.children || [], {
      y: 30,
      opacity: 0,
      duration: 0.6,
      stagger: 0.15
    }, '-=0.4')
    .from(badgesRef?.children || [], {
      y: 20,
      opacity: 0,
      duration: 0.5,
      stagger: 0.1
    }, '-=0.3');
  });
  
  return (
    <div class="hero-content" ref={containerRef}>
      <div class="hero-text">
        <h1 ref={titleRef}>
          Chopp de bar na sua casa,<br/>
          <span class="highlight">sem complicação</span>
        </h1>
        
        <p class="hero-subtitle" ref={subtitleRef}>
          Chopeira gratuita, entrega rápida e instalação profissional.<br/>
          Transforme qualquer evento em uma experiência memorável.
        </p>
        
        <div class="hero-cta" ref={ctaRef}>
          <a href="/#calculadora" class="btn btn-primary btn-lg">
            Calcular meu chopp ideal
          </a>
          <a href="/loja" class="btn btn-secondary btn-lg">
            Ver produtos
          </a>
        </div>
        
        <div class="hero-badges" ref={badgesRef}>
          <div class="badge">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
              <polyline points="22 4 12 14.01 9 11.01"/>
            </svg>
            <span>Chopeira gratuita*</span>
          </div>
          <div class="badge">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            </svg>
            <span>Entrega e instalação</span>
          </div>
          <div class="badge">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 2L2 7l10 5 10-5-10-5z"/>
              <path d="M2 17l10 5 10-5M2 12l10 5 10-5"/>
            </svg>
            <span>Marcas premium</span>
          </div>
        </div>
        
        <p class="hero-disclaimer">
          *Empréstimo da chopeira mediante pedido mínimo de 30L. Consulte condições.
        </p>
      </div>
    </div>
  );
}