import { CreateFilmRequest, FilmPage, FilmResponse, UpdateFilmRequest } from "../types/film";
import { AuthService } from "./auth.service";


const authService = new AuthService();

export class FilmService {
    private readonly API_URL = import.meta.env.VITE_API_URL;

    public getAllFilms = async (page = 0, size = 10): Promise<FilmPage> => {
        const token = authService.getToken();
        const response = await fetch(`${ this.API_URL }/film?page=${ page }&size=${ size }`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${ token }`
            }
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.details ? errorData.details : errorData.message);
        }

        return await response.json();
    }

    public getAllEnabledFilms = async (page = 0, size = 10): Promise<FilmPage> =>{
        const token = authService.getToken();
        const response = await fetch(`${ this.API_URL }/film/enabled?page=${ page }&size=${ size }`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${ token }`
            }
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.details ? errorData.details : errorData.message);
        }

        return await response.json();
    }

    public getFilmById = async (id: number): Promise<FilmResponse> => {
        const token = authService.getToken();
        const response = await fetch(`${ this.API_URL }/film/${ id }`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${ token }`
            }
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.details ? errorData.details : errorData.message);
        }

        return await response.json();
    }

    public getFilmByTitle = async (title: string, page = 0, size = 10): Promise<FilmPage> => {
        const token = authService.getToken();
        const response = await fetch(`${ this.API_URL }/film/title/${ encodeURIComponent(title) }?page=${ page }&size=${ size }`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${ token }`
            }
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.details ? errorData.details : errorData.message);
        }

        return await response.json();
    }

    public createFilm = async (filmData: CreateFilmRequest, image: File, folder?: string): Promise<FilmResponse> =>{
        const token = authService.getToken();
        const formData = new FormData();
        
        const filmDataBlob = new Blob([JSON.stringify(filmData)], { type: "application/json" });
        formData.append("filmData", filmDataBlob);
        formData.append("image", image);
        
        if (folder) formData.append("folder", folder);

        const response = await fetch(`${ this.API_URL }/film/admin`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${ token }`
            },
            body: formData
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.details ? errorData.details : errorData.message);
        }

        return await response.json();
    }

    public updateFilm = async (filmData: UpdateFilmRequest): Promise<FilmResponse> => {
        const token = authService.getToken();
        const response = await fetch(`${ this.API_URL }/film/admin`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(filmData)
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.details ? errorData.details : errorData.message);
        }

        return await response.json();
    }

    public updateFilmStatus = async (id: number): Promise<FilmResponse> => {
        const token = authService.getToken();
        const response = await fetch(`${ this.API_URL }/film/admin/${ id }`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${ token }`
            }
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.details ? errorData.details : errorData.message);
        }

        return await response.json();
    }

    public deleteFilm = async (id: number): Promise<void> => {
        const token = authService.getToken();
        const response = await fetch(`${ this.API_URL }/film/admin/${ id }`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${ token }`
            }
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.details ? errorData.details : errorData.message);
        }
    }
}
