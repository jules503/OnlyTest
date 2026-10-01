import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Затемнение фона первого экрана в фирменный цвет по мере прокрутки.
//
// Здесь нужен именно прогресс скролла, а не факт входа в экран, поэтому
// ScrollTrigger со scrub, а не Intersection Observer: непрозрачность слоя
// привязана к положению страницы и отматывается назад при скролле вверх.
export function initHeroScroll() {
  const hero = document.querySelector<HTMLElement>('.hero__main');
  const fade = document.querySelector<HTMLElement>('.hero__fade');

  if (!hero || !fade) {
    return;
  }

  gsap.to(fade, {
    opacity: 1,
    ease: 'none',
    scrollTrigger: {
      trigger: hero,
      start: 'top top',
      end: 'bottom top',
      scrub: true,
    },
  });
}
