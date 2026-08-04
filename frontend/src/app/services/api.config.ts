// Keep API and browser on the same host so SameSite session cookies work
// consistently for both localhost and 127.0.0.1 development URLs.
export const API_ORIGIN = `${window.location.protocol}//${window.location.hostname}:5000`;
export const API_BASE = `${API_ORIGIN}/api`;
