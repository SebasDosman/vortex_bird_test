import { AuthenticationRequest, AuthenticationResponse, CreateUserRequest, UserResponse } from "../types";


export class AuthService {
    private readonly API_URL = import.meta.env.VITE_API_URL;

    public login = async (credentials: AuthenticationRequest): Promise<AuthenticationResponse> => {
        const response = await fetch(`${ this.API_URL }/auth/signIn`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(credentials),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.details ? errorData.details : errorData.message);
        }

        return await response.json();
    }

    public register = async (userData: CreateUserRequest): Promise<AuthenticationResponse> => {
        const response = await fetch(`${ this.API_URL }/auth/signUp`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(userData),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.details ? errorData.details : errorData.message);
        }

        return await response.json();
    }

    public saveToken = (token: string): void => {
        localStorage.setItem("accessToken", token);
    }

    public getToken = (): string | null => {
        return localStorage.getItem("accessToken");
    }

    public saveUser = (user: UserResponse): void => {
        localStorage.setItem("user", JSON.stringify(user));
    }

    public getUser = (): UserResponse | null => {
        const userStr = localStorage.getItem("user");

        return userStr ? JSON.parse(userStr) : null;
    }

    public logout = (): void => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("user");
    }

    public isAuthenticated = (): boolean => {
        return !!this.getToken();
    }

    public getUserRole = (): string | null => {
        const user = this.getUser();

        return user ? user.role : null;
    }
}