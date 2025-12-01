import { onMount } from 'solid-js';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import './AnimatedExperience.css';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function AnimatedExperience() {
  let containerRef: HTMLDivElement | undefined;
  
  const features = [
    {
      icon: '🍻',
      title: 'Chopeira pronta para uso',
      description: 'Equipamento profissional, higienizado e regulado na temperatura ideal para seu chopp'
    },
    {
      icon: '🔧',
      title: 'Instalação especializada',
      description: 'Nossa equipe monta, testa e garante o funcionamento perfeito antes de sair'
    },
    {
      icon: '🥤',
      title: 'Copos e acessórios',
      description: 'Opção de aluguel de copos, baldes de gelo e tudo que você precisa'
    },
    {
      icon: '📞',
      title: 'Suporte durante o evento',
      description: 'Atendimento via WhatsApp para qualquer dúvida ou necessidade'
    }
  ];
  
  onMount(() => {
    if (!containerRef) return;
    
    gsap.from(containerRef.children, {
      scrollTrigger: {
        trigger: containerRef,
        start: 'top 75%'
      },
      x: -50,
      opacity: 0,
      duration: 0.8,
      stagger: 0.2,
      ease: 'power3.out'
    });
  });
  
  return (
    <div class="experience-grid" ref={containerRef}>
      {features.map(feature => (
        <div class="experience-card">
          <div class="experience-icon">{feature.icon}</div>
          <div class="experience-text">
            <h3>{feature.title}</h3>
            <p>{feature.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
}