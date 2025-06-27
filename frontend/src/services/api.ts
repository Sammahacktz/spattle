import axios from 'axios';
import { AuthToken, Battle, BattleCreate, LoginCredentials, User, UserCreate } from '../types';

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
        const response = await api.get('/users/');
        return response.data;
    },

    getById: async (id: number): Promise<User> => {
        const response = await api.get(`/users/${id}`);
        return response.data;
    },
};

// Battles API
export const battlesAPI = {
    create: async (battle: BattleCreate): Promise<Battle> => {
        const response = await api.post('/battles/', battle);
        return response.data;
    },
    join: async (invite: string): Promise<Battle> => {
        const response = await api.post(`/battles/join/${invite}`);
        return response.data;
    },
    getAllForUser: async (): Promise<Battle[]> => {
        const response = await api.get('/battles/');
        return response.data;
    },

    getById: async (id: number): Promise<Battle> => {
        const response = await api.get(`/battles/${id}`);
        return response.data;
    },

    update: async (id: number, battle: Partial<BattleCreate>): Promise<Battle> => {
        const response = await api.put(`/battles/${id}`, battle);
        return response.data;
    },

    delete: async (id: number): Promise<void> => {
        await api.delete(`/battles/${id}`);
    },

    getByUser: async (userId: number): Promise<Battle[]> => {
        const response = await api.get(`/battles/user/${userId}`);
        return response.data;
    },
};
