import { gsap } from 'gsap';

// Появление первого экрана при загрузке.
//
// Числа во втором аргументе .from() — абсолютное время старта на таймлайне,
// а не задержка от предыдущего шага. За счёт этого шаги накладываются.
export function playIntro() {
  const timeline = gsap.timeline({ defaults: { ease: 'power2.out' } });

  timeline
    .from('.hero__image', {
      opacity: 0,
      scale: 1.12,
      duration: 1.6,
    })
    .from(
      '.hero__title-text',
      {
        yPercent: 100,
        duration: 1.2,
        stagger: 0.2,
        ease: 'power3.out',
      },
      1.2,
    )
    .from(
      '.hero__subtitle',
      {
        opacity: 0,
        y: 24,
        duration: 1.1,
      },
      1.9,
    )
    .from(
      '.header',
      {
        opacity: 0,
        duration: 1.1,
      },
      2.3,
    );
}
