// Development environment. apiUrl is relative so the dev-server proxy
// forwards /api -> http://localhost:5000 (see proxy.conf.json).
export const environment = {
  production: false,
  apiUrl: '/api',
};
