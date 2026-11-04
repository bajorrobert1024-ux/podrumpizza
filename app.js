/* Podrumizza concept: self-contained static frontend. No orders or messages are sent. */
(() => {
  'use strict';
  const menu = window.PODRUMIZZA_MENU || [];
  const categories = window.PODRUMIZZA_CATEGORIES || [];
  const $ = selector => document.querySelector(selector);
  const escape = value => String(value ?? '').replace(/[&<>"']/g, char => ({'&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;'}[char]));
  const normalize = value => String(value).toLocaleLowerCase('sr-Latn').normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'dj').trim();
  const money = value => new Intl.NumberFormat('sr-RS', {maximumFractionDigits:0}).format(value);
  const findItem = id => menu.find(item => item.id === id);
  let category = categories[0]?.id || 'pizza', query = '', expanded = false, activeModal = null, returnFocus = null;
  const modalRoot = $('#modal-root');
  const tabs = $('#category-tabs');
  const grid = $('#menu-grid');
  const navToggle = $('.mobile-nav-toggle');

  function renderTabs() {
    tabs.innerHTML = categories.map(cat => `<button id="tab-${cat.id}" class="category-tab" role="tab" aria-selected="${!query && category === cat.id}" aria-controls="menu-grid" tabindex="${category === cat.id ? 0 : -1}" data-action="category" data-id="${cat.id}">${escape(cat.label)}<span>${menu.filter(item => item.category === cat.id).length}</span></button>`).join('');
  }
  function itemCard(item, index) {
    return `<article class="menu-item"><span class="item-number" aria-hidden="true">${String(index + 1).padStart(2, '0')}</span><div class="item-copy"><div class="item-heading"><button class="item-name" data-action="detail" data-id="${escape(item.id)}">${escape(item.name)}</button>${item.tag ? `<span class="item-tag">${escape(item.tag)}</span>` : ''}</div><p class="item-description">${escape(item.description)}</p><div class="item-meta"><span class="item-price">${money(item.price)} <small>RSD</small></span><span class="item-unit">${escape(item.unit)}</span><button class="item-details" data-action="detail" data-id="${escape(item.id)}" aria-label="Sastojci i alergeni: ${escape(item.name)}">Sastojci & alergeni</button></div></div></article>`;
  }
  function renderMenu() {
    const current = categories.find(cat => cat.id === category);
    const normalizedQuery = normalize(query);
    const results = menu.filter(item => normalizedQuery ? normalize([item.name, item.description, item.category === 'pizza' ? 'pizza pica pice' : '', categories.find(cat => cat.id === item.category)?.label || '', ...item.ingredients].join(' ')).includes(normalizedQuery) : item.category === category);
    $('#category-title').textContent = query ? 'Pronađi svoj zalogaj' : current?.label || 'Meni';
    $('#category-intro').textContent = query ? `Rezultati u svim kategorijama za „${query}”.` : current?.intro || '';
    $('#menu-count').textContent = `${results.length} ${results.length === 1 ? 'STAVKA' : 'STAVKI'}`;
    grid.setAttribute('aria-labelledby', query ? 'category-title' : `tab-${category}`);
    renderTabs();
    if (!results.length) {
      grid.innerHTML = '<div class="empty-menu"><h3>Taj zalogaj još nije ovde.</h3><p>Probaj „Margherita”, „roštilj”, „limunada” ili naziv omiljenog sastojka.</p><button class="button button-small" data-action="reset">Prikaži meni <span aria-hidden="true"><svg class="ui-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 19 19 5M5 5h14v14"/></svg></span></button></div>';
      return;
    }
    const shown = expanded || query ? results : results.slice(0, 6);
    grid.innerHTML = shown.map(itemCard).join('') + (shown.length < results.length ? `<div class="show-more-wrap"><button class="show-more" data-action="more">Pogledaj još ${results.length - shown.length} stavki <span aria-hidden="true"><svg class="ui-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 4v16m-6-6 6 6 6-6"/></svg></span></button></div>` : '');
  }
  function closeModal() {
    modalRoot.innerHTML = '';
    document.body.classList.remove('modal-open');
    activeModal = null;
    if (returnFocus?.isConnected) returnFocus.focus({preventScroll:true});
  }
  function showModal(content, type) {
    if (!activeModal) returnFocus = document.activeElement;
    activeModal = {type};
    modalRoot.innerHTML = `<div class="modal-backdrop" data-backdrop><section class="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title"><button class="modal-close" data-action="close" aria-label="Zatvori prozor">×</button>${content}</section></div>`;
    document.body.classList.add('modal-open');
    modalRoot.querySelector('button').focus({preventScroll:true});
  }
  function showDetail(id) {
    const item = findItem(id);
    if (!item) return;
    const cat = categories.find(cat => cat.id === item.category);
    showModal(`<div class="eyebrow">${escape(cat?.label || 'Meni')} / ${item.source === 'provided-menu' ? 'DOSTAVLJENI MENI' : 'PREDLOG PONUDE'}</div><h2 id="modal-title">${escape(item.name)}</h2><p class="modal-description">${escape(item.description)}</p><dl class="modal-details"><div><dt>${item.source === 'provided-menu' ? 'Dimenzija' : 'Predlog porcije'}</dt><dd>${escape(item.unit)}</dd></div><div><dt>${item.source === 'provided-menu' ? 'Sastojci iz menija' : 'Predloženi sastojci'}</dt><dd>${escape(item.ingredients.join(', '))}.</dd></div><div><dt>Informativni alergeni prema sastojcima</dt><dd>${item.allergens.length ? escape(item.allergens.join(', ')) + '.' : 'Nisu navedeni u ovom predlogu; obavezno potvrditi sa restoranom.'}</dd></div></dl><p class="allergen-notice">${item.incomplete ? 'Deo sastava ove pice je zaklonjen na dostavljenoj slici. ' : ''}${escape(item.allergenNote || 'Alergene i konačnu recepturu potvrđuje osoblje.')} Ako imaš alergiju, obavezno proveri kompletan sastav sa restoranom pre naručivanja.</p><div class="modal-bottom"><span>${money(item.price)} <small>RSD</small><small class="proposed-price-label">${item.source === 'provided-menu' ? 'CENA SA MENIJA' : 'PREDLOG CENE'}</small></span><a class="button" href="rezervacija.html" target="_blank" rel="noopener noreferrer" aria-label="Rezerviši sto — otvara se u novoj kartici">Rezerviši sto <span aria-hidden="true"><svg class="ui-icon" viewBox="0 0 24 24" fill="none"><path d="M5 19 19 5M5 5h14v14"/></svg></span></a></div>`, 'detail', id);
  }
  function toggleNav(open = navToggle.getAttribute('aria-expanded') !== 'true') {
    navToggle.setAttribute('aria-expanded', String(open));
    navToggle.setAttribute('aria-label', open ? 'Zatvori navigaciju' : 'Otvori navigaciju');
    $('#mobile-nav').hidden = !open;
  }
  navToggle.addEventListener('click', () => toggleNav());
  $('#mobile-nav').addEventListener('click', event => { if (event.target.closest('a')) toggleNav(false); });
  window.addEventListener('resize', () => { if (innerWidth > 760) toggleNav(false); });
  $('#menu-search').addEventListener('input', event => { query = event.target.value.trim(); expanded = false; renderMenu(); });
  tabs.addEventListener('keydown', event => {
    if (!['ArrowLeft','ArrowRight','Home','End'].includes(event.key)) return;
    event.preventDefault();
    const index = categories.findIndex(cat => cat.id === category);
    const next = event.key === 'Home' ? 0 : event.key === 'End' ? categories.length - 1 : (index + (event.key === 'ArrowRight' ? 1 : -1) + categories.length) % categories.length;
    category = categories[next].id; query = ''; expanded = false; $('#menu-search').value = '';
    renderMenu(); $(`#tab-${category}`).focus();
  });
  document.addEventListener('click', event => {
    if (event.target.matches('[data-backdrop]')) { closeModal(); return; }
    const button = event.target.closest('[data-action]');
    if (!button || button.disabled) return;
    const {action, id} = button.dataset;
    if (action === 'category') {
      category = id; expanded = false; query = ''; $('#menu-search').value = ''; renderMenu(); $(`#tab-${category}`).focus({preventScroll:true});
    } else if (action === 'more') { expanded = true; renderMenu(); grid.querySelectorAll('.menu-item')[6]?.querySelector('.item-name').focus({preventScroll:true}); }
    else if (action === 'reset') { query = ''; expanded = false; $('#menu-search').value = ''; renderMenu(); $('#menu-search').focus(); }
    else if (action === 'detail') showDetail(id);
    else if (action === 'close') closeModal();
    else if (action === 'info') showModal('<div class="eyebrow">PODRUMIZZA / VIZUELNI KONCEPT</div><h2 id="modal-title">Sve počinje idejom.</h2><p class="modal-description">Ovo je predlog dizajna za Podrumizzu. Pice, sastojci i njihove cene prepisani su sa dostavljene karte. Roštilj, prilozi, deserti i pića ostaju predlog za potvrdu. Alergene i aktuelnu dostupnost potvrđuje osoblje.</p><div class="modal-details"><p class="modal-description">Fotografije su generisane za vizuelni koncept; hero video je animacija tih fotografija. Ne prikazuju stvaran snimak restorana. Pre objavljivanja potrebno ih je zameniti ili odobriti, kao i potvrditi sve podatke i tekstove.</p><p class="modal-description">Na posebnoj stranici možeš pripremiti upit za rezervaciju stola i navesti jela unapred ili odlučiti na licu mesta. Upit prosleđuješ restoranu; rezervacija i priprema hrane važe tek nakon njihove potvrde. Stranica ne šalje podatke automatski i ne prima uplate.</p></div>', 'info');
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') {
      if (activeModal) closeModal();
      else if (navToggle.getAttribute('aria-expanded') === 'true') { toggleNav(false); navToggle.focus(); }
      return;
    }
    if (!activeModal || event.key !== 'Tab') return;
    const focusable = Array.from(modalRoot.querySelectorAll('button:not(:disabled),a[href],input,textarea,[tabindex="0"]')).filter(element => element.getClientRects().length);
    const first = focusable[0], last = focusable.at(-1);
    if (event.shiftKey && (document.activeElement === first || !modalRoot.contains(document.activeElement))) { event.preventDefault(); last?.focus(); }
    else if (!event.shiftKey && (document.activeElement === last || !modalRoot.contains(document.activeElement))) { event.preventDefault(); first?.focus(); }
  });
  $('#year').textContent = new Date().getFullYear();
  renderMenu();
})();
