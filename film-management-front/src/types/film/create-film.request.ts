import { FilmClassification, FilmGenre } from "./";


export interface CreateFilmRequest {
    title: string;
    description: string;
    genre: FilmGenre;
    classification: FilmClassification;
    duration: number;
    ticketPrice: number;
}