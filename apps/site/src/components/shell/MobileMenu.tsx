'use client';

import { useEffect } from 'react';

/**
 * Progressive enhancement for the native <details id="mobile-menu"> disclosure in the header.
 * Without JS it still opens and closes. With JS it adds: focus into the panel, Esc to close with
 * focus returning to the summary, outside tap to close, close on link tap or when the viewport
 * grows past the phone layout, and `inert` on page content while open.
 */
export function MobileMenu() {
  useEffect(() => {
    const menu = document.getElementById('mobile-menu');
    if (!(menu instanceof HTMLDetailsElement)) return;
    const summary = menu.querySelector('summary');
    const desktop = window.matchMedia('(min-width: 768px)');

    const setInert = (inert: boolean) => {
      document.querySelectorAll<HTMLElement>('[data-inert-when-menu]').forEach((el) => {
        // The floating pill may also be inert on its own (data-away); keep that.
        el.inert = inert || el.getAttribute('data-away') === 'true';
      });
    };
    const close = (refocus: boolean) => {
      if (!menu.open) return;
      menu.open = false;
      if (refocus) summary?.focus();
    };

    const onToggle = () => {
      setInert(menu.open);
      if (menu.open) menu.querySelector<HTMLElement>('.menu-panel a')?.focus();
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && menu.open) close(true);
    };
    const onPointer = (event: PointerEvent) => {
      if (menu.open && event.target instanceof Node && !menu.contains(event.target)) close(false);
    };
    const onClick = (event: MouseEvent) => {
      if (event.target instanceof Element && event.target.closest('.menu-panel a')) close(false);
    };
    const onBreakpoint = () => {
      if (desktop.matches) close(false);
    };

    menu.addEventListener('toggle', onToggle);
    menu.addEventListener('click', onClick);
    document.addEventListener('keydown', onKey);
    document.addEventListener('pointerdown', onPointer);
    desktop.addEventListener('change', onBreakpoint);
    return () => {
      menu.removeEventListener('toggle', onToggle);
      menu.removeEventListener('click', onClick);
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('pointerdown', onPointer);
      desktop.removeEventListener('change', onBreakpoint);
      setInert(false);
    };
  }, []);

  return null;
}
