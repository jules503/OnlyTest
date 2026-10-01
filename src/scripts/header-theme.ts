// Тема шапки по секции, которая сейчас под ней.
//
// Observer только сообщает, что состав секций у верха экрана изменился.
// Какую тему применить, решает геометрия — иначе при переходе, когда в полосу
// попадают сразу две секции, цвет дёргался бы от порядка записей в колбэке.

// Линия переключения — доля высоты экрана, считая от верха.
// Чем больше значение, тем раньше срабатывает смена: 0 — секция дошла
// до верха экрана, 0.5 — заняла нижнюю половину.
const SWITCH_POINT = 0.28;

const switchLine = () => window.innerHeight * SWITCH_POINT;

/**
 * Красит переданный элемент по теме секции, которая сейчас пересекает линию
 * переключения.
 *
 * @param target элемент, на котором переключаются классы темы
 * @param sections секции с data-header-theme, среди которых ищется активная
 * @param block имя БЭМ-блока target — из него собираются модификаторы темы
 */
export const applyCurrentTheme = (
  target: HTMLElement,
  sections: Iterable<HTMLElement>,
  block: string,
) => {
  const line = switchLine();

  const active = Array.from(sections).find((section) => {
    const { top, bottom } = section.getBoundingClientRect();
    return top <= line && bottom > line;
  });

  // 'transparent' — состояние по умолчанию, отдельного класса под него нет
  const theme = active?.dataset.headerTheme ?? 'transparent';
  target.classList.toggle(`${block}--light`, theme === 'light');
  target.classList.toggle(`${block}--dark`, theme === 'dark');
};

export function initHeaderTheme() {
  const header = document.querySelector<HTMLElement>('[data-js-header]');
  const sections = document.querySelectorAll<HTMLElement>('[data-header-theme]');

  if (!header || sections.length === 0) {
    return;
  }

  const applyTheme = () => applyCurrentTheme(header, sections, 'header');

  let observer: IntersectionObserver | null = null;

  const observe = () => {
    observer?.disconnect();

    // Полоса наблюдения — от верха экрана до линии переключения.
    const bandBelow = Math.max(window.innerHeight - switchLine(), 0);

    observer = new IntersectionObserver(applyTheme, {
      rootMargin: `0px 0px -${bandBelow}px 0px`,
    });

    sections.forEach((section) => observer?.observe(section));
  };

  // Observer не присылает событие, если полосу никто не пересёк, — тогда тема
  // остаётся от прошлой секции. Подстраховываемся пересчётом на самой прокрутке;
  // requestAnimationFrame держит его не чаще одного раза на кадр.
  let frame = 0;

  const scheduleApply = () => {
    if (frame) {
      return;
    }

    frame = requestAnimationFrame(() => {
      frame = 0;
      applyTheme();
    });
  };

  observe();
  applyTheme();

  window.addEventListener('scroll', scheduleApply, { passive: true });
  window.addEventListener('resize', observe);
}
