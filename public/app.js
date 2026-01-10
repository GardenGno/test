const state = {
  token: null,
  role: null,
  cats: [],
};

const loginForm = document.getElementById('login-form');
const loginStatus = document.getElementById('login-status');
const createForm = document.getElementById('create-form');
const createStatus = document.getElementById('create-status');
const catsGrid = document.getElementById('cats-grid');
const refreshCats = document.getElementById('refresh-cats');
const battleForm = document.getElementById('battle-form');
const battleResult = document.getElementById('battle-result');

const apiRequest = async (path, options = {}) => {
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (state.token) {
    headers.Authorization = `Bearer ${state.token}`;
  }

  const response = await fetch(path, { ...options, headers });
  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || 'Ошибка запроса');
  }
  return response.json();
};

const polarPoint = (center, radius, angle) => {
  return {
    x: center + radius * Math.cos(angle),
    y: center + radius * Math.sin(angle),
  };
};

const renderPolygon = (stats) => {
  const size = 160;
  const center = size / 2;
  const max = 10;
  const angles = [
    -Math.PI / 2,
    -Math.PI / 2 + (2 * Math.PI) / 5,
    -Math.PI / 2 + (4 * Math.PI) / 5,
    -Math.PI / 2 + (6 * Math.PI) / 5,
    -Math.PI / 2 + (8 * Math.PI) / 5,
  ];
  const values = [
    stats.strength,
    stats.agility,
    stats.intelligence,
    stats.perception,
    stats.luck,
  ];
  const points = values
    .map((value, index) => {
      const radius = (value / max) * (center - 16);
      const point = polarPoint(center, radius, angles[index]);
      return `${point.x},${point.y}`;
    })
    .join(' ');

  return `
    <svg class="stats-chart" viewBox="0 0 ${size} ${size}">
      <defs>
        <linearGradient id="neon" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stop-color="#6ef3ff" />
          <stop offset="100%" stop-color="#8b5bff" />
        </linearGradient>
      </defs>
      <polygon
        points="${points}"
        fill="rgba(110, 243, 255, 0.2)"
        stroke="url(#neon)"
        stroke-width="2"
      />
      ${angles
        .map((angle) => {
          const outer = polarPoint(center, center - 8, angle);
          return `<line x1="${center}" y1="${center}" x2="${outer.x}" y2="${outer.y}" stroke="rgba(110,243,255,0.15)" />`;
        })
        .join('')}
      <circle cx="${center}" cy="${center}" r="2" fill="#6ef3ff" />
    </svg>
  `;
};

const renderCats = () => {
  catsGrid.innerHTML = state.cats
    .map((cat) => {
      return `
        <article class="cat-card">
          <img src="${cat.imageUrl}" alt="${cat.name}" />
          <div class="cat-meta">
            <strong>${cat.name}</strong>
            <small>${cat.breed}</small>
            <small>${cat.description}</small>
          </div>
          ${renderPolygon(cat.stats)}
          <div class="tags">
            <span class="tag">Сила: ${cat.stats.strength}</span>
            <span class="tag">Ловкость: ${cat.stats.agility}</span>
            <span class="tag">Интеллект: ${cat.stats.intelligence}</span>
            <span class="tag">Восприятие: ${cat.stats.perception}</span>
            <span class="tag">Удача: ${cat.stats.luck}</span>
            ${cat.owner ? `<span class="tag">Владелец: ${cat.owner}</span>` : ''}
          </div>
        </article>
      `;
    })
    .join('');

  const challengerSelect = battleForm.querySelector('select[name="challenger"]');
  const opponentSelect = battleForm.querySelector('select[name="opponent"]');

  const options = state.cats
    .map((cat) => `<option value="${cat.id}">${cat.name}</option>`)
    .join('');

  challengerSelect.innerHTML = options;
  opponentSelect.innerHTML = options;
};

const loadCats = async () => {
  if (!state.token) {
    catsGrid.innerHTML = '<p class="hint">Авторизуйтесь, чтобы увидеть котов.</p>';
    return;
  }

  try {
    const cats = await apiRequest('/cats');
    state.cats = cats;
    renderCats();
  } catch (error) {
    catsGrid.innerHTML = `<p class="hint">${error.message}</p>`;
  }
};

loginForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const formData = new FormData(loginForm);
  const payload = Object.fromEntries(formData.entries());

  try {
    const response = await apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    state.token = response.token;
    state.role = response.role;
    loginStatus.textContent = `Вы вошли как ${response.role}.`;
    await loadCats();
  } catch (error) {
    loginStatus.textContent = error.message;
  }
});

createForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  createStatus.textContent = '';
  const formData = new FormData(createForm);
  const payload = {
    name: formData.get('name'),
    breed: formData.get('breed'),
    description: formData.get('description'),
    imageUrl: formData.get('imageUrl'),
    stats: {
      strength: Number(formData.get('strength')),
      agility: Number(formData.get('agility')),
      intelligence: Number(formData.get('intelligence')),
      perception: Number(formData.get('perception')),
      luck: Number(formData.get('luck')),
    },
  };

  try {
    await apiRequest('/cats', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    createStatus.textContent = 'Кот добавлен.';
    createForm.reset();
    await loadCats();
  } catch (error) {
    createStatus.textContent = error.message;
  }
});

battleForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  battleResult.textContent = '';
  const formData = new FormData(battleForm);
  const payload = {
    challengerId: formData.get('challenger'),
    opponentId: formData.get('opponent'),
    captureOnWin: formData.get('capture') === 'on',
  };

  try {
    const result = await apiRequest('/battles', {
      method: 'POST',
      body: JSON.stringify(payload),
    });

    battleResult.textContent = `Победил: ${result.winner.name}. Счёт ${result.score.challenger}:${result.score.opponent}.`;
    await loadCats();
  } catch (error) {
    battleResult.textContent = error.message;
  }
});

refreshCats.addEventListener('click', loadCats);

loadCats();
