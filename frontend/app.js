const authPanel = document.getElementById('auth-panel');
const profilePanel = document.getElementById('profile-panel');
const showAuthButton = document.getElementById('show-auth');
const showProfileButton = document.getElementById('show-profile');
const ctaStart = document.getElementById('cta-start');

const hasToken = () => Boolean(localStorage.getItem('wishlist_token'));

const togglePanels = () => {
  if (hasToken()) {
    authPanel.classList.add('hidden');
    profilePanel.classList.remove('hidden');
  } else {
    authPanel.classList.remove('hidden');
    profilePanel.classList.add('hidden');
  }
};

showAuthButton.addEventListener('click', () => {
  localStorage.removeItem('wishlist_token');
  togglePanels();
  authPanel.scrollIntoView({ behavior: 'smooth' });
});

showProfileButton.addEventListener('click', () => {
  localStorage.setItem('wishlist_token', 'demo');
  togglePanels();
  profilePanel.scrollIntoView({ behavior: 'smooth' });
});

ctaStart.addEventListener('click', () => {
  localStorage.removeItem('wishlist_token');
  togglePanels();
  authPanel.scrollIntoView({ behavior: 'smooth' });
});

togglePanels();
