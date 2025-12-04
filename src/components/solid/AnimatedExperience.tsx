import { onMount, onCleanup, createSignal, createEffect } from 'solid-js';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import './AnimatedExperience.css';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function AnimatedExperience() {
  let containerRef: HTMLDivElement | undefined;
  const [currentVideo, setCurrentVideo] = createSignal(0);
  const [isTransitioning, setIsTransitioning] = createSignal(false);
  let autoplayId: number | undefined;
  let videoRefs: (HTMLVideoElement | undefined)[] = [];
  
  const videos = [
    {
      title: 'Chopeira servindo pint cremoso',
      description: 'Close em copo sendo preenchido com espuma cremosa direto da torneira.',
      src: 'https://videocdn.cdnpk.net/videos/55817ebb-69b1-4316-8c62-4257f317f7a3/horizontal/previews/clear/large.mp4?token=exp=1764801087~hmac=8e711a41b59a05f81cfaaaecd34e1215cb773d8a5c1be1e6af3545bbdfe821e3',
      accent: '#FFB800'
    },
    {
      title: 'Fluxo perfeito na torre',
      description: 'Barril regulado gelando o chopp enquanto a torneira abre o fluxo.',
      src: 'https://videocdn.cdnpk.net/videos/5373f6af-ecb4-4e85-8772-cbc93d02b8ff/horizontal/previews/clear/large.mp4?token=exp=1764799869~hmac=151b2e10bf779c4dbb6d5a0798d2991eb73d076eecf53b971d2c6ea36d58c40d',
      accent: '#FF6B35'
    },
    {
      title: 'Tap duplo para eventos',
      description: 'Dois taps atendendo convidados ao mesmo tempo, sem fila.',
      src: 'https://videocdn.cdnpk.net/videos/9cc7aa47-4a75-5576-88e1-ca2d6720a8f3/horizontal/previews/clear/large.mp4?token=exp=1764799818~hmac=1a865bf9e464dbe234dd56caf66292e6684131b2ef7b8d878c6d2cc85ff333d7',
      accent: '#4ECDC4'
    }
  ];
  
  const playCurrentVideo = () => {
    const currentVideoEl = videoRefs[currentVideo()];
    if (currentVideoEl) {
      currentVideoEl.currentTime = 0;
      currentVideoEl.play().catch(() => {});
    }
  };

  const pauseAllVideos = () => {
    videoRefs.forEach(video => {
      if (video) {
        video.pause();
      }
    });
  };

  const goTo = (step: number) => {
    if (isTransitioning()) return;
    
    setIsTransitioning(true);
    pauseAllVideos();
    const newIndex = (currentVideo() + step + videos.length) % videos.length;
    setCurrentVideo(newIndex);
    
    setTimeout(() => setIsTransitioning(false), 600);
  };
  
  const stopAutoplay = () => {
    if (autoplayId) {
      clearInterval(autoplayId);
      autoplayId = undefined;
    }
  };
  
  const startAutoplay = () => {
    stopAutoplay();
    autoplayId = window.setInterval(() => goTo(1), 12000);
  };

  createEffect(() => {
    const index = currentVideo();
    pauseAllVideos();
    setTimeout(() => playCurrentVideo(), 100);
  });
  
  onMount(() => {
    if (!containerRef) return;
    
    startAutoplay();
    playCurrentVideo();
    
    gsap.fromTo(
      containerRef,
      { opacity: 0, y: 80 },
      {
        opacity: 1,
        y: 0,
        duration: 1.2,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: containerRef,
          start: 'top 85%',
          toggleActions: 'play none none reverse'
        }
      }
    );
  });

  onCleanup(() => {
    stopAutoplay();
    pauseAllVideos();
  });
  
  return (
    <div class="experience-container" ref={containerRef}>
      <div 
        class="carousel-wrapper"
        onMouseEnter={stopAutoplay}
        onMouseLeave={startAutoplay}
        onTouchStart={stopAutoplay}
      >
        <div class="carousel-main">
          <div
            class="carousel-track"
            style={{ 
              transform: `translateX(-${currentVideo() * 100}%)`,
              transition: 'transform 0.7s cubic-bezier(0.4, 0, 0.2, 1)'
            }}
          >
            {videos.map((video, index) => (
              <div class="carousel-slide">
                <div 
                  class="video-wrapper"
                  style={{ 
                    '--accent-color': video.accent 
                  }}
                >
                  <div class="video-frame">
                    <video
                      ref={(el) => videoRefs[index] = el}
                      autoplay
                      muted
                      loop
                      preload="auto"
                      class="video-element"
                    >
                      <source src={video.src} type="video/mp4" />
                    </video>
                  </div>
                  <div class="video-gradient"></div>
                </div>
                
                <div class="slide-info">
                  <div class="slide-meta">
                    <span class="slide-index">0{index + 1}</span>
                    <span class="slide-divider">/</span>
                    <span class="slide-total">0{videos.length}</span>
                  </div>
                  <h3 class="slide-title">{video.title}</h3>
                  <p class="slide-description">{video.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div class="carousel-controls">
          <button 
            class="control-btn control-prev" 
            type="button" 
            onClick={() => goTo(-1)}
            disabled={isTransitioning()}
            aria-label="Vídeo anterior"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M15 18l-6-6 6-6"/>
            </svg>
          </button>

          <div class="carousel-dots">
            {videos.map((video, index) => (
              <button
                type="button"
                class="dot"
                classList={{ active: index === currentVideo() }}
                onClick={() => {
                  if (!isTransitioning()) {
                    pauseAllVideos();
                    setCurrentVideo(index);
                    startAutoplay();
                  }
                }}
                style={{ '--accent': video.accent }}
                aria-label={`Ir para vídeo ${index + 1}`}
              >
                <span class="dot-fill"></span>
              </button>
            ))}
          </div>

          <button 
            class="control-btn control-next" 
            type="button" 
            onClick={() => goTo(1)}
            disabled={isTransitioning()}
            aria-label="Próximo vídeo"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M9 18l6-6-6-6"/>
            </svg>
          </button>
        </div>
      </div>

      <div class="experience-cta">
        <p class="cta-text">Pronto para levar essa experiência para sua casa?</p>
        <a href="/loja" class="cta-button">
          <span>Ver Chopeiras Disponíveis</span>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
        </a>
      </div>
    </div>
  );
}