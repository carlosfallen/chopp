import { onMount } from 'solid-js';
import gsap from 'gsap';
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
    
    gsap.from(containerRef.children, {
      scrollTrigger: {
        trigger: containerRef,
        start: 'top 80%'
      },
      y: 60,
      opacity: 0,
      duration: 0.6,
      stagger: 0.15,
      ease: 'power3.out'
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
