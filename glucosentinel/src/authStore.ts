const KEY = 'glucosentinel_auth';

export function useAuthStore() {
  return {
    isAuthenticated: () => sessionStorage.getItem(KEY) === '1',
    login: (username: string) => { sessionStorage.setItem(KEY, '1'); },
    logout: () => { sessionStorage.removeItem(KEY); },
  };
}
