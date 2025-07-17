import axios from 'axios';
import { AuthToken, Battle, BattleCreate, Challenge, ChallengeCreate, LoginCredentials, StravaRunData, User, UserCreate } from '../types';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

const api = axios.create({
    baseURL: `${API_BASE_URL}/api/v1`,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to add auth token
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Auth API
export const authAPI = {
    login: async (credentials: LoginCredentials): Promise<AuthToken> => {
        const formData = new FormData();
        formData.append('username', credentials.username);
        formData.append('password', credentials.password);

        const response = await api.post('/auth/token', formData, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        });
        return response.data;
    },

    getCurrentUser: async (): Promise<User> => {
        const response = await api.get('/auth/me');
        return response.data;
    },
};

// Users API
export const usersAPI = {
    create: async (user: UserCreate): Promise<User> => {
        const response = await api.post('/users/', user);
        return response.data;
    },

    getAll: async (): Promise<User[]> => {
        try {
            const response = await api.get('/users/');
            return response.data;
        } catch (error: any) {
            redirectOn401Or403(error);
            throw error;
        }
    },

    getById: async (id: number): Promise<User> => {
        try {
            const response = await api.get(`/users/${id}`);
            return response.data;
        } catch (error: any) {
            redirectOn401Or403(error);
            throw error;
        }
    },
};


// Strava API
export const StravaAPI = {
    getStravaLink: async (): Promise<{ "link": string }> => {
        try {
            const response = await api.get('/strava/auth-url/');
            return response.data;
        } catch (error: any) {
            redirectOn401Or403(error);
            throw error;
        }
    },
    getLastRunFromAthlete: async (username: string): Promise<StravaRunData[]> => {
        try {
            const response = await api.get(`/strava/run/last/${username}/`);
            return response.data;
        } catch (error: any) {
            redirectOn401Or403(error);
            throw error;
        }
    }
};

// Battles API
export const battlesAPI = {
    getBattleUsers: async (partycode: string): Promise<User[]> => {
        try {
            const response = await api.get(`/battles/${partycode}/members/`);
            return response.data;
        } catch (error: any) {
            redirectOn401Or403(error);
            throw error;
        }
    },
    create: async (battle: BattleCreate): Promise<Battle> => {
        try {
            const response = await api.post('/battles/', battle);
            return response.data;
        } catch (error: any) {
            redirectOn401Or403(error);
            throw error;
        }
    },
    createChallenge: async (challenge: ChallengeCreate): Promise<Challenge> => {
        try {
            const response = await api.post(`/battles/challenge/create/`, challenge);
            return response.data;
        } catch (error: any) {
            redirectOn401Or403(error);
            throw error;
        }
    },
    getChallengesForBattle: async (partycode: string): Promise<Challenge[]> => {
        try {
            const response = await api.get(`/battles/${partycode}/challenges/`);
            return response.data;
        } catch (error: any) {
            redirectOn401Or403(error);
            throw error;
        }
    },
    join: async (invite: string): Promise<Battle> => {
        try {
            const response = await api.post(`/battles/join/${invite}`);
            return response.data;
        } catch (error: any) {
            redirectOn401Or403(error);
            throw error;
        }
    },
    getAllForUser: async (): Promise<Battle[]> => {
        try {
            const response = await api.get('/battles/');
            return response.data;
        } catch (error: any) {
            redirectOn401Or403(error);
            throw error;
        }
    },
    getById: async (id: number): Promise<Battle> => {
        try {
            const response = await api.get(`/battles/${id}`);
            return response.data;
        } catch (error: any) {
            redirectOn401Or403(error);
            throw error;
        }
    },
    updateUsersDistance: async (distance: number): Promise<boolean> => {
        try {
            const response = await api.post(`/battles/distance/`, { "distance": distance });
            return response.data;
        } catch (error: any) {
            redirectOn401Or403(error);
            throw error;
        }
    },
    delete: async (id: number): Promise<void> => {
        try {
            await api.delete(`/battles/${id}`);
        } catch (error: any) {
            redirectOn401Or403(error);
            throw error;
        }
    },
    getByUser: async (userId: number): Promise<Battle[]> => {
        try {
            const response = await api.get(`/battles/user/${userId}`);
            return response.data;
        } catch (error: any) {
            redirectOn401Or403(error);
            throw error;
        }
    },
};

export function redirectOn401Or403(error: any) {
    if (error.response && (error.response.status === 401)) {
        window.location.href = '/login';
    }
}
