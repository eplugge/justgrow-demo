const menuButton = document.querySelector('.menu-btn');
const navigation = document.querySelector('.nav-links');
function closeMenu() {
  navigation.classList.remove('open');
  menuButton.setAttribute('aria-expanded', 'false');
}
menuButton.addEventListener('click', () => {
  const open = navigation.classList.toggle('open');
  menuButton.setAttribute('aria-expanded', String(open));
});
document.addEventListener('keydown', event => {
  if (event.key === 'Escape') closeMenu();
});
navigation.querySelectorAll('a[data-page]').forEach(link => {
  const active = link.dataset.page === document.body.dataset.page;
  link.classList.toggle('active', active);
  if (active) link.setAttribute('aria-current', 'page');
  else link.removeAttribute('aria-current');
  link.addEventListener('click', closeMenu);
});
