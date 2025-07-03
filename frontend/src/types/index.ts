export interface User {
    id: number;
    email: string;
    username: string;
    is_active: boolean;
    created_at: string;
    updated_at?: string;
    strava_refresh_token: boolean;
    strava_access_token: boolean;
}

export interface Battle {
    id: number;
    partycode: string;
    title: string;
    description?: string;
    created_at: string;
    updated_at: string;
    creator: User;
    party: BattleParty[];
    challenges: Challenge[];
    is_active: boolean;
    creator_id: number;
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
    start_datetime?: string;
    end_datetime?: string;
    battle?: Battle;
    creator?: User;
    assigned_user?: User;
    rewards: Reward[];
}

export interface ChallengeCreate {
    title?: string;
    description?: string;
    value: number;
    max_value: number;
    assigned_user?: User;
    rewards: RewardCreate[];
    assigned_user_id: number;
    partycode: string;
    creator_id: number;
    icon?: string;
    start_datetime?: string;
    end_datetime?: string;
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

export interface RewardCreate {
    title: string;
    description: string;
    target: number;
    challenge_id: number;
}

export interface StravaRunData {
    id: number;
    name: string;
    distance: number;
    moving_time: number;
    elapsed_time: number;
    type: string;
    start_date: string;
    average_speed?: number;
    max_speed?: number;
    total_elevation_gain?: number;
    map?: Record<string, any>;
    external_id?: string;
    upload_id?: number;
    kudos_count?: number;
    average_heartrate?: number;
    max_heartrate?: number;
    calories?: number;
}
