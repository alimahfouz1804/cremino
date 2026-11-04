/* Descriptive photo labels, not verified official product names.
   Replace names/prices only with CREMINO's approved menu information.
   null means a quote is required; it must never be treated as a zero price. */
window.CREMINO_CONFIG = Object.freeze({
  instagram: 'https://www.instagram.com/creminolb/',
  whatsapp: '9613392425', // +961 3 392 425: omit the local trunk 0 after country code.
  currency: 'USD'
});
window.CREMINO_PRODUCTS = [
  { id: 'wafer-sandwiches', name: 'Wafer ice cream sandwiches', category: 'ice-cream', image: 'assets/ice-cream/wafer-sandwiches-small.webp', alt: 'Colorful layers of ice cream between wafers', description: 'Layers of ice cream and crisp-looking wafers. Ask us about available flavors.', price: null },
  { id: 'scoop-cups', name: 'Ice cream cups', category: 'ice-cream', image: 'assets/ice-cream/scoop-cups-small.webp', alt: 'Three CREMINO cups filled with ice cream scoops', description: 'Your little scoop of happiness. Flavors and serving sizes to be confirmed.', price: null },
  { id: 'ice-cream-cone', name: 'Ice cream cone', category: 'ice-cream', image: 'assets/ice-cream/floating-cone-small.webp', alt: 'A CREMINO ice cream cone against the sky', description: 'A cone made for sweet moments. Ask about today’s flavors.', price: null },
  { id: 'red-bow-cake', name: 'Red-bow celebration cake', category: 'cakes', image: 'assets/cakes/red-bow-celebration-cake-small.webp', alt: 'White two-tier cake decorated with red bows', description: 'A celebration design with ribbon details. Discuss size, filling and personalization.', price: null },
  { id: 'orange-cake', name: 'Orange celebration cake', category: 'cakes', image: 'assets/cakes/orange-celebration-cake-small.webp', alt: 'An elaborate orange cake topped with a decorative tower', description: 'An intricate celebration design. Details and lead time to be confirmed.', price: null },
  { id: 'character-cake', name: 'Halloween character cake', category: 'cakes', image: 'assets/cakes/character-halloween-cake-small.webp', alt: 'A Halloween cake with playful character decorations', description: 'A seasonal themed design from our photo collection. Ask about custom requests.', price: null },
  { id: 'chocolate-bowl', name: 'Floral chocolate bowl', category: 'chocolates', image: 'assets/chocolates/floral-chocolate-bowl-small.webp', alt: 'Wrapped chocolates and flowers arranged in a bowl', description: 'Wrapped chocolates in a floral arrangement. Contents and presentation may vary.', price: null },
  { id: 'chocolate-platters', name: 'Chocolate gift platters', category: 'chocolates', image: 'assets/chocolates/chocolate-gift-platters-small.webp', alt: 'Two gift platters with wrapped chocolates and flowers', description: 'A little sweetness to share or gift. Confirm arrangement and quantity with us.', price: null },
  { id: 'tiered-chocolates', name: 'Tiered chocolate arrangement', category: 'chocolates', image: 'assets/chocolates/tiered-chocolate-arrangement-small.webp', alt: 'A tiered arrangement of wrapped chocolates and floral details', description: 'A decorative chocolate display for an occasion. Ask about available options.', price: null },
  { id: 'berry-desserts', name: 'Berry-topped dessert selection', category: 'desserts', image: 'assets/desserts/berry-dessert-assortment-small.webp', alt: 'Small cakes and tarts decorated with berries', description: 'A photo selection of berry-topped treats. Confirm individual options and ingredients.', price: null },
  { id: 'cinnamon-roll', name: 'Cinnamon roll & coffee', category: 'pastries', image: 'assets/pastries/cinnamon-roll-and-coffee-small.webp', alt: 'A cinnamon roll beside a CREMINO coffee cup', description: 'A sweet coffee-break pairing pictured together. Confirm items and serving options.', price: null },
  { id: 'berry-roll', name: 'Berry-topped roll & coffee', category: 'pastries', image: 'assets/pastries/berry-roll-and-coffee-small.webp', alt: 'A berry-topped pastry roll and a cup of coffee', description: 'A berry-topped pastry from our photo collection. Ask about availability.', price: null },
  { id: 'chocolate-roll', name: 'Chocolate-topped roll & coffee', category: 'pastries', image: 'assets/pastries/chocolate-roll-and-coffee-small.webp', alt: 'A chocolate-topped pastry roll and a cup of coffee', description: 'A chocolatey-looking coffee-break treat. Confirm the topping and serving options.', price: null }
];
