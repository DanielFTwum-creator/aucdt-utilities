import { TestSuite } from '../types';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const query = <T extends HTMLElement>(selector: string): T => {
    const el = document.querySelector<T>(selector);
    if (!el) throw new Error(`Element not found: ${selector}`);
    return el;
};

export const TEST_SUITES: TestSuite[] = [
    {
        id: 'theme-switching',
        title: 'User Journey: Theme Switching',
        steps: [
            {
                description: 'Click "Dark" theme button',
                action: async () => {
                    query<HTMLButtonElement>('button[aria-pressed="false"]:nth-of-type(2)').click();
                    await delay(300);
                    return document.documentElement.classList.contains('dark');
                }
            },
            {
                description: 'Verify Dark theme is active',
                action: async () => {
                    return document.documentElement.classList.contains('dark');
                }
            },
            {
                description: 'Click "Contrast" theme button',
                action: async () => {
                    query<HTMLButtonElement>('button[aria-pressed="false"]').click();
                    await delay(300);
                    return document.documentElement.classList.contains('high-contrast');
                }
            },
             {
                description: 'Click "Light" theme button',
                action: async () => {
                    query<HTMLButtonElement>('button[aria-pressed="false"]').click();
                    await delay(300);
                    return document.documentElement.classList.contains('light');
                }
            }
        ]
    },
    {
        id: 'tab-navigation',
        title: 'User Journey: Main Tab Navigation',
        steps: [
            {
                description: 'Navigate to Team Status tab',
                action: async () => {
                    query<HTMLButtonElement>('#tab-status').click();
                    await delay(100);
                    return query('h2').innerText.includes('Team Status & Blockers');
                }
            },
            {
                description: 'Navigate to AI Workshop tab',
                action: async () => {
                    query<HTMLButtonElement>('#tab-workshop').click();
                    await delay(100);
                    return query('h2').innerText.includes('AI Workshop Deep Dive');
                }
            },
            {
                description: 'Navigate back to Overview tab',
                action: async () => {
                    query<HTMLButtonElement>('#tab-overview').click();
                    await delay(100);
                    return query('h2').innerText.includes('Meeting Overview');
                }
            }
        ]
    },
    {
        id: 'admin-auth',
        title: 'User Journey: Admin Authentication',
        steps: [
            {
                description: 'Navigate to Admin tab',
                action: async () => {
                    query<HTMLButtonElement>('#tab-admin').click();
                    await delay(100);
                    return query('h2').innerText.includes('Admin Login');
                }
            },
            {
                description: 'Attempt login with wrong password',
                action: async () => {
                    const passInput = query<HTMLInputElement>('#password');
                    passInput.value = 'wrongpassword';
                    passInput.dispatchEvent(new Event('input', { bubbles: true }));
                    query<HTMLButtonElement>('form button[type="submit"]').click();
                    await delay(100);
                    return query('#password-error').innerText.includes('Invalid password');
                }
            },
            {
                description: 'Login with correct password',
                action: async () => {
                    const passInput = query<HTMLInputElement>('#password');
                    passInput.value = 'admin123';
                    passInput.dispatchEvent(new Event('input', { bubbles: true }));
                    query<HTMLButtonElement>('form button[type="submit"]').click();
                    await delay(100);
                    return query('h2').innerText.includes('Admin Panel');
                }
            },
            {
                description: 'Logout from Admin Panel',
                action: async () => {
                    query<HTMLButtonElement>('section button:not([type="submit"])').click();
                    await delay(100);
                     return query('h2').innerText.includes('Admin Login');
                }
            }
        ]
    }
];
