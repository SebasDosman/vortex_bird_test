import { UserPage, UserResponse } from "../types";
import { AuthService } from "./auth.service";


const authService = new AuthService();

export class userService {
    private readonly API_URL = import.meta.env.VITE_API_URL;

    public getAllUsers = async (page = 0, size = 10): Promise<UserPage> => {
        const token = authService.getToken();
        const response = await fetch(`${ this.API_URL }/user?page=${ page }&size=${ size }`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${ token }`
            }
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message);
        }

        return await response.json();
    }

    public getAllEnabledUsers = async (page = 0, size = 10): Promise<UserPage> => {
        const token = authService.getToken();
        const response = await fetch(`${ this.API_URL }/user/enabled?page=${ page }&size=${ size }`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${ token }`
            }
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message);
        }

        return await response.json();
    }

    public getUserById = async (id: number): Promise<UserResponse> => {
        const token = authService.getToken();
        const response = await fetch(`${ this.API_URL }/user/${ id }`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${ token }`
            }
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message);
        }

        return await response.json();
    }

    public getUserByEmail = async (email: string): Promise<UserResponse> => {
        const token = authService.getToken();
        const response = await fetch(`${ this.API_URL }/user/email/${ encodeURIComponent(email) }`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${ token }`
            }
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message);
        }

        return await response.json();
    }

    public updateUserStatus = async (id: number): Promise<UserResponse> => {
        const token = authService.getToken();
        const response = await fetch(`${ this.API_URL }/user/${ id }`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${ token }`
            }
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message);
        }

        return await response.json();
    }

    public deleteUser = async (id: number): Promise<void> => {
        const token = authService.getToken();
        const response = await fetch(`${ this.API_URL }/user/${ id }`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${ token }`
            }
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message);
        }
    }
}