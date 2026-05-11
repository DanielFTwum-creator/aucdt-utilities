/**
 * AuthService
 * Handles communications with the TUC-Auth-API
 */

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';

export const authService = {
  /**
   * Login with username and password
   * @param {string} username 
   * @param {string} password 
   * @returns {Promise<{success: boolean, token?: string, message: string}>}
   */
  async login(username, password) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      return await response.json();
    } catch (error) {
      console.error('AuthService.login error:', error);
      return { success: false, message: 'Could not connect to authentication server' };
    }
  },

  /**
   * Validate current JWT token
   * @param {string} token 
   * @returns {Promise<{success: boolean, valid: boolean, user?: any}>}
   */
  async validateToken(token) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/validate`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      return await response.json();
    } catch (error) {
      console.error('AuthService.validateToken error:', error);
      return { success: false, valid: false };
    }
  },

  /**
   * Logout (clears session if needed on server)
   * @returns {Promise<void>}
   */
  async logout() {
    try {
      await fetch(`${API_BASE_URL}/api/auth/logout`, {
        method: 'POST',
      });
    } catch (error) {
      console.error('AuthService.logout error:', error);
    }
  }
};
