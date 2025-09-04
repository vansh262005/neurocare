const BASE_URL = import.meta.env.VITE_SERVER_URL || 'http://localhost:5000';

function getToken() {
  return localStorage.getItem('token');
}

async function fetchWithAuth(endpoint, method = 'GET', body, isForm = false) {
  const headers = {};
  if (!isForm) headers['Content-Type'] = 'application/json';
  const token = getToken();
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${BASE_URL}${endpoint}`, {
    method,
    headers,
    body: isForm ? body : body ? JSON.stringify(body) : undefined
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'API error');
  }
  return res.json();
}

export const signup = (data) => fetchWithAuth('/api/auth/register', 'POST', data);
export const login = (data) => fetchWithAuth('/api/auth/login', 'POST', data);

export const getChat = () => fetchWithAuth('/api/chat/history'); // ensure backend route exists else adjust
export const sendChat = (text) => fetchWithAuth('/api/chat', 'POST', { text });

export const getTasks = () => fetchWithAuth('/api/task', 'GET');
export const completeTask = (id, file) => {
  const form = new FormData();
  form.append('image', file);
  return fetchWithAuth(`/api/task/complete/${id}`, 'POST', form, true);
};

export const getDashboard = () => fetchWithAuth('/api/dashboard/summary');

export { fetchWithAuth };