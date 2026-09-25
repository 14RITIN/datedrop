import { useEffect } from 'react';

/** Restore a useful focus position when a route or wizard step replaces its UI. */
export function usePageHeadingFocus(view: string | boolean) {
  useEffect(() => {
    const heading = document.querySelector<HTMLElement>('main h1');
    if (heading) {
      document.title = `${heading.textContent?.trim() || 'DateDrop'} | DateDrop`;
    }
    if (heading && document.activeElement !== heading) {
      heading.focus();
    }
  }, [view]);
}
