// App context utility for multi-app OAuth flow
// Each app uses its own callback path: /app-name/callback
//
// Standard TUC auth module — copied locally per PATTERNS.md Pattern 10.
// dictation-app is deployed at ai-tools.techbridge.edu.gh/dictation/ (vite base
// '/dictation/'), so APP_PATH must match for the OAuth redirect_uri to be valid.

export const APP_NAME = 'dictation';
export const APP_PATH = '/dictation/';

export const setOAuthAppContext = (appName: string = APP_NAME) => {
  localStorage.setItem('oauth_app_context', appName);
};

export const getOAuthAppContext = (): string => {
  return localStorage.getItem('oauth_app_context') || APP_NAME;
};

export const clearOAuthAppContext = () => {
  localStorage.removeItem('oauth_app_context');
};

export const getAppDashboardPath = (appName: string = APP_NAME): string => {
  const paths: Record<string, string> = {
    'dictation': '/dictation/',
    'ai-lab': '/ai-lab/',
    'peace': '/peace/',
    'biochemai': '/biochemai/',
    'willpro': '/willpro/',
    'glucose': '/glucose/',
    'groove-streamer': '/groove/',
    'learnaai': '/learnaai/',
    'thesisai': '/thesisai/',
  };
  return paths[appName] || '/dictation/';
};
