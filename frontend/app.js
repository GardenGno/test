const API_BASE = 'http://localhost:3000';

const authPanel = document.getElementById('auth-panel');
const profilePanel = document.getElementById('profile-panel');
const showAuthButton = document.getElementById('show-auth');
const showProfileButton = document.getElementById('show-profile');
const ctaStart = document.getElementById('cta-start');
const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');
const giftForm = document.getElementById('gift-form');
const giftList = document.getElementById('gift-list');
const profileName = document.getElementById('profile-name');
const profileBirthdate = document.getElementById('profile-birthdate');
const authStatus = document.getElementById('auth-status');
const profileStatus = document.getElementById('profile-status');
const logoutButton = document.getElementById('logout-button');

const tokenKey = 'wishlist_token';

const hasToken = () => Boolean(localStorage.getItem(tokenKey));

const setStatus = (element, message) => {
  element.textContent = message;
};

const request = async (path, options = {}) => {
  const token = localStorage.getItem(tokenKey);
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  });
  const data = await response.json().catch(() => null);
  if (!response.ok) {
    const message = data?.message || 'Произошла ошибка запроса.';
    throw new Error(Array.isArray(message) ? message.join(', ') : message);
  }
  return data;
};

const renderGifts = (gifts = []) => {
  giftList.innerHTML = '';
  if (!gifts.length) {
    giftList.innerHTML = '<li class="muted">Подарков пока нет.</li>';
    return;
  }
  gifts.forEach((gift) => {
    const flames = '🔥'.repeat(gift.priority || 1);
    const price = gift.price ? `${gift.price} ₽` : 'Цена не указана';
    const item = document.createElement('li');
    item.innerHTML = `
      <div>
        <strong>${gift.title}</strong>
        <p class="muted">Важность: ${flames}</p>
      </div>
      <span>${price}</span>
    `;
    giftList.appendChild(item);
  });
};

const loadProfile = async () => {
  const profile = await request('/users/me');
  profileName.textContent = profile.name;
  profileBirthdate.textContent = profile.birthDate
    ? `День рождения: ${profile.birthDate}`
    : 'Дата рождения не указана';
  const gifts = await request('/gifts/me');
  renderGifts(gifts);
};

const togglePanels = async () => {
  if (hasToken()) {
    authPanel.classList.add('hidden');
    profilePanel.classList.remove('hidden');
    try {
      await loadProfile();
      setStatus(profileStatus, '');
    } catch (error) {
      setStatus(profileStatus, error.message);
    }
  } else {
    authPanel.classList.remove('hidden');
    profilePanel.classList.add('hidden');
  }
};

showAuthButton.addEventListener('click', () => {
  localStorage.removeItem(tokenKey);
  setStatus(authStatus, '');
  togglePanels();
  authPanel.scrollIntoView({ behavior: 'smooth' });
});

showProfileButton.addEventListener('click', () => {
  if (!hasToken()) {
    setStatus(authStatus, 'Сначала войдите или зарегистрируйтесь.');
    authPanel.scrollIntoView({ behavior: 'smooth' });
    return;
  }
  togglePanels();
  profilePanel.scrollIntoView({ behavior: 'smooth' });
});

ctaStart.addEventListener('click', () => {
  localStorage.removeItem(tokenKey);
  togglePanels();
  authPanel.scrollIntoView({ behavior: 'smooth' });
});

loginForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  setStatus(authStatus, 'Авторизация...');
  const formData = new FormData(loginForm);
  try {
    const payload = {
      email: formData.get('email'),
      password: formData.get('password'),
    };
    const result = await request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    localStorage.setItem(tokenKey, result.accessToken);
    setStatus(authStatus, 'Успешный вход!');
    await togglePanels();
  } catch (error) {
    setStatus(authStatus, error.message);
  }
});

registerForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  setStatus(authStatus, 'Создаем профиль...');
  const formData = new FormData(registerForm);
  try {
    const payload = {
      name: formData.get('name'),
      email: formData.get('email'),
      password: formData.get('password'),
      birthDate: formData.get('birthDate') || undefined,
    };
    const result = await request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    localStorage.setItem(tokenKey, result.accessToken);
    setStatus(authStatus, 'Регистрация завершена!');
    await togglePanels();
  } catch (error) {
    setStatus(authStatus, error.message);
  }
});

giftForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  setStatus(profileStatus, 'Добавляем подарок...');
  const formData = new FormData(giftForm);
  try {
    const payload = {
      title: formData.get('title'),
      price: formData.get('price') ? Number(formData.get('price')) : undefined,
      priority: Number(formData.get('priority')),
      description: formData.get('description') || undefined,
      imageUrl: formData.get('imageUrl') || undefined,
    };
    await request('/gifts', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    giftForm.reset();
    await loadProfile();
    setStatus(profileStatus, 'Подарок добавлен!');
  } catch (error) {
    setStatus(profileStatus, error.message);
  }
});

logoutButton.addEventListener('click', () => {
  localStorage.removeItem(tokenKey);
  togglePanels();
  authPanel.scrollIntoView({ behavior: 'smooth' });
});

togglePanels();
