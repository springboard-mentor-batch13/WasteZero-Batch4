import jwt from 'jsonwebtoken';

export const AUTH_COOKIE_NAME = 'wastezero_session';
const SESSION_MAX_AGE_MS = 30 * 24 * 60 * 60 * 1000;

const cookieOptions = () => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  maxAge: SESSION_MAX_AGE_MS,
  path: '/',
});

export const createSessionToken = (userId) =>
  jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '30d' });

export const setAuthCookie = (res, userId) => {
  res.cookie(AUTH_COOKIE_NAME, createSessionToken(userId), cookieOptions());
};

export const clearAuthCookie = (res) => {
  const { maxAge, ...options } = cookieOptions();
  res.clearCookie(AUTH_COOKIE_NAME, options);
};

export const parseCookies = (cookieHeader = '') =>
  cookieHeader.split(';').reduce((cookies, part) => {
    const separator = part.indexOf('=');
    if (separator < 0) return cookies;
    try {
      const key = decodeURIComponent(part.slice(0, separator).trim());
      const value = decodeURIComponent(part.slice(separator + 1).trim());
      if (key) cookies[key] = value;
    } catch {
      // Ignore malformed cookie fragments instead of turning auth failures
      // into 500 responses.
    }
    return cookies;
  }, {});

export const readSessionToken = ({ headers = {} }) => {
  const cookieToken = parseCookies(headers.cookie)[AUTH_COOKIE_NAME];
  if (cookieToken) return cookieToken;

  // Temporary compatibility for existing API clients while the browser
  // moves to HttpOnly cookies. New frontend code never stores this token.
  const authorization = headers.authorization || '';
  return authorization.startsWith('Bearer ') ? authorization.slice(7) : null;
};
