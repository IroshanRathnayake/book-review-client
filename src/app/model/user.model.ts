export interface User {
    id?: string;
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
    user: User;
    token: string;
}
