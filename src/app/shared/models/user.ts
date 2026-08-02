export interface User {
    id?: number;
    username: string;
    email: string;
    token?: string;
}

export interface AuthResponse {
    token: string;
    type: string;
    username: string;
    email: string;
}