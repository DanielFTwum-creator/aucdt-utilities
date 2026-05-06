const API_URL = 'http://localhost:5000/api/auth';

export const AuthService = {
    login: async (username: string, password: string) => {
        try {
            const response = await fetch(`${API_URL}/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            const data = await response.json();

            if (data.success) {
                localStorage.setItem('tuc_auth_token', data.token);
                localStorage.setItem('tuc_user', JSON.stringify(data.user));
                return { success: true, user: data.user };
            } else {
                return { success: false, message: data.message };
            }
        } catch (error) {
            console.error('Login error:', error);
            return { success: false, message: 'Could not connect to TUC Auth API' };
        }
    },

    logout: () => {
        localStorage.removeItem('tuc_auth_token');
        localStorage.removeItem('tuc_user');
    },

    isAuthenticated: () => {
        return !!localStorage.getItem('tuc_auth_token');
    },

    getToken: () => {
        return localStorage.getItem('tuc_auth_token');
    }
};
