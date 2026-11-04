/* Phone-only photographic menu disclosures. Desktop menu is owned by app.js. */
(() => {
  'use strict';
  const root = document.getElementById('mobile-menu');
  const search = document.getElementById('menu-search');
  if (!root || !search) return;

  const menu = window.PODRUMIZZA_MENU || [];
  const categories = window.PODRUMIZZA_CATEGORIES || [];
  const phone = matchMedia('(max-width: 760px)');
  const openCategories = new Set();
  const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;'}[c]));
  const normalize = value => String(value ?? '').toLocaleLowerCase('sr-Latn').normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'dj').trim();
  const money = value => new Intl.NumberFormat('sr-RS', {maximumFractionDigits:0}).format(value);
  const covers = {
    pizza: {title:'Pice', image:'hero-pizza.webp', caption:'Pizza napoletana · 32 cm'},
    rostilj: {title:'Roštilj', image:'grill.webp', caption:'Za veliki apetit i dobru ekipu'},
    salate: {title:'Salate i prilozi', image:'category-salad.webp', caption:'Malo svežine sa strane'},
    deserti: {title:'Deserti', image:'category-dessert.webp', caption:'Slatka tačka dobrog obroka'},
    pica: {title:'Karta pića', image:'category-drinks.webp', caption:'Osveženje, kafa i dobra priča'}
  };
  let renderedQuery = '';

  function rememberOpenCategories() {
    if (renderedQuery) return;
    root.querySelectorAll('.mobile-menu-group').forEach(details => {
      if (details.open) openCategories.add(details.dataset.category);
      else openCategories.delete(details.dataset.category);
    });
  }

  function itemMarkup(item) {
    return `<article class="mobile-menu-item" data-product="${esc(item.id)}" data-source="${esc(item.source || 'concept')}"><div class="mobile-item-heading"><button type="button" class="mobile-item-name" data-action="detail" data-id="${esc(item.id)}">${esc(item.name)}</button><span class="mobile-item-leader" aria-hidden="true"></span><span class="mobile-item-price">${money(item.price)} <small>RSD</small></span></div><p class="mobile-item-description">${esc(item.description)}</p><div class="mobile-item-meta"><span>${esc(item.unit)}</span><button type="button" class="mobile-item-details" data-action="detail" data-id="${esc(item.id)}" aria-label="Sastojci i alergeni: ${esc(item.name)}">Sastojci i alergeni</button></div></article>`;
  }

  function groupMarkup(category, items, query) {
    const cover = covers[category.id] || {title:category.label, image:'hero-pizza.webp', caption:''};
    const total = menu.filter(item => item.category === category.id).length;
    const count = query ? `${items.length} od ${total}` : String(total);
    const source = category.id === 'pizza'
      ? 'Nazivi, cene i čitljivi sastojci prepisani su sa dostavljene karte. Sve pice su 32 cm. Konačan sastav i alergene potvrđuje osoblje.'
      : 'Ponuda, porcije i cene u ovoj kategoriji predstavljaju ilustrativan predlog. Konačne podatke potvrđuje restoran.';
    const opened = query || openCategories.has(category.id);
    return `<details class="mobile-menu-group" data-category="${category.id}"${opened ? ' open' : ''}><summary class="mobile-category-cover" id="mobile-summary-${category.id}"><img class="mobile-category-image" src="assets/${cover.image}" alt="" width="1024" height="768" loading="lazy" decoding="async"><span class="mobile-cover-title">${esc(cover.title)}</span><span class="mobile-cover-caption">${esc(cover.caption)}</span><span class="mobile-cover-action"><span class="mobile-when-closed">Prikaži ponudu</span><span class="mobile-when-open">Sakrij ponudu</span><span class="mobile-cover-count">${count}</span></span><span class="mobile-cover-toggle" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none"><path d="M5 12h14"/><path class="mobile-plus-stem" d="M12 5v14"/></svg></span></summary><div class="mobile-group-content" role="region" aria-labelledby="mobile-summary-${category.id}"><p class="mobile-category-intro">${esc(category.intro || '')}</p><p class="mobile-group-source">${source}</p><div class="mobile-group-items">${items.map(itemMarkup).join('')}</div></div></details>`;
  }

  function render() {
    rememberOpenCategories();
    if (!phone.matches) {
      if (root.contains(document.activeElement)) search.focus({preventScroll:true});
      root.replaceChildren();
      root.hidden = true;
      return;
    }
    root.hidden = false;
    const query = normalize(search.value);
    const groups = categories.map(category => {
      const items = menu.filter(item => item.category === category.id && (!query || normalize([item.name, item.category, item.category === 'pizza' ? 'pizza pica pice' : '', category.label, item.description, ...(item.ingredients || [])].join(' ')).includes(query)));
      return {category, items};
    }).filter(group => group.items.length);
    const matchingCount = groups.reduce((count, group) => count + group.items.length, 0);
    const status = query
      ? `Pronađeno stavki: ${matchingCount}. Otvorene su kategorije sa rezultatima pretrage.`
      : 'Dodirni fotografiju da otvoriš ponudu i cene.';
    root.innerHTML = `<p class="mobile-menu-instruction" aria-live="polite">${status}</p>` + (groups.length
      ? groups.map(({category,items}) => groupMarkup(category,items,query)).join('')
      : '<div class="mobile-menu-empty"><h3>Taj ukus još nije ovde.</h3><p>Pokušaj sa drugim nazivom jela, pića ili sastojka.</p><button type="button" class="button button-small" data-mobile-clear>Prikaži ceo meni <svg class="ui-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 19 19 5M5 5h14v14"/></svg></button></div>');
    renderedQuery = query;
  }

  root.addEventListener('toggle', event => {
    const details = event.target;
    if (renderedQuery || !details.matches('.mobile-menu-group') || !details.isConnected) return;
    if (details.open) openCategories.add(details.dataset.category);
    else openCategories.delete(details.dataset.category);
  }, true);
  root.addEventListener('click', event => {
    if (!event.target.closest('[data-mobile-clear]')) return;
    search.value = '';
    search.dispatchEvent(new Event('input', {bubbles:true}));
    search.focus({preventScroll:true});
  });
  search.addEventListener('input', render);
  if (phone.addEventListener) phone.addEventListener('change', render);
  else phone.addListener(render);
  render();
})();
