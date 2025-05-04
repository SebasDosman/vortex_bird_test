import { CreateUserRequest } from "./";


export interface UpdateUserRequest extends CreateUserRequest {
    id: number;
}