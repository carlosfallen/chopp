import { onMount } from 'solid-js';
import gsap from 'gsap';
import { animate, stagger } from 'animejs';
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
      const children = Array.from(containerRef!.children);

      // Animação dos cards (antes: anime({ targets: containerRef!.children, ... }))
      animate(children, {
        translateY: [80, 0],
        opacity: [0, 1],
        delay: stagger(150),
        duration: 800,
        ease: 'outCubic', // antes: easing: 'easeOutCubic'
      });

      // Animação dos ícones (antes: targets: '.step-icon')
      const icons = containerRef!.querySelectorAll('.step-icon');
      if (icons.length) {
        animate(icons, {
          scale: [0, 1],
          rotate: [45, 0],
          delay: stagger(150, { start: 400 }),
          duration: 600,
          ease: 'outBack', // antes: 'easeOutBack'
        });
      }

      // Animação dos números
      const numbers = containerRef!.querySelectorAll('.step-number');
      if (numbers.length) {
        animate(numbers, {
          scale: [0, 1],
          opacity: [0, 1],
          delay: stagger(150, { start: 200 }),
          duration: 500,
          ease: 'outElastic(1, .6)', // antes: 'easeOutElastic(1, .6)'
        });
      }
    },
  });

  // Hover animation com Anime.js v4
  const cards = Array.from(containerRef.children);

  cards.forEach((card) => {
    card.addEventListener('mouseenter', () => {
      animate(card, {
        scale: 1.05,
        duration: 300,
        ease: 'outQuad', // antes: 'easeOutQuad'
      });
    });

    card.addEventListener('mouseleave', () => {
      animate(card, {
        scale: 1,
        duration: 300,
        ease: 'outQuad',
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
