import { UserResponse } from "./";

export interface AuthenticationResponse {
    accessToken: string;
    tokenType: string;
    expiresIn: number;
    user: UserResponse;
}