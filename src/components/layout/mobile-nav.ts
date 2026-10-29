export function initMobileNav(): void {
  const toggleBtn = document.getElementById('mobile-nav-toggle');
  const closeBtn = document.getElementById('mobile-nav-close');
  const drawer = document.getElementById('mobile-nav-drawer');
  const backdrop = document.getElementById('mobile-nav-backdrop');

  if (
    !(toggleBtn instanceof HTMLButtonElement) ||
    !(drawer instanceof HTMLElement) ||
    !(backdrop instanceof HTMLElement)
  ) {
    return;
  }

  let isOpen = false;

  const getFocusableElements = (): HTMLElement[] => {
    const focusable = drawer.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );
    const elements: HTMLElement[] = [];
    for (let i = 0; i < focusable.length; i++) {
      const el = focusable.item(i);
      if (el instanceof HTMLElement) {
        elements.push(el);
      }
    }
    return elements;
  };

  const openNav = (): void => {
    isOpen = true;
    toggleBtn.setAttribute('aria-expanded', 'true');
    toggleBtn.setAttribute('aria-label', 'Zatvoriť navigáciu');
    drawer.classList.remove('hidden');
    backdrop.classList.remove('hidden');
    document.body.classList.add('overflow-hidden');

    const focusables = getFocusableElements();
    const first = focusables[0];
    if (first instanceof HTMLElement) {
      first.focus();
    }
  };

  const closeNav = (restoreFocus = true): void => {
    isOpen = false;
    toggleBtn.setAttribute('aria-expanded', 'false');
    toggleBtn.setAttribute('aria-label', 'Otvoriť navigáciu');
    drawer.classList.add('hidden');
    backdrop.classList.add('hidden');
    document.body.classList.remove('overflow-hidden');
    if (restoreFocus) {
      toggleBtn.focus();
    }
  };

  toggleBtn.addEventListener('click', () => {
    if (isOpen) {
      closeNav();
    } else {
      openNav();
    }
  });

  if (closeBtn instanceof HTMLButtonElement) {
    closeBtn.addEventListener('click', () => {
      closeNav();
    });
  }

  backdrop.addEventListener('click', () => {
    closeNav();
  });

  // Close drawer when clicking any navigation link inside it
  const drawerLinks = drawer.querySelectorAll<HTMLAnchorElement>('a[href]');
  for (let i = 0; i < drawerLinks.length; i++) {
    const link = drawerLinks.item(i);
    if (link instanceof HTMLAnchorElement) {
      link.addEventListener('click', () => {
        if (isOpen) {
          closeNav(false);
        }
      });
    }
  }

  // Close drawer if viewport is resized to desktop breakpoint
  window.addEventListener('resize', () => {
    if (isOpen && window.innerWidth >= 768) {
      closeNav(false);
    }
  });

  document.addEventListener('keydown', (event: KeyboardEvent) => {
    if (!isOpen) {
      return;
    }

    if (event.key === 'Escape') {
      event.preventDefault();
      closeNav();
      return;
    }

    if (event.key === 'Tab') {
      const focusables = getFocusableElements();
      if (focusables.length === 0) {
        return;
      }

      const first = focusables[0];
      const last = focusables[focusables.length - 1];

      if (event.shiftKey) {
        if (document.activeElement === first && last instanceof HTMLElement) {
          event.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last && first instanceof HTMLElement) {
          event.preventDefault();
          first.focus();
        }
      }
    }
  });
}

if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMobileNav);
  } else {
    initMobileNav();
  }
}
