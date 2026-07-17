// nginx only proxies /aucdt-msee-aptitude-test/* to this app, so every API call
// must go through the app's sub-path — a root-relative '/api/...' lands on the
// main site and returns an HTML 404 (the "Unexpected token '<'" JSON error).
// import.meta.env.BASE_URL is the Vite `base` ('/aucdt-msee-aptitude-test/').
// apiUrl('/api/exams') -> '/aucdt-msee-aptitude-test/api/exams'.
export const apiUrl = (path: string): string =>
  `${import.meta.env.BASE_URL.replace(/\/+$/, '')}${path}`;
