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
    partycode: string;
    description?: string;
    created_at: string;
    updated_at: string;
    creator: User;
    party: BattleParty[];
    challenges: Challenge[];
    is_active: boolean;
}

export interface UserCreate {
    email: string;
    username: string;
    password: string;
}

export interface BattleCreate {
    title: string;
    description?: string;
    creator_id: number;
}

export interface LoginCredentials {
    username: string;
    password: string;
}

export interface AuthToken {
    access_token: string;
    token_type: string;
}

export interface BattleParty {
    id: number;
    battle_id: number;
    user_id: number;
    joined_at: string;
    user?: User;
}

export interface Challenge {
    id: number;
    title?: string;
    description?: string;
    icon?: string;
    value: number;
    max_value?: number;
    battle_id: number;
    creator_id: number;
    assigned_user_id: number;
    created_at: string;
    battle?: Battle;
    creator?: User;
    assigned_user?: User;
    rewards: Reward[];
}

export interface Reward {
    id: number;
    title: string;
    description?: string;
    target?: number;
    challenge_id: number;
    user_id?: number;
    challenge?: Challenge;
    user?: User;
}
