/* Standalone reservation-request preparation. No backend, network submission or persistent storage. */
(() => {
  'use strict';
  const form = document.getElementById('reservation-form');
  const formView = document.getElementById('reservation-form-view');
  const summary = document.getElementById('reservation-summary');
  const dateInput = document.getElementById('reservation-date');
  const timeInput = document.getElementById('reservation-time');
  const dishesInput = document.getElementById('meal-dishes');
  const errorSummary = document.getElementById('form-errors');
  const errorList = document.getElementById('form-error-list');
  const copyStatus = document.getElementById('request-copy-status');
  const controls = {
    name: document.getElementById('guest-name'),
    phone: document.getElementById('guest-phone'),
    email: document.getElementById('guest-email'),
    date: dateInput,
    time: timeInput,
    guests: document.getElementById('guest-count'),
    dishes: dishesInput
  };
  let preparedRequest = '';

  function localDate(date = new Date()) {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  }

  function validDate(value) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
    const [year, month, day] = value.split('-').map(Number);
    const parsed = new Date(year, month - 1, day);
    return parsed.getFullYear() === year && parsed.getMonth() === month - 1 && parsed.getDate() === day;
  }

  function updateDateConstraints() {
    const now = new Date();
    dateInput.min = localDate(now);
    timeInput.removeAttribute('min');
    if (dateInput.value === localDate(now)) {
      const nextMinute = new Date(now.getTime() + 60000);
      // At the end of the day there is no valid remaining minute. Submission
      // still checks the full requested date/time rather than guessing a new date.
      if (localDate(nextMinute) === localDate(now)) {
        timeInput.min = `${String(nextMinute.getHours()).padStart(2, '0')}:${String(nextMinute.getMinutes()).padStart(2, '0')}`;
      }
    }
  }

  function updateMealChoice() {
    const advance = form.elements.mealChoice.value === 'advance';
    document.getElementById('advance-meal-fields').hidden = !advance;
    dishesInput.disabled = !advance;
    dishesInput.required = advance;
    if (!advance) clearFieldError('dishes');
  }

  function clearFieldError(key) {
    const input = controls[key];
    if (input) input.removeAttribute('aria-invalid');
    const message = document.getElementById(`${key}-error`);
    if (message) { message.textContent = ''; message.hidden = true; }
  }

  function clearErrors() {
    Object.keys(controls).forEach(clearFieldError);
    form.querySelectorAll('[name="mealChoice"]').forEach(input => input.removeAttribute('aria-invalid'));
    document.getElementById('meal-error').hidden = true;
    form.querySelectorAll('[name=mealChoice]').forEach(input => input.removeAttribute('aria-invalid'));
    errorList.replaceChildren();
    errorSummary.hidden = true;
  }

  function showErrors(errors) {
    errors.forEach(({key, text}) => {
      const target = key === 'meal' ? document.getElementById('meal-later') : controls[key];
      target?.setAttribute('aria-invalid', 'true');
      const message = document.getElementById(`${key}-error`);
      if (message) { message.textContent = text; message.hidden = false; }
      const row = document.createElement('li');
      const link = document.createElement('a');
      link.href = `#${target.id}`;
      link.textContent = text;
      link.addEventListener('click', event => { event.preventDefault(); target.focus(); });
      row.append(link);
      errorList.append(row);
    });
    errorSummary.hidden = false;
    errorSummary.focus();
    errorSummary.scrollIntoView({block:'center', behavior:matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'});
  }

  function readForm() {
    return {
      name: controls.name.value.trim(),
      phone: controls.phone.value.trim(),
      email: controls.email.value.trim(),
      date: dateInput.value,
      time: timeInput.value,
      guests: controls.guests.value,
      meal: form.elements.mealChoice.value,
      dishes: dishesInput.value.trim(),
      dietary: document.getElementById('dietary-note').value.trim(),
      note: document.getElementById('visit-note').value.trim()
    };
  }

  function validate(data) {
    const errors = [];
    if (data.name.length < 2 || data.name.length > 100) errors.push({key:'name', text:'Unesite ime i prezime (od 2 do 100 znakova).'});
    const digits = data.phone.replace(/\D/g, '');
    if (!/^[+\d\s().-]+$/.test(data.phone) || digits.length < 7 || digits.length > 15) errors.push({key:'phone', text:'Unesite ispravan kontakt telefon sa 7 do 15 cifara.'});
    if (data.email && !controls.email.validity.valid) errors.push({key:'email', text:'Proverite format e-mail adrese.'});
    const dateValid = validDate(data.date);
    const today = localDate();
    if (!dateValid) errors.push({key:'date', text:'Izaberite željeni datum dolaska.'});
    else if (data.date < today) errors.push({key:'date', text:'Datum dolaska ne može biti u prošlosti.'});
    const timeValid = /^([01]\d|2[0-3]):[0-5]\d$/.test(data.time);
    if (!timeValid) errors.push({key:'time', text:'Izaberite željeno vreme dolaska.'});
    else if (dateValid && data.date >= today) {
      const [year, month, day] = data.date.split('-').map(Number);
      const [hour, minute] = data.time.split(':').map(Number);
      const requested = new Date(year, month - 1, day, hour, minute);
      if (requested.getHours() !== hour || requested.getMinutes() !== minute) errors.push({key:'time', text:'Izaberite važeće vreme za odabrani datum.'});
      else if (requested.getTime() <= Date.now()) errors.push({key:'time', text:'Za današnji datum izaberite vreme koje tek predstoji.'});
    }
    const guests = Number(data.guests);
    if (!data.guests || !Number.isInteger(guests) || guests < 1 || guests > 50) errors.push({key:'guests', text:'Unesite ceo broj gostiju od 1 do 50.'});
    if (!['later', 'advance'].includes(data.meal)) errors.push({key:'meal', text:'Izaberite da li ćete jela odabrati za stolom ili unapred.'});
    if (data.meal === 'advance' && !data.dishes) errors.push({key:'dishes', text:'Navedite željena jela i količine za pripremu unapred.'});
    return errors;
  }

  function formatDate(value) {
    const [year, month, day] = value.split('-').map(Number);
    return new Intl.DateTimeFormat('sr-Latn-RS', {weekday:'long', day:'numeric', month:'long', year:'numeric'}).format(new Date(year, month - 1, day));
  }

  function renderSummary(data) {
    const dateLabel = `${formatDate(data.date)} u ${data.time}`;
    const mealLabel = data.meal === 'advance' ? 'Želimo da izaberemo jela unapred' : 'Odlučićemo kada dođemo';
    const rows = [
      ['Ime i prezime', data.name],
      ['Telefon', data.phone],
      ...(data.email ? [['E-mail', data.email]] : []),
      ['Željeni termin', dateLabel],
      ['Broj gostiju', String(Number(data.guests))],
      ['Dogovor oko obroka', mealLabel],
      ...(data.meal === 'advance' ? [['Željena jela i količine', data.dishes], ['Želja za pripremu', 'Da jela budu spremna za dogovoreno vreme dolaska, ako restoran potvrdi.']] : []),
      ...(data.dietary ? [['Alergije i posebni zahtevi u ishrani', data.dietary]] : []),
      ...(data.note ? [['Napomena', data.note]] : [])
    ];
    const details = document.getElementById('reservation-summary-details');
    details.replaceChildren();
    rows.forEach(([label, text]) => {
      const row = document.createElement('div');
      const term = document.createElement('dt');
      const description = document.createElement('dd');
      term.textContent = label; description.textContent = text;
      row.append(term, description); details.append(row);
    });
    const confirmationRequest = 'Molimo potvrdite raspoloživost stola za navedeni termin i broj gostiju.' + (data.meal === 'advance' ? ' Ako je moguće, želeli bismo da navedena jela budu spremna u vreme dolaska; molimo potvrdite i dogovor oko pripreme.' : ' Jela ćemo izabrati kada dođemo, bez pripreme unapred.') + (data.dietary || data.note ? ' Molimo potvrdite i mogućnost ispunjavanja navedenih posebnih zahteva.' : '');
    preparedRequest = 'PODRUMIZZA — UPIT ZA REZERVACIJU\n\n' + rows.map(([label, value]) => `${label}: ${value}`).join('\n\n') + '\n\n' + confirmationRequest + '\nOvo je upit, ne potvrđena rezervacija. Ništa nije automatski poslato.\n';
    copyStatus.textContent = '';
    formView.hidden = true;
    summary.hidden = false;
    document.getElementById('summary-heading').focus({preventScroll:true});
    summary.scrollIntoView({block:'start', behavior:matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'});
  }

  function downloadRequest() {
    const url = URL.createObjectURL(new Blob(['\uFEFF' + preparedRequest], {type:'text/plain;charset=utf-8'}));
    const link = document.createElement('a');
    link.href = url;
    link.download = 'Podrumizza-upit-za-rezervaciju.txt';
    document.body.append(link); link.click(); link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  form.addEventListener('submit', event => {
    event.preventDefault();
    updateDateConstraints();
    clearErrors();
    const data = readForm();
    const errors = validate(data);
    if (errors.length) { showErrors(errors); return; }
    renderSummary(data);
  });
  form.addEventListener('change', event => {
    if (event.target.name === 'mealChoice') updateMealChoice();
    if (event.target === dateInput) updateDateConstraints();
  });
  dateInput.addEventListener('focus', updateDateConstraints);
  timeInput.addEventListener('focus', updateDateConstraints);
  document.addEventListener('visibilitychange', () => { if (!document.hidden) updateDateConstraints(); });
  document.getElementById('edit-request').addEventListener('click', () => {
    summary.hidden = true;
    formView.hidden = false;
    copyStatus.textContent = '';
    controls.name.focus({preventScroll:true});
    formView.scrollIntoView({block:'start', behavior:matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'});
  });
  document.getElementById('copy-request').addEventListener('click', async () => {
    if (!preparedRequest) return;
    try {
      if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable');
      await navigator.clipboard.writeText(preparedRequest);
      copyStatus.textContent = 'Upit je kopiran. Otvorite Instagram, nalepite tekst u poruku i pošaljite ga sami. Rezervaciju potvrđuje osoblje.';
    } catch {
      downloadRequest();
      copyStatus.textContent = 'Upit je preuzet kao tekstualni fajl. Njegov sadržaj možete proslediti restoranu preko Instagrama. Ništa nije automatski poslato.';
    }
  });
  updateDateConstraints();
  updateMealChoice();
  // With JavaScript unavailable the disabled button prevents the browser's
  // default form submission from putting personal contact details in a URL.
  document.getElementById('prepare-request').disabled = false;
})();
