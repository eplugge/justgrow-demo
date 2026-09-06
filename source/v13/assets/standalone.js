const PAGE_TITLES = {
  home: 'Home', 'coaching-emdr': 'Coaching & EMDR', scholing: 'Scholing',
  'online-programmas': 'Online programma’s', podcast: 'Podcast', contact: 'Contact'
};
const mount = document.getElementById('page-mount');
const menuButton = document.querySelector('.menu-btn');
const navigation = document.querySelector('.nav-links');
function closeMenu() {
  navigation.classList.remove('open');
  menuButton.setAttribute('aria-expanded', 'false');
}
function renderPage() {
  const [requested, anchor] = location.hash.slice(1).split('/');
  const page = Object.hasOwn(PAGE_TITLES, requested) ? requested : 'home';
  mount.replaceChildren(document.getElementById('page-' + page).content.cloneNode(true));
  document.body.dataset.page = page;
  document.title = PAGE_TITLES[page] + ' | Just Grow v13';
  navigation.querySelectorAll('a[data-page]').forEach(link => {
    const active = link.dataset.page === page;
    link.classList.toggle('active', active);
    if (active) link.setAttribute('aria-current', 'page');
    else link.removeAttribute('aria-current');
  });
  closeMenu();
  requestAnimationFrame(() => {
    const target = anchor && document.getElementById(anchor);
    if (target) target.scrollIntoView({block: 'start'});
    else window.scrollTo({top: 0, behavior: 'instant'});
  });
  parent.postMessage({type: 'just-grow-section', section: page + (anchor ? '/' + anchor : '')}, '*');
}
menuButton.addEventListener('click', () => {
  const open = navigation.classList.toggle('open');
  menuButton.setAttribute('aria-expanded', String(open));
});
document.addEventListener('keydown', event => {
  if (event.key === 'Escape') closeMenu();
});
document.addEventListener('click', event => {
  const link = event.target.closest('a');
  if (link && navigation.contains(link)) closeMenu();
  if (link?.getAttribute('href') === location.hash) renderPage();
});
addEventListener('hashchange', renderPage);
addEventListener('message', event => {
  if (event.source !== parent || !event.data || event.data.type !== 'just-grow-set-section') return;
  const section = String(event.data.section || 'home').replace(/^#/, '');
  if (!/^[a-z0-9/-]+$/i.test(section)) return;
  if (location.hash !== '#' + section) location.hash = section;
  else renderPage();
});
renderPage();
