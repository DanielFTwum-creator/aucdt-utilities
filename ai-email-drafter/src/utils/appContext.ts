// App context utility for multi-app OAuth flow
// Each app uses its own callback path: /app-name/callback

export const APP_NAME = 'email-drafter';
export const APP_PATH = '/email-drafter/';

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
    'ai-lab': '/ai-lab/',
    'peace': '/peace/',
    'biochemai': '/biochemai/',
    'willpro': '/willpro/',
    'glucose': '/glucose/',
    'groove-streamer': '/groove/',
    'email-drafter': '/email-drafter/',
    'learnaai': '/learnaai/',
    'thesisai': '/thesisai/',
  };
  return paths[appName] || '/email-drafter/';
};
