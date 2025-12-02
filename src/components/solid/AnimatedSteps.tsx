import { onMount } from 'solid-js';
import gsap from 'gsap';
import anime from 'animejs';
import ScrollTrigger from 'gsap/ScrollTrigger';
import './AnimatedSteps.css';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function AnimatedSteps() {
  let containerRef: HTMLDivElement | undefined;

  const steps = [
    {
      icon: '📍',
      title: 'Informe seu endereço',
      description: 'Digite seu CEP e veja se atendemos sua região'
    },
    {
      icon: '🍺',
      title: 'Escolha o chopp',
      description: 'Selecione estilo, quantidade e data da festa'
    },
    {
      icon: '🚚',
      title: 'Chopeira e instalação',
      description: 'Levamos a chopeira e instalamos no local'
    },
    {
      icon: '🎉',
      title: 'Brinde com convidados',
      description: 'Aproveite chopp gelado de bar na sua casa'
    }
  ];

  onMount(() => {
    if (!containerRef) return;

    // Animação inicial com GSAP ScrollTrigger
    ScrollTrigger.create({
      trigger: containerRef,
      start: 'top 80%',
      onEnter: () => {
        // Animação dos cards com anime.js
        anime({
          targets: containerRef!.children,
          translateY: [80, 0],
          opacity: [0, 1],
          delay: anime.stagger(150),
          duration: 800,
          easing: 'easeOutCubic'
        });

        // Animação dos ícones
        anime({
          targets: '.step-icon',
          scale: [0, 1],
          rotate: [45, 0],
          delay: anime.stagger(150, { start: 400 }),
          duration: 600,
          easing: 'easeOutBack'
        });

        // Animação dos números
        anime({
          targets: '.step-number',
          scale: [0, 1],
          opacity: [0, 1],
          delay: anime.stagger(150, { start: 200 }),
          duration: 500,
          easing: 'easeOutElastic(1, .6)'
        });
      }
    });

    // Hover animation com anime.js
    const cards = containerRef.children;
    Array.from(cards).forEach((card: any) => {
      card.addEventListener('mouseenter', () => {
        anime({
          targets: card,
          scale: 1.05,
          duration: 300,
          easing: 'easeOutQuad'
        });
      });

      card.addEventListener('mouseleave', () => {
        anime({
          targets: card,
          scale: 1,
          duration: 300,
          easing: 'easeOutQuad'
        });
      });
    });
  });

  return (
    <div class="steps-grid" ref={containerRef}>
      {steps.map((step, index) => (
        <div class="step-card">
          <div class="step-number">{index + 1}</div>
          <div class="step-icon">{step.icon}</div>
          <h3 class="step-title">{step.title}</h3>
          <p class="step-description">{step.description}</p>
        </div>
      ))}
    </div>
  );
}
