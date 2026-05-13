function getToken() {
  return localStorage.getItem('token');
}

function requireAuth() {
  const token = getToken();
  if (!token) {
    window.location.href = 'login.html';
  }
}

function authFetch(url, options = {}) {
  const token = getToken();
  const headers = options.headers || {};
  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = headers['Content-Type'] || 'application/json';
  }
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return fetch(url, { ...options, headers });
}

function logout() {
  localStorage.removeItem('token');
  window.location.href = 'login.html';
}

async function fetchCurrentUserOrNull() {
  const token = getToken();
  if (!token) return null;
  const response = await authFetch('/api/me');
  if (!response.ok) return null;
  const data = await response.json();
  return data.user;
}

async function fetchCurrentUser() {
  const user = await fetchCurrentUserOrNull();
  if (!user) {
    logout();
    return null;
  }
  return user;
}

async function ensureGuest() {
  const user = await fetchCurrentUserOrNull();
  if (user) {
    window.location.href = 'dashboard.html';
  }
}
