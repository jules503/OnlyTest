import { gsap } from 'gsap';

/**
 * Появление блоков при попадании в экран.
 *
 * Таймлайны собираются сразу на старте и ставятся на паузу — за счёт этого
 * .from() применяет начальные состояния немедленно, и содержимое не успевает
 * мелькнуть в готовом виде перед анимацией. Intersection Observer только
 * запускает готовый таймлайн и отписывается: появление одноразовое.
 */
type RevealName = 'about' | 'support';

const builders: Record<RevealName, (root: HTMLElement) => gsap.core.Timeline> = {
  about: (root) =>
    gsap
      .timeline({ defaults: { ease: 'power2.out' } })
      .from(root.querySelectorAll('.about__title-text'), {
        yPercent: 100,
        duration: 1.2,
        stagger: 0.2,
        ease: 'power3.out',
      })
      .from(
        root.querySelectorAll('.about__description'),
        {
          opacity: 0,
          y: 24,
          duration: 1.1,
          stagger: 0.1,
        },
        0.2,
      ),

  support: (root) =>
    gsap
      .timeline({ defaults: { ease: 'power2.out' } })
      .from(root.querySelectorAll('.support__title-text'), {
        yPercent: 100,
        duration: 1.2,
        stagger: 0.2,
        ease: 'power3.out',
      })
      .from(
        root.querySelectorAll('.support__description, .support__button-wrapper'),
        {
          opacity: 0,
          y: 24,
          duration: 1.1,
          stagger: 0.1,
        },
        0.2,
      )
      .from(
        root.querySelectorAll('.support__image'),
        {
          opacity: 0,
          scale: 1.12,
          duration: 1.7,
        },
        0,
      ),
};

function isRevealName(value: string | undefined): value is RevealName {
  return value === 'about' || value === 'support';
}

export function initReveal(): void {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return;
  }

  const blocks = document.querySelectorAll<HTMLElement>('[data-reveal]');

  if (blocks.length === 0) {
    return;
  }

  const timelines = new Map<HTMLElement, gsap.core.Timeline>();

  blocks.forEach((block) => {
    const name = block.dataset.reveal;

    if (isRevealName(name)) {
      timelines.set(block, builders[name](block).pause());
    }
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        const block = entry.target as HTMLElement;
        timelines.get(block)?.play();
        observer.unobserve(block);
      });
    },
    // Не threshold: у высоких секций доля набирается, пока они ещё внизу
    // экрана. Здесь старт привязан к верху блока — он доходит до 60% экрана.
    { threshold: 0, rootMargin: '0px 0px -40% 0px' },
  );

  timelines.forEach((_timeline, block) => observer.observe(block));
}
