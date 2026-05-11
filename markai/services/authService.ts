// Fix: Import types from App.tsx where they are now defined.
import { User } from '../types';
import { sendNotification } from './notificationService';

// This service mocks a real authentication backend using localStorage.

const USERS_KEY = 'markai-users';
const SESSION_KEY = 'markai-session';

// Type for stored users, which includes the password for our simulation
type StoredUser = User & { password?: string; phone?: string; username?: string; location?: GeolocationCoordinates; };

const getStoredUsers = (): StoredUser[] => {
    try {
        const users = localStorage.getItem(USERS_KEY);
        return users ? JSON.parse(users) : [];
    } catch {
        return [];
    }
};

const setStoredUsers = (users: StoredUser[]) => {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

export const register = (username: string, password: string, phone: string | undefined, location: GeolocationCoordinates): User => {
    const users = getStoredUsers();
    if (users.some(u => u.username === username)) {
        throw new Error('Username already exists.');
    }
    if (phone && users.some(u => u.phone === phone)) {
        throw new Error('Phone number is already in use.');
    }

    const newUser: StoredUser = {
        id: `${Date.now()}`,
        name: username,
        email: `${username}@example.com`,
        tier: 'free',
        username,
        password,
        phone,
        // Fix: The `location` object was missing properties. Assign the full `location` object.
        location: location,
    };
    setStoredUsers([...users, newUser]);
    
    // Create a session for the new user
    const sessionUser: User = { id: newUser.id, name: newUser.name, email: newUser.email, tier: newUser.tier };
    localStorage.setItem(SESSION_KEY, JSON.stringify(sessionUser));

    // Send notification for new user signup
    sendNotification({
      to: 'admin@markai.com', // Hardcoded admin email
      subject: '🎉 New User Signup on MarkAI',
      body: `A new user has registered with the username: <strong>${username}</strong>.<br/>Time: ${new Date().toISOString()}`,
    });

    return sessionUser;
};

export const loginWithUsernameOrPhone = (identifier: string, password: string, location: GeolocationCoordinates): User => {
    const users = getStoredUsers();
    
    // Simple check to see if it's a phone number (mostly digits, allows some chars)
    const isPhone = /^\d[\d\s()+-]{6,}\d$/.test(identifier);

    const user = users.find(u => {
        if (isPhone) {
            return u.phone === identifier;
        }
        return u.username === identifier;
    });


    if (!user || user.password !== password) {
        throw new Error('Invalid credentials. Please check your username/phone and password.');
    }

    const sessionUser: User = {
        id: user.id,
        name: user.username || 'User',
        email: user.email || `${user.username}@example.com`,
        tier: user.tier || 'free',
    };

    localStorage.setItem(SESSION_KEY, JSON.stringify(sessionUser));
    return sessionUser;
};


export const logout = () => {
    localStorage.removeItem(SESSION_KEY);
};

export const checkSession = (): User | null => {
    try {
        const session = localStorage.getItem(SESSION_KEY);
        if (session) {
            const user = JSON.parse(session) as User;
            // In a real app, you'd validate the session token with a server
            return user;
        }
        return null;
    } catch {
        return null;
    }
};