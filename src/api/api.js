const BASE_URL = 'http://localhost:8080/api';
const REVIEW_URL = 'http://localhost:8081';

export function getToken() {
  return localStorage.getItem('token');
}

export function setToken(token) {
  localStorage.setItem('token', token);
}

export function removeToken() {
  localStorage.removeItem('token');
}

export function isLoggedIn() {
  return !!getToken();
}

async function request(url, options = {}) {
  const token = getToken();
  const headers = { 'Content-Type': 'application/json', ...options.headers };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(url, { ...options, headers });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Something went wrong');
  }

  if (res.status === 204) return null;
  return res.json();
}

// Auth
export const login = (email, password) =>
  request(`${BASE_URL}/login`, {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });

export const register = (data) =>
  request(`${BASE_URL}/register`, {
    method: 'POST',
    body: JSON.stringify(data),
  });

export const getMe = () => request(`${BASE_URL}/me`);

// Users
export const getUserById = (id) => request(`${BASE_URL}/users/${id}`);
export const getUserListings = (id) => request(`${BASE_URL}/users/${id}/listings`);
export const updateProfile = (data) =>
  request(`${BASE_URL}/users/profile`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });

// Categories
export const getCategories = () => request(`${BASE_URL}/categories`);
export const getCategoryById = (id) => request(`${BASE_URL}/categories/${id}`);
export const getCategoryListings = (id, params = {}) =>
  request(`${BASE_URL}/categories/${id}/listings?${new URLSearchParams(params)}`);

// Listings
export const getListings = (params = {}) =>
  request(`${BASE_URL}/listings?${new URLSearchParams(params)}`);

export const getRecentListings = () => request(`${BASE_URL}/listings/recent`);

export const searchListings = (q) =>
  request(`${BASE_URL}/listings/search?q=${encodeURIComponent(q)}`);

export const getListingById = (id) => request(`${BASE_URL}/listings/${id}`);

export const createListing = (data) =>
  request(`${BASE_URL}/listings`, {
    method: 'POST',
    body: JSON.stringify(data),
  });

export const updateListing = (id, data) =>
  request(`${BASE_URL}/listings/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });

export const updateListingStatus = (id, status) =>
  request(`${BASE_URL}/listings/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  });

export const deleteListing = (id) =>
  request(`${BASE_URL}/listings/${id}`, { method: 'DELETE' });

// Images
export async function uploadListingImage(listingId, file) {
  const token = getToken();
  const formData = new FormData();
  formData.append('image', file);

  const res = await fetch(`${BASE_URL}/listings/${listingId}/image`, {
    method: 'POST',
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: formData,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Upload failed');
  }
  return res.json();
}

// Reviews
export const getReviews = (listingId) =>
  request(`${REVIEW_URL}/reviews?listing_id=${listingId}`);

export const createReview = (data) =>
  request(`${REVIEW_URL}/reviews`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
