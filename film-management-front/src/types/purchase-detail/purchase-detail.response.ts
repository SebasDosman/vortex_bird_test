import { FilmResponse } from "../";


export interface PurchaseDetailResponse {
    id: number;
    film: FilmResponse;
    quantity: number;
    unitPrice: number;
}