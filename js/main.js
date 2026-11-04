(function () {
  'use strict';
  const toggle = document.querySelector('.menu-toggle');
  const mobileNav = document.querySelector('.mobile-nav');
  function closeNavigation() {
    if (!toggle) return;
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Open navigation');
    mobileNav.hidden = true;
  }
  toggle?.addEventListener('click', () => {
    const open = toggle.getAttribute('aria-expanded') !== 'true';
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
    mobileNav.hidden = !open;
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && toggle?.getAttribute('aria-expanded') === 'true') {
      closeNavigation(); toggle.focus();
    }
  });
  document.addEventListener('click', event => { if (!event.target.closest('.site-header')) closeNavigation(); });
  matchMedia('(min-width: 761px)').addEventListener('change', event => { if (event.matches) closeNavigation(); });
  document.querySelectorAll('[data-year]').forEach(el => { el.textContent = new Date().getFullYear(); });

  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  if ('IntersectionObserver' in window && !reducedMotion.matches) {
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('revealed'); observer.unobserve(entry.target); }
    }), { threshold: .1 });
    document.querySelectorAll('.reveal').forEach(el => { el.classList.add('will-reveal'); observer.observe(el); });
  }
  const hero = document.querySelector('.hero');
  let ticking = false;
  function updateParallax() {
    ticking = false;
    if (reducedMotion.matches || innerWidth < 761 || !hero) return;
    const fraction = Math.min(1, Math.max(0, scrollY / hero.offsetHeight));
    document.querySelectorAll('[data-parallax]').forEach(el => { el.style.setProperty('--parallax', `${fraction * Number(el.dataset.parallax)}px`); });
  }
  if (hero) addEventListener('scroll', () => { if (!ticking) { requestAnimationFrame(updateParallax); ticking = true; } }, { passive: true });

  const grid = document.querySelector('#product-grid');
  if (!grid) return;
  const products = window.CREMINO_PRODUCTS || [];
  const categories = ['all', 'ice-cream', 'cakes', 'chocolates', 'desserts', 'pastries'];
  function render(category, updateUrl = false) {
    if (!categories.includes(category)) category = 'all';
    document.querySelectorAll('[data-category]').forEach(button => {
      const active = button.dataset.category === category;
      button.classList.toggle('active', active); button.setAttribute('aria-pressed', String(active));
    });
    const filtered = products.filter(product => category === 'all' || product.category === category);
    grid.replaceChildren(...filtered.map(product => {
      const article = document.createElement('article');
      article.className = 'product-card';
      const image = document.createElement('img');
      image.src = product.image; image.alt = product.alt; image.loading = 'lazy'; image.width = 560; image.height = 700;
      const imageWrap = document.createElement('div'); imageWrap.className = 'product-photo'; imageWrap.append(image);
      const details = document.createElement('div'); details.className = 'product-details';
      const label = document.createElement('span'); label.className = 'product-label'; label.textContent = 'PHOTO SELECTION';
      const title = document.createElement('h2'); title.textContent = product.name;
      const desc = document.createElement('p'); desc.textContent = product.description;
      const bottom = document.createElement('div'); bottom.className = 'product-bottom';
      const price = document.createElement('span'); price.className = 'product-price';
      price.textContent = typeof product.price === 'number' && Number.isFinite(product.price) ? new Intl.NumberFormat('en-US', { style: 'currency', currency: CREMINO_CONFIG.currency }).format(product.price) : 'Price on request';
      const add = document.createElement('button'); add.type = 'button'; add.className = 'add-button'; add.dataset.addProduct = product.id; add.setAttribute('aria-label', `Add ${product.name} to cart`); add.innerHTML = 'Add to cart <span aria-hidden="true">+</span>';
      bottom.append(price, add); details.append(label, title, desc, bottom); article.append(imageWrap, details); return article;
    }));
    document.querySelector('#product-count').textContent = `${filtered.length} selections`;
    if (updateUrl && location.protocol !== 'file:') {
      const url = new URL(location.href); category === 'all' ? url.searchParams.delete('category') : url.searchParams.set('category', category);
      history.replaceState({}, '', url);
    }
  }
  document.querySelectorAll('[data-category]').forEach(button => button.addEventListener('click', () => render(button.dataset.category, true)));
  render(new URLSearchParams(location.search).get('category') || 'all');
})();
