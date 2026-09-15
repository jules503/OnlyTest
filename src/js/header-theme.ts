/**
 * Тема шапки по секции, которая сейчас под ней.
 *
 * Observer только сообщает, что состав секций у верха экрана изменился.
 * Какую тему применить, решает геометрия — иначе при переходе, когда в полосу
 * попадают сразу две секции, цвет дёргался бы от порядка записей в колбэке.
 */

/**
 * Линия переключения — доля высоты экрана, считая от верха.
 * Чем больше значение, тем раньше срабатывает смена: 0 — секция дошла
 * до верха экрана, 0.5 — заняла нижнюю половину.
 */
const SWITCH_POINT = 0.28;

export function initHeaderTheme(): void {
  const header = document.querySelector<HTMLElement>('[data-js-header]');
  const sections = document.querySelectorAll<HTMLElement>('[data-header-theme]');

  if (!header || sections.length === 0) {
    return;
  }

  const switchLine = (): number => window.innerHeight * SWITCH_POINT;

  const applyCurrentTheme = (): void => {
    const line = switchLine();

    const active = Array.from(sections).find((section) => {
      const { top, bottom } = section.getBoundingClientRect();
      return top <= line && bottom > line;
    });

    // 'transparent' — состояние по умолчанию, отдельного класса под него нет
    const theme = active?.dataset.headerTheme ?? 'transparent';
    header.classList.toggle('header--light', theme === 'light');
    header.classList.toggle('header--dark', theme === 'dark');
  };

  let observer: IntersectionObserver | null = null;

  const observe = (): void => {
    observer?.disconnect();

    // Полоса наблюдения — от верха экрана до линии переключения.
    const bandBelow = Math.max(window.innerHeight - switchLine(), 0);

    observer = new IntersectionObserver(applyCurrentTheme, {
      rootMargin: `0px 0px -${bandBelow}px 0px`,
    });

    sections.forEach((section) => observer?.observe(section));
  };

  observe();
  applyCurrentTheme();

  window.addEventListener('resize', observe);
}
