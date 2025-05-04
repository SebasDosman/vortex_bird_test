import { CreateFilmRequest } from "./";


export interface UpdateFilmRequest extends CreateFilmRequest {
    id: number;
}