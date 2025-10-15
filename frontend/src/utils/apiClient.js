import { decodeJWT } from './decodeJWT';

const RAW_BASE_URL = (process.env.REACT_APP_API_URL || '').trim();

const normalizeBaseUrl = (value) => {
  if (!value) {
    return '';
  }

  const cleaned = value.replace(/\/$/, '');
  if (!cleaned) {
    return '';
  }
  return cleaned;
};

const normalizedBase = normalizeBaseUrl(RAW_BASE_URL);

const fallbackBase = () => {
  if (process.env.NODE_ENV === 'development') {
    return 'http://localhost:8000';
  }
  return '/api';
};

const API_BASE_URL = normalizedBase || fallbackBase();

export const getAuthToken = () => {
  if (typeof window === 'undefined') {
    return null;
  }
  return localStorage.getItem('jwt_token');
};

export const getAuthenticatedUsername = () => {
  const token = getAuthToken();
  if (!token) {
    return null;
  }
  const payload = decodeJWT(token);
  if (!payload) {
    return null;
  }
  return payload.username || payload.user?.username || payload.data?.username || null;
};

const resolvePath = (path) => {
  if (!path) {
    return API_BASE_URL;
  }
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${API_BASE_URL}${normalizedPath}`;
};

export const getApiBaseUrl = () => API_BASE_URL;

export const apiFetch = (path, options = {}) => {
  const token = getAuthToken();
  const headers = { ...(options.headers || {}) };

  if (token && !headers.Authorization) {
    headers.Authorization = `Bearer ${token}`;
  }

  return fetch(resolvePath(path), {
    ...options,
    headers,
  });
};
