export interface User {
    id: number;
    email: string;
    username: string;
    is_active: boolean;
    created_at: string;
    updated_at?: string;
}

export interface Battle {
    id: number;
    title: string;
    description?: string;
    sport_type: string;
    is_active: boolean;
    created_at: string;
    updated_at?: string;
}

export interface UserCreate {
    email: string;
    username: string;
    password: string;
}

export interface BattleCreate {
    title: string;
    description?: string;
    sport_type: string;
}

export interface LoginCredentials {
    username: string;
    password: string;
}

export interface AuthToken {
    access_token: string;
    token_type: string;
}
