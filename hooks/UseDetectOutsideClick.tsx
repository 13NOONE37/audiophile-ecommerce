import { RefObject, useEffect } from 'react';

export function UseDetectOutsideClick(
  ref: RefObject<HTMLElement | null>,
  onOutsideClick: () => void,
  excludeRefs: RefObject<HTMLElement | null>[] = [],
) {
  useEffect(() => {
    function handlePointerDown(e: MouseEvent | TouchEvent) {
      if (!ref.current) return;

      for (const ref of excludeRefs) {
        if (ref.current?.contains(e.target as Node)) return;
      }

      if (!ref.current.contains(e.target as Node)) onOutsideClick();
    }

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('touchstart', handlePointerDown);

    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('touchstart', handlePointerDown);
    };
  }, [ref, onOutsideClick]);
}
