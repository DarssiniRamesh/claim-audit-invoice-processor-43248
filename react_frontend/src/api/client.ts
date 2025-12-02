import axios from 'axios';

function computeDefaultBaseUrl(): string {
  /**
   * Derive a sensible default base URL for the backend:
   * - Use the current page protocol/hostname and force port 3001 (backend)
   * - Fallback to http://localhost:3001 when window is unavailable (tests/SSR)
   */
  try {
    const loc = (typeof window !== 'undefined' ? window.location : undefined) as Location | undefined;
    const hostname = loc?.hostname || 'localhost';
    const protocol = loc?.protocol || 'http:';
    const port = '3001';
    return `${protocol}//${hostname}:${port}`;
  } catch {
    return 'http://localhost:3001';
  }
}

/**
 * Remove any trailing slashes from a URL to avoid double-slash issues when appending paths.
 */
function normalizeBaseUrl(url: string): string {
  return url.replace(/\/+$/, '');
}

/**
 * Resolve API base URL from environment variables or derive from current host.
 * Priority:
 * 1) REACT_APP_API_BASE_URL
 * 2) REACT_APP_BACKEND_URL
 * 3) REACT_APP_API_BASE
 * 4) Derived same host with backend port 3001 (protocol preserved), else http://localhost:3001
 *
 * Note: CRA env vars are statically injected at build-time.
 */
const RAW_API_BASE_URL: string =
  process.env.REACT_APP_API_BASE_URL ||
  process.env.REACT_APP_BACKEND_URL ||
  process.env.REACT_APP_API_BASE ||
  computeDefaultBaseUrl();

export const API_BASE_URL: string = normalizeBaseUrl(RAW_API_BASE_URL);

/**
 * Axios instance configured for the backend API.
 * Ensures we call the backend origin directly (no proxy) to avoid CORS mismatches.
 * withCredentials=true ensures cookies (if used) are included in requests.
 */
export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    Accept: 'application/json',
  },
  withCredentials: true,
});

// PUBLIC_INTERFACE
export function getApiBaseUrl(): string {
  /** Return the current API base URL used by the Axios client. */
  return API_BASE_URL;
}
