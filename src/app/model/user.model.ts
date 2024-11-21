export interface User {
    id?: number;
    userName: string;
    firstName: string;
    lastName: string;
    email: string;
    password?: string;
    createdAt?: Date;
    updatedAt?: Date;
    isEnabled?: boolean;
}

export interface AuthResponse {
    token: string;
    user: AuthenticatedUserData;
}

export interface AuthenticatedUserData{
    id: number;
    userName: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string
}
