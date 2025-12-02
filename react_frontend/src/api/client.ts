import axios from 'axios';

const DEFAULT_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3001';

/**
 * Axios instance configured for the backend API.
 * CORS/baseURL alignment: Set REACT_APP_API_BASE_URL in environment to match backend origin (e.g., https://...:3001).
 */
export const api = axios.create({
  baseURL: DEFAULT_BASE_URL,
  headers: {
    'Accept': 'application/json'
  },
  withCredentials: false
});

// PUBLIC_INTERFACE
export function getApiBaseUrl(): string {
  /** Return the current API base URL used by the Axios client. */
  return api.defaults.baseURL || DEFAULT_BASE_URL;
}
