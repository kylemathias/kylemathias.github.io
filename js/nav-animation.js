// Navigation transition controller
(function() {
  const MOBILE_BREAKPOINT = 768;
  const NAV_DIRECTION_KEY = 'km-nav-direction';
  const FALLBACK_DURATION_MS = 560;

  function isMobileDevice() {
    return window.innerWidth <= MOBILE_BREAKPOINT;
  }

  function isHomePage() {
    return window.location.pathname.endsWith('index.html') ||
      window.location.pathname === '/' ||
      window.location.pathname.endsWith('/');
  }

  function supportsViewTransitions() {
    return !isMobileDevice() &&
      typeof document.startViewTransition === 'function' &&
      typeof CSS !== 'undefined' &&
      typeof CSS.supports === 'function' &&
      CSS.supports('view-transition-name: site-nav-shell');
  }

  function getNavElement() {
    return document.getElementById('animated-nav');
  }

  function getHomeLink(navElement) {
    return navElement ? navElement.querySelector('.nav-header-link') : null;
  }

  function getNavLinks(navElement) {
    return navElement ? Array.from(navElement.querySelectorAll('.nav-link')) : [];
  }

  function isPlainLeftClick(event) {
    return event.button === 0 && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey;
  }

  function getResolvedPath(href) {
    return new URL(href, window.location.href).pathname;
  }

  function isCurrentPageLink(href) {
    return getResolvedPath(href) === window.location.pathname;
  }

  function isHomeTarget(href) {
    const targetPath = getResolvedPath(href);
    return targetPath.endsWith('/index.html') || targetPath === '/' || targetPath.endsWith('/');
  }

  function setTransitionDirection(direction) {
    try {
      sessionStorage.setItem(NAV_DIRECTION_KEY, direction);
    } catch (error) {
      return;
    }
  }

  function consumeTransitionDirection() {
    let direction = '';

    try {
      direction = sessionStorage.getItem(NAV_DIRECTION_KEY) || '';
      sessionStorage.removeItem(NAV_DIRECTION_KEY);
    } catch (error) {
      direction = '';
    }

    if (!direction) {
      return;
    }

    document.documentElement.dataset.navDirection = direction;

    window.setTimeout(function() {
      delete document.documentElement.dataset.navDirection;
    }, 900);
  }

  function updateActiveLinks() {
    const navElement = getNavElement();
    if (!navElement) {
      return;
    }

    const currentPath = window.location.pathname.split('/').pop() || 'index.html';

    getNavLinks(navElement).forEach(function(link) {
      const linkPath = link.getAttribute('href');
      link.classList.toggle('active-link', linkPath === currentPath);
    });

    const headerLink = getHomeLink(navElement);
    if (headerLink) {
      headerLink.classList.toggle('active-link', isHomePage());
    }
  }

  function resetTransitionClasses(navElement) {
    navElement.classList.remove('is-transitioning-to-inner', 'is-transitioning-to-home');
    delete navElement.dataset.transitioning;
    document.body.classList.remove('nav-transitioning-away', 'nav-transitioning-home');
  }

  function applyNavState(onHomePage) {
    const navElement = getNavElement();
    if (!navElement) {
      return;
    }

    navElement.classList.toggle('nav-center', onHomePage);
    navElement.classList.toggle('nav-top-left', !onHomePage);
    navElement.dataset.pageRole = onHomePage ? 'home' : 'inner';

    const headerLink = getHomeLink(navElement);
    if (headerLink) {
      headerLink.style.fontSize = onHomePage ? '3em' : '1.5em';
      headerLink.style.letterSpacing = onHomePage ? '0.02em' : '0.01em';
    }

    const subtitles = navElement.querySelectorAll('.subtitle, .subtitle-skills');
    subtitles.forEach(function(element) {
      element.setAttribute('aria-hidden', onHomePage ? 'false' : 'true');
      element.style.removeProperty('max-height');
      element.style.removeProperty('opacity');
      element.style.removeProperty('transform');
      element.style.removeProperty('margin-top');
      element.style.removeProperty('margin-bottom');
      element.style.removeProperty('filter');
      element.style.removeProperty('pointer-events');
      element.style.removeProperty('overflow');
    });

    resetTransitionClasses(navElement);
    updateActiveLinks();
  }

  function setupMobileToggle(navElement, onHomePage) {
    const mobileToggle = document.getElementById('mobile-nav-toggle');
    if (!mobileToggle) {
      return;
    }

    if (mobileToggle._clickHandler) {
      mobileToggle.removeEventListener('click', mobileToggle._clickHandler);
      delete mobileToggle._clickHandler;
    }

    if (onHomePage) {
      return;
    }

    const clickHandler = function() {
      this.classList.toggle('active');
      navElement.classList.toggle('mobile-menu-open');
    };

    mobileToggle._clickHandler = clickHandler;
    mobileToggle.addEventListener('click', clickHandler);
  }

  function handleHistoryNavigation() {
    applyNavState(isHomePage());
  }

  function navigateAfterFallback(targetHref, direction) {
    window.setTimeout(function() {
      setTransitionDirection(direction);
      window.location.href = targetHref;
    }, FALLBACK_DURATION_MS);
  }

  function triggerFallbackHomeExit(navElement, targetHref) {
    if (navElement.dataset.transitioning === 'true') {
      return;
    }

    navElement.dataset.transitioning = 'true';
    document.body.classList.add('nav-transitioning-away');
    navElement.classList.add('is-transitioning-to-inner');
    navigateAfterFallback(targetHref, 'to-inner');
  }

  function triggerFallbackHomeEntry(navElement, targetHref) {
    if (navElement.dataset.transitioning === 'true') {
      return;
    }

    navElement.dataset.transitioning = 'true';
    document.body.classList.add('nav-transitioning-home');
    navElement.classList.remove('nav-top-left');
    navElement.classList.add('nav-center', 'is-transitioning-to-home');
    navigateAfterFallback(targetHref, 'to-home');
  }

  function attachDesktopNavigation(navElement, useViewTransitions) {
    const headerLink = getHomeLink(navElement);
    const navLinks = getNavLinks(navElement);

    navLinks.forEach(function(link) {
      link.addEventListener('click', function(event) {
        const targetHref = this.getAttribute('href');
        if (!targetHref || !isPlainLeftClick(event) || isCurrentPageLink(targetHref)) {
          return;
        }

        if (useViewTransitions) {
          if (isHomePage()) {
            setTransitionDirection('to-inner');
            document.body.classList.add('nav-transitioning-away');
            navElement.dataset.transitioning = 'true';
          }
          return;
        }

        if (isHomePage()) {
          event.preventDefault();
          triggerFallbackHomeExit(navElement, targetHref);
        }
      });
    });

    if (!headerLink) {
      return;
    }

    headerLink.addEventListener('click', function(event) {
      const targetHref = this.getAttribute('href') || 'index.html';
      if (!targetHref || !isPlainLeftClick(event) || isCurrentPageLink(targetHref)) {
        return;
      }

      if (!isHomeTarget(targetHref)) {
        return;
      }

      if (useViewTransitions) {
        if (!isHomePage()) {
          setTransitionDirection('to-home');
          document.body.classList.add('nav-transitioning-home');
          navElement.dataset.transitioning = 'true';
        }
        return;
      }

      if (!isHomePage()) {
        event.preventDefault();
        triggerFallbackHomeEntry(navElement, targetHref);
      }
    });
  }

  function initializeNav() {
    const navElement = getNavElement();
    if (!navElement) {
      return;
    }

    applyNavState(isHomePage());
    setupMobileToggle(navElement, isHomePage());

    if (navElement.dataset.navBindingsAttached === 'true') {
      return;
    }

    if (!isMobileDevice()) {
      attachDesktopNavigation(navElement, supportsViewTransitions());
    }

    navElement.dataset.navBindingsAttached = 'true';
  }

  window.resetNavPosition = handleHistoryNavigation;
  consumeTransitionDirection();
  initializeNav();

  if (window.performance && window.performance.navigation && window.performance.navigation.type === 2) {
    handleHistoryNavigation();
  } else if (window.performance && window.performance.getEntriesByType) {
    const navEntries = window.performance.getEntriesByType('navigation');
    if (navEntries.length > 0 && navEntries[0].type === 'back_forward') {
      handleHistoryNavigation();
    }
  }

  window.addEventListener('pageshow', function(event) {
    if (event.persisted) {
      handleHistoryNavigation();
    }
  });

  window.addEventListener('popstate', function() {
    handleHistoryNavigation();
  });

  document.addEventListener('DOMContentLoaded', function() {
    initializeNav();
  });

  window.addEventListener('resize', function() {
    const wasMobile = isMobileDevice();
    window.setTimeout(function() {
      const isMobileNow = isMobileDevice();
      if (wasMobile !== isMobileNow) {
        window.location.reload();
      }
    }, 100);
  });
})();