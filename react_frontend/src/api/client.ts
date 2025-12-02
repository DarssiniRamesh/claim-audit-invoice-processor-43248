import axios from 'axios';

function computeDefaultBaseUrl(): string {
  try {
    const loc = window?.location;
    const hostname = loc?.hostname || 'localhost';
    const protocol = loc?.protocol || 'http:';
    const port = '3001';
    return `${protocol}//${hostname}:${port}`;
  } catch {
    return 'http://localhost:3001';
  }
}

/**
 * Resolve API base URL from environment variables or derive from current host.
 * Priority:
 * 1) REACT_APP_API_BASE_URL
 * 2) REACT_APP_BACKEND_URL
 * 3) REACT_APP_API_BASE
 * 4) Derived same host with backend port 3001 (protocol preserved), else http://localhost:3001
 */
export const API_BASE_URL: string =
  process.env.REACT_APP_API_BASE_URL ||
  process.env.REACT_APP_BACKEND_URL ||
  process.env.REACT_APP_API_BASE ||
  computeDefaultBaseUrl();

/**
 * Axios instance configured for the backend API.
 * Ensures we call the backend origin directly (no proxy) to avoid CORS mismatches.
 */
export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    Accept: 'application/json',
  },
  // Enable credentials if backend uses cookies/sessions.
  withCredentials: true,
});

// PUBLIC_INTERFACE
export function getApiBaseUrl(): string {
  /** Return the current API base URL used by the Axios client. */
  return API_BASE_URL;
}
