import { RefObject, useEffect } from 'react';

export function UseDetectOutsideClick(
  ref: RefObject<HTMLElement | null>,
  onOutsideClick: () => void,
  excludeRefs: RefObject<HTMLElement | null>[] = [],
) {
  useEffect(() => {
    function handleDocumentClick(e: MouseEvent) {
      const target = e.target as Node;
      if (!ref.current) return;
      for (const exRef of excludeRefs) {
        if (exRef.current?.contains(target)) return;
      }

      if (!ref.current.contains(target)) onOutsideClick();
    }

    document.addEventListener('click', handleDocumentClick);

    return () => {
      document.removeEventListener('click', handleDocumentClick);
    };
  }, [ref, onOutsideClick, excludeRefs]);
}
