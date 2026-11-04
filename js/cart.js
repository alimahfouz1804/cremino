/* CREMINO's browser-local selection. No account or server is required. */
(function () {
  'use strict';

  const STORAGE_KEY = 'cremino-cart-v1';
  const MAX_QUANTITY = 99;
  let products = new Map();
  let items = [];
  let dialog;
  let toast;
  let liveRegion;
  let dialogLiveRegion;
  let opener;
  let closeTimer;
  let toastTimer;
  let storageAvailable = true;

  const element = (tag, className, text) => {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  };

  function money(value) {
    const currency = (window.CREMINO_CONFIG || {}).currency || 'USD';
    try {
      return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(value);
    } catch (_) {
      return '$' + value.toFixed(2);
    }
  }

  function hasPrice(product) {
    return typeof product.price === 'number' && Number.isFinite(product.price) && product.price >= 0;
  }

  function normalize(raw) {
    if (!Array.isArray(raw)) return [];
    const valid = new Map();
    raw.slice(0, 500).forEach((entry) => {
      if (!entry || typeof entry.id !== 'string' || !products.has(entry.id)) return;
      if (!Number.isInteger(entry.quantity) || entry.quantity < 1) return;
      const quantity = Math.min(MAX_QUANTITY, entry.quantity);
      valid.set(entry.id, Math.min(MAX_QUANTITY, (valid.get(entry.id) || 0) + quantity));
    });
    return Array.from(valid, ([id, quantity]) => ({ id, quantity }));
  }

  function restore() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      items = saved ? normalize(JSON.parse(saved)) : [];
    } catch (error) {
      items = [];
      if (!(error instanceof SyntaxError)) storageAvailable = false;
    }
  }

  function save() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
      storageAvailable = true;
    } catch (_) {
      storageAvailable = false;
    }
  }

  function getItems() {
    return items.map((item) => ({
      id: item.id,
      quantity: item.quantity,
      product: { ...products.get(item.id) }
    }));
  }

  function totals() {
    let cents = 0;
    let count = 0;
    let hasUnknown = false;
    items.forEach((item) => {
      const product = products.get(item.id);
      count += item.quantity;
      if (hasPrice(product)) cents += Math.round(product.price * 100) * item.quantity;
      else hasUnknown = true;
    });
    return {
      count,
      knownSubtotal: cents / 100,
      hasUnknown,
      complete: !hasUnknown,
      total: hasUnknown ? null : cents / 100
    };
  }

  function announce(message) {
    liveRegion.textContent = '';
    dialogLiveRegion.textContent = '';
    window.setTimeout(() => { (dialog.open ? dialogLiveRegion : liveRegion).textContent = message; }, 20);
  }

  function showToast(message) {
    toast.querySelector('.cart-toast-message').textContent = message;
    toast.classList.add('is-visible');
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => toast.classList.remove('is-visible'), 5500);
    announce(message);
  }

  function buildMessage() {
    if (!items.length) return '';
    const lines = ['Hello CREMINO! 🍦', '', 'I would like to place an order:', ''];
    items.forEach((item, index) => {
      const product = products.get(item.id);
      let line = `${index + 1}. ${product.name} × ${item.quantity}`;
      if (hasPrice(product)) {
        line += ` — ${money(product.price)} each (${money(Math.round(product.price * 100) * item.quantity / 100)})`;
      } else {
        line += ' — price on request';
      }
      lines.push(line);
    });
    const summary = totals();
    lines.push('');
    if (summary.complete) {
      lines.push(`Total: ${money(summary.total)}`);
    } else {
      if (summary.knownSubtotal > 0) lines.push(`Known subtotal: ${money(summary.knownSubtotal)}`);
      lines.push('Total: please confirm the price.');
    }
    lines.push('', 'These selections use the photo descriptions on your website. Please confirm item details, availability and the final total.', '', 'Thank you!');
    return lines.join('\n');
  }

  function updateCheckout() {
    const checkout = dialog.querySelector('.cart-checkout');
    const number = String((window.CREMINO_CONFIG || {}).whatsapp || '').replace(/\D/g, '');
    const valid = /^[1-9]\d{5,14}$/.test(number) && items.length > 0;
    if (valid) {
      checkout.href = `https://wa.me/${number}?text=${encodeURIComponent(buildMessage())}`;
      checkout.removeAttribute('aria-disabled');
      checkout.removeAttribute('tabindex');
    } else {
      checkout.removeAttribute('href');
      checkout.setAttribute('aria-disabled', 'true');
      checkout.tabIndex = -1;
    }
  }

  function control(label, text, action, id) {
    const button = element('button', '', text);
    button.type = 'button';
    button.setAttribute('aria-label', label);
    button.dataset.cartAction = action;
    button.dataset.productId = id;
    return button;
  }

  function render() {
    const summary = totals();
    document.querySelectorAll('[data-cart-count]').forEach((node) => { node.textContent = String(summary.count); });
    document.querySelectorAll('[data-cart-open]').forEach((node) => {
      node.setAttribute('aria-label', `Open cart, ${summary.count} ${summary.count === 1 ? 'item' : 'items'}`);
    });
    const body = dialog.querySelector('.cart-body');
    body.replaceChildren();
    dialog.querySelector('.cart-footer').hidden = items.length === 0;
    dialog.querySelector('.cart-item-count').textContent = `${summary.count} ${summary.count === 1 ? 'item' : 'items'}`;

    if (!items.length) {
      const empty = element('div', 'cart-empty');
      const illustration = element('div', 'cart-empty-icon');
      illustration.setAttribute('aria-hidden', 'true');
      illustration.innerHTML = '<svg viewBox="0 0 64 64" width="64" height="64" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M17 23h30l4 31H13l4-31Z"/><path d="M24 24v-8a8 8 0 0 1 16 0v8"/><path d="M24 37c5 6 11 6 16 0" stroke-linecap="round"/></svg>';
      const link = element('a', 'button button-primary', 'Explore our menu');
      link.href = 'menu.html';
      empty.append(illustration, element('h3', '', 'A little happiness belongs here.'), element('p', '', 'Find your next sweet moment in our menu.'), link);
      body.append(empty);
    }

    items.forEach((item) => {
      const product = products.get(item.id);
      const row = element('article', 'cart-line');
      row.dataset.cartItem = item.id;
      const image = element('img', 'cart-line-image');
      image.src = product.image;
      image.alt = product.alt || product.name;
      image.width = 88;
      image.height = 110;
      const content = element('div', 'cart-line-content');
      const name = element('h3', 'cart-line-name', product.name);
      const price = element('p', 'cart-line-price', hasPrice(product) ? `${money(product.price)} each` : 'Price on request');
      const actions = element('div', 'cart-line-actions');
      const quantity = element('div', 'cart-quantity');
      quantity.setAttribute('role', 'group');
      quantity.setAttribute('aria-label', `Quantity for ${product.name}`);
      const minus = control(`Decrease quantity of ${product.name}`, '−', 'decrease', item.id);
      minus.disabled = item.quantity <= 1;
      const count = element('span', '', String(item.quantity));
      count.setAttribute('aria-label', `Quantity: ${item.quantity}`);
      const plus = control(`Increase quantity of ${product.name}`, '+', 'increase', item.id);
      plus.disabled = item.quantity >= MAX_QUANTITY;
      quantity.append(minus, count, plus);
      const remove = control(`Remove ${product.name} from cart`, 'Remove', 'remove', item.id);
      remove.className = 'cart-remove';
      actions.append(quantity, remove);
      content.append(name, price, actions);
      row.append(image, content);
      body.append(row);
    });

    dialog.querySelector('.cart-total-value').textContent = summary.hasUnknown ? 'To be confirmed' : money(summary.total);
    dialog.querySelector('.cart-known-subtotal').textContent = summary.hasUnknown && summary.knownSubtotal > 0 ? `Known subtotal: ${money(summary.knownSubtotal)}` : '';
    dialog.querySelector('.cart-quote-note').textContent = summary.hasUnknown
      ? 'We’ll confirm prices, availability and your final total on WhatsApp.'
      : 'CREMINO will confirm availability and any delivery charges on WhatsApp.';
    updateCheckout();
  }

  function commit(message) {
    save();
    render();
    announce(message + (storageAvailable ? '' : ' Your browser cannot save this selection after you leave the page.'));
  }

  function add(id) {
    if (!products.has(id)) return false;
    const existing = items.find((item) => item.id === id);
    if (existing && existing.quantity >= MAX_QUANTITY) {
      showToast('You can select up to 99 of each item.');
      return false;
    }
    if (existing) existing.quantity += 1;
    else items.push({ id, quantity: 1 });
    save();
    render();
    showToast(storageAvailable ? 'Added to your selection' : 'Added. Your browser cannot save this selection after you leave this page.');
    return true;
  }

  function open() {
    window.clearTimeout(closeTimer);
    dialog.classList.remove('is-closing');
    if (!dialog.open) {
      opener = document.activeElement;
      dialog.showModal();
      document.documentElement.classList.add('cart-is-open');
      document.body.classList.add('cart-is-open');
      requestAnimationFrame(() => dialog.classList.add('is-open'));
      dialog.querySelector('.cart-close').focus();
    }
    toast.classList.remove('is-visible');
  }

  function close() {
    if (!dialog.open) return;
    dialog.classList.remove('is-open');
    dialog.classList.add('is-closing');
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.clearTimeout(closeTimer);
    closeTimer = window.setTimeout(() => {
      dialog.close();
      dialog.classList.remove('is-closing');
      document.documentElement.classList.remove('cart-is-open');
      document.body.classList.remove('cart-is-open');
      if (opener && opener.isConnected && typeof opener.focus === 'function') opener.focus();
    }, reduced ? 0 : 220);
  }

  function init() {
    (window.CREMINO_PRODUCTS || []).forEach((product) => {
      if (product && typeof product.id === 'string' && typeof product.name === 'string') products.set(product.id, product);
    });
    dialog = element('dialog', 'cart-dialog');
    dialog.id = 'cart-dialog';
    dialog.setAttribute('aria-labelledby', 'cart-title');
    dialog.innerHTML = '<div class="cart-header"><div><p class="eyebrow">A MOMENT OF HAPPINESS</p><h2 id="cart-title">Your sweet selection</h2><p class="cart-item-count"></p></div><button class="cart-close" type="button" aria-label="Close cart"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18"/></svg></button></div><div class="cart-body"></div><div class="cart-footer"><div class="cart-total"><span>Total</span><strong class="cart-total-value"></strong></div><p class="cart-known-subtotal"></p><p class="cart-quote-note"></p><a class="cart-checkout button button-primary" target="_blank" rel="noopener noreferrer"><span>Order via WhatsApp</span><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M5 12h14m-6-6 6 6-6 6"/></svg></a><p class="cart-checkout-caption">Opens a prepared message. Send it when you’re ready.</p></div>';
    liveRegion = element('div', 'sr-only');
    liveRegion.setAttribute('role', 'status');
    liveRegion.setAttribute('aria-live', 'polite');
    liveRegion.setAttribute('aria-atomic', 'true');
    dialogLiveRegion = liveRegion.cloneNode();
    dialog.append(dialogLiveRegion);
    toast = element('div', 'cart-toast');
    toast.id = 'cart-toast';
    const toastMessage = element('span', 'cart-toast-message');
    const toastButton = element('button', 'cart-toast-view', 'View selection →');
    toastButton.type = 'button';
    toastButton.dataset.cartOpen = '';
    toast.append(toastMessage, toastButton);
    document.body.append(dialog, liveRegion, toast);
    restore();
    render();

    document.addEventListener('click', (event) => {
      if (!(event.target instanceof Element)) return;
      const addButton = event.target.closest('[data-add-product]');
      if (addButton) {
        event.preventDefault();
        add(addButton.dataset.addProduct);
        return;
      }
      if (event.target.closest('[data-cart-open]')) {
        event.preventDefault();
        open();
      }
    });
    dialog.querySelector('.cart-close').addEventListener('click', close);
    dialog.addEventListener('cancel', (event) => { event.preventDefault(); close(); });
    dialog.addEventListener('click', (event) => {
      if (!(event.target instanceof Element)) return;
      if (event.target === dialog) {
        const bounds = dialog.getBoundingClientRect();
        if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) close();
      }
      const button = event.target.closest('[data-cart-action]');
      if (!button) return;
      const id = button.dataset.productId;
      const item = items.find((entry) => entry.id === id);
      if (!item) return;
      const action = button.dataset.cartAction;
      if (action === 'remove') items = items.filter((entry) => entry.id !== id);
      else if (action === 'increase') item.quantity = Math.min(MAX_QUANTITY, item.quantity + 1);
      else if (action === 'decrease') item.quantity = Math.max(1, item.quantity - 1);
      const productName = products.get(id).name;
      commit(action === 'remove' ? `${productName} removed.` : `${productName}: quantity ${item.quantity}.`);
      const replacement = Array.from(dialog.querySelectorAll('[data-cart-action]')).find((node) => node.dataset.productId === id && node.dataset.cartAction === action && !node.disabled);
      (replacement || dialog.querySelector('[data-cart-action]:not(:disabled)') || dialog.querySelector('.cart-close')).focus();
    });
    window.addEventListener('storage', (event) => {
      if (event.key !== STORAGE_KEY && event.key !== null) return;
      restore();
      render();
      announce('Your selection was updated in another tab.');
    });
    window.CreminoCart = { add, open, close, getItems, buildMessage, totals };
    document.dispatchEvent(new CustomEvent('cremino:cart-ready'));
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
  else init();
})();
