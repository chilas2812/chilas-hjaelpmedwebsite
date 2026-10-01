'use strict';
const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
const motion = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const menu = $('#navigation');
const menuToggle = $('.menu-toggle');
function closeMenu() { menu.classList.remove('open'); menuToggle.setAttribute('aria-expanded', 'false'); }
menuToggle.addEventListener('click', () => { const open = menu.classList.toggle('open'); menuToggle.setAttribute('aria-expanded', String(open)); });
$$('a', menu).forEach(link => link.addEventListener('click', closeMenu));
document.addEventListener('keydown', event => { if (event.key === 'Escape') closeMenu(); });
document.addEventListener('click', event => { if (!event.target.closest('.header')) closeMenu(); });
window.matchMedia('(min-width: 901px)').addEventListener('change', closeMenu);

let toastTimeout;
function toast(message) { const el = $('.toast'); el.textContent = message; el.classList.add('visible'); clearTimeout(toastTimeout); toastTimeout = setTimeout(() => el.classList.remove('visible'), 4000); }
async function copyText(text, fallback) {
  try { await navigator.clipboard.writeText(text); toast('Kopieret til udklipsholderen'); }
  catch { const input = document.createElement('textarea'); input.value = text; input.style.position = 'fixed'; input.style.left = '-9999px'; document.body.append(input); input.select(); let ok = false; try { ok = document.execCommand('copy'); } catch {} input.remove(); if (ok) toast('Kopieret til udklipsholderen'); else { if (fallback) { fallback.focus(); fallback.select(); } toast('Markér og kopiér teksten manuelt.'); } }
}
$('#copy-email').addEventListener('click', () => copyText('chilasclaville@gmail.com'));
$$('[data-service]').forEach(link => link.addEventListener('click', () => { $('#service').value = link.dataset.service; }));

let slide = 0;
let programmaticScrollUntil = 0;
const cards = $$('.project-card');
function selectSlide(index, scroll = true) {
  slide = (index + cards.length) % cards.length;
  $('#project-counter').textContent = `${String(slide + 1).padStart(2, '0')} / 03`;
  $$('[data-slide]').forEach(button => button.setAttribute('aria-pressed', String(Number(button.dataset.slide) === slide)));
  cards.forEach((card, index) => card.classList.toggle('selected', slide === index));
  if (scroll) { const windowEl = $('.portfolio-window'); const left = cards[slide].offsetLeft - cards[0].offsetLeft; programmaticScrollUntil = performance.now() + 750; windowEl.scrollTo({left, behavior: motion ? 'smooth' : 'auto'}); }
}
$('#previous-project').addEventListener('click', () => selectSlide(slide - 1));
$('#next-project').addEventListener('click', () => selectSlide(slide + 1));
$$('[data-slide]').forEach(button => button.addEventListener('click', () => selectSlide(Number(button.dataset.slide))));
let scrollTimeout;
$('.portfolio-window').addEventListener('scroll', () => { clearTimeout(scrollTimeout); scrollTimeout = setTimeout(() => { const el = $('.portfolio-window'); if (performance.now() < programmaticScrollUntil || el.scrollWidth <= el.clientWidth + 5) return; const index = cards.reduce((best, card, i) => Math.abs(card.offsetLeft - cards[0].offsetLeft - el.scrollLeft) < Math.abs(cards[best].offsetLeft - cards[0].offsetLeft - el.scrollLeft) ? i : best, 0); selectSlide(index, false); }, 130); }, {passive:true});
['pointerdown', 'wheel', 'touchstart'].forEach(event => $('.portfolio-window').addEventListener(event, () => { programmaticScrollUntil = 0; }, {passive:true}));
selectSlide(0, false);

const projects = {
  bistro: { name: 'Bord & Bistro', category: 'Restaurant', image: 'assets/bistro.webp', headline: 'God mad.<br>Gode øjeblikke.', intro: 'En varm og indbydende retning til en restaurant, hvor råvarer, atmosfære og den gode oplevelse er i centrum.', subline: 'Sæsonens råvarer. Plads til gode samtaler.', features: ['Store billeder, der viser stemningen', 'En overskuelig præsentation af køkkenet', 'En tydelig vej til bordreservation'], services: [{title:'Sæsonens køkken',text:'En side med plads til menukort og løbende ændringer.'},{title:'Plads til selskaber',text:'Giv gæsterne et overblik over mulighederne for en særlig anledning.'},{title:'Find vej',text:'Saml restaurantens åbningstider, adresse og kontakt ét sted.'}] },
  salon: { name: 'Studio Form', category: 'Salon', image: 'assets/salon.webp', headline: 'Et nyt look.<br>Helt dig.', intro: 'En elegant og rolig retning til en salon. Et stærkt visuelt udtryk med plads til at præsentere behandlinger og menneskene bag.', subline: 'Personlig stil. Omtanke i hver detalje.', features: ['Et enkelt, stilrent design', 'Overskuelige behandlinger og team', 'Mulighed for at tilknytte et bookingsystem'], services: [{title:'Klip & styling',text:'Et klart overblik over salonens behandlinger.'},{title:'Farve & forandring',text:'Vis mulighederne med inspirerende billeder og korte beskrivelser.'},{title:'Mød salonen',text:'Giv besøgende et indblik i teamet og salonens stil.'}] },
  craft: { name: 'Træ & Rum', category: 'Håndværker', image: 'assets/craft.webp', headline: 'Godt håndværk.<br>Hele vejen hjem.', intro: 'En solid og enkel retning til en håndværksvirksomhed. Materialer og projekter får plads, og kontakt er altid nem at finde.', subline: 'Bygget med omtanke. Skabt til hverdagen.', features: ['Tydelige ydelser og kontakt', 'Plads til billeder af udførte projekter', 'En enkel vej til en projektforespørgsel'], services: [{title:'Ombygning & renovering',text:'Forklar, hvilke typer opgaver virksomheden hjælper med.'},{title:'Træarbejde',text:'Giv plads til materialer, detaljer og kvalitet i arbejdet.'},{title:'Fra idé til projekt',text:'Gør det nemt at tage kontakt med en beskrivelse af opgaven.'}] }
};
const projectDialog = $('#project-dialog');
let activeProject;
function startProjectContact() {
  const project = projects[activeProject]; projectDialog.close();
  $('#service').value = 'Ny hjemmeside';
  if (!$('#message').value.trim()) $('#message').value = `Jeg er inspireret af designkonceptet ${project.name} og vil gerne høre om en hjemmeside til min virksomhed.\n\n`;
  $('#kontakt').scrollIntoView({behavior: motion ? 'smooth' : 'auto'});
  $('#name').focus({preventScroll:true});
}
function renderConcept(tab) {
  const project = projects[activeProject]; const screen = $('.concept-screen', projectDialog);
  $$('.concept-tab', projectDialog).forEach(button => button.setAttribute('aria-pressed', String(button.dataset.tab === tab)));
  if (tab === 'home') { screen.innerHTML = `<h3>${project.headline}</h3><p>${project.subline}</p><img src="${project.image}" alt="Billede til ${project.category.toLowerCase()}konceptet" width="900" height="600">`; }
  if (tab === 'services') { screen.innerHTML = '<div class="demo-services"><h3>Plads til dine ydelser.</h3>' + project.services.map(service => `<h4>${service.title}</h4><p>${service.text}</p>`).join('') + '</div>'; }
  if (tab === 'contact') { screen.innerHTML = '<div class="demo-contact"><h3>Skal din side have dette udtryk?</h3><p>Dette er et fiktivt designkoncept. Tal med Chilas om at tilpasse retningen til din egen virksomhed.</p><button class="button" type="button">Tal med Chilas om konceptet</button></div>'; $('.button', screen).addEventListener('click', startProjectContact); }
}
$$('[data-project]').forEach(button => button.addEventListener('click', () => {
  activeProject = button.dataset.project; const project = projects[activeProject];
  $('#project-dialog-content').innerHTML = `<div class="project-dialog-grid"><div class="project-dialog-info"><p class="eyebrow">${project.category.toUpperCase()} / FIKTIVT DESIGNKONCEPT</p><h2 id="project-title">${project.name}</h2><p>${project.intro}</p><ul>${project.features.map(feature => `<li>${feature}</li>`).join('')}</ul><p>Navnet og billederne er eksempler. Konceptet er ikke et udført kundeprojekt.</p><button class="button primary project-contact" type="button">Jeg kan lide denne retning</button></div><div><div class="concept-demo ${activeProject}"><nav aria-label="Konceptnavigation"><strong>${project.name.toUpperCase()}</strong><div class="concept-tabs"><button class="concept-tab" data-tab="home" aria-pressed="true">Forside</button><button class="concept-tab" data-tab="services" aria-pressed="false">Ydelser</button><button class="concept-tab" data-tab="contact" aria-pressed="false">Kontakt</button></div></nav><div class="concept-screen"></div><div class="concept-footer">${project.name.toUpperCase()} / Fiktivt eksempel af Chilas Studio</div></div><p class="concept-caption">Prøv navigationen for at udforske konceptet.</p></div></div>`;
  $('.project-contact', projectDialog).addEventListener('click', startProjectContact);
  $$('.concept-tab', projectDialog).forEach(tab => tab.addEventListener('click', () => renderConcept(tab.dataset.tab)));
  renderConcept('home'); projectDialog.showModal();
}));
$$('dialog').forEach(dialog => {
  $('.dialog-close', dialog).addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => { const r = dialog.getBoundingClientRect(); if (event.target === dialog && (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom)) dialog.close(); });
});
$('#privacy-open').addEventListener('click', () => $('#privacy-dialog').showModal());

let preparedMessage = '';
$('#contact-form').addEventListener('submit', event => {
  event.preventDefault(); const form = event.currentTarget;
  if (!form.reportValidity()) return;
  const data = new FormData(form);
  preparedMessage = `Hej Chilas,\n\n${String(data.get('message')).trim()}\n\nJeg er interesseret i: ${data.get('service')}\n\nNavn: ${String(data.get('name')).trim()}\nVirksomhed: ${String(data.get('company')).trim() || 'Ikke angivet'}\nE-mail: ${String(data.get('email')).trim()}\n`;
  $('#prepared-message').value = preparedMessage; $('#form-result').hidden = false;
  const subject = `Hjemmesideforespørgsel — ${String(data.get('company')).trim() || String(data.get('name')).trim()}`;
  const mail = document.createElement('a'); mail.href = `mailto:chilasclaville@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(preparedMessage)}`; mail.click();
});
$('#copy-message').addEventListener('click', () => copyText(preparedMessage, $('#prepared-message')));

function googleUrl(value) { try { const url = new URL(value); return url.protocol === 'https:' && /(^|\.)(google\.com|google\.dk|g\.page|maps\.app\.goo\.gl)$/.test(url.hostname) ? url.href : null; } catch { return null; } }
async function loadReviews() {
  try {
    const response = await fetch('./reviews.json'); if (!response.ok) return;
    const data = await response.json(); const profileUrl = googleUrl(data.googleProfileUrl); if (!profileUrl) return;
    const links = $('#google-links');
    const link = document.createElement('a'); link.href = profileUrl; link.textContent = 'Se profilen på Google'; link.target = '_blank'; link.rel = 'noopener noreferrer'; links.append(link);
    const reviewUrl = googleUrl(data.googleReviewUrl);
    if (reviewUrl) { const write = link.cloneNode(); write.href = reviewUrl; write.textContent = 'Skriv en Google-anmeldelse'; links.append(write); }
    const reviews = Array.isArray(data.reviews) ? data.reviews.filter(review => typeof review.name === 'string' && review.name.trim() && typeof review.text === 'string' && review.text.trim() && Number.isInteger(review.rating) && review.rating >= 1 && review.rating <= 5 && googleUrl(review.sourceUrl)) : [];
    if (reviews.length) {
      const content = $('#reviews-content'); content.replaceChildren();
      reviews.forEach(review => { const card = document.createElement('article'); card.className = 'review-card'; const name = document.createElement('strong'); name.textContent = review.name; const rating = document.createElement('p'); rating.className = 'rating'; rating.textContent = `${review.rating} af 5 stjerner`; const body = document.createElement('p'); body.textContent = review.text; const source = document.createElement('a'); source.textContent = 'Læs anmeldelsen på Google'; source.href = googleUrl(review.sourceUrl); source.target = '_blank'; source.rel = 'noopener noreferrer'; card.append(name, rating, body, source); content.append(card); });
    } else { $('#reviews-content').innerHTML = '<h3>Læs kundernes oplevelser på Google</h3><p>Besøg virksomhedsprofilen for at se de aktuelle anmeldelser.</p>'; }
  } catch { /* The honest empty state remains available. */ }
}
loadReviews();
if (motion && 'IntersectionObserver' in window) { const observer = new IntersectionObserver(entries => { entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('revealed'); observer.unobserve(entry.target); } }); }, {threshold:.07}); $$('.service-card, .project-card, .about-copy, .process-grid li').forEach(el => observer.observe(el)); }
