const PASS_KEY = 'aucdt_admin_pass';
// Default password for initial setup
const DEFAULT_PASS = 'admin123'; 

export const checkPassword = (input: string): boolean => {
  const stored = localStorage.getItem(PASS_KEY) || DEFAULT_PASS;
  return input === stored;
};

export const setPassword = (newPass: string) => {
  localStorage.setItem(PASS_KEY, newPass);
};

export const isDefaultPassword = (): boolean => {
  return !localStorage.getItem(PASS_KEY);
};
