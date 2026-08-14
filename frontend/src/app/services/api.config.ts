// Check if the app is running locally or live on production
const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

// For local development, append port :5000. For production, keep it on the same Vercel host.
export const API_ORIGIN = isLocal 
  ? `${window.location.protocol}//${window.location.hostname}:5000` 
  : `${window.location.protocol}//${window.location.hostname}`;

// Local builds will use http://localhost:5000/api
// Live production builds will seamlessly route through Vercel's proxy using /api
export const API_BASE = isLocal 
  ? `${API_ORIGIN}/api` 
  : '/api';
