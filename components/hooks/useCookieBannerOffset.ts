import { useEffect, useState } from 'react';

export interface CookieBannerOffset {
  offsetBottomPx: number;
}

export default function useCookieBannerOffset(selector = '[data-cookie-banner]'): CookieBannerOffset {
  const [offsetBottomPx, setOffsetBottomPx] = useState(0);

  useEffect(() => {
    const el = document.querySelector(selector) as HTMLElement | null;
    if (!el) return;

    const update = () => {
      const h = el.offsetHeight || 0;
      const visible = getComputedStyle(el).display !== 'none' && h > 0;
      setOffsetBottomPx(visible ? h + 12 : 0);
    };

    const ro = new ResizeObserver(update);
    ro.observe(el);
    update();

    return () => ro.disconnect();
  }, [selector]);

  return { offsetBottomPx };
}
