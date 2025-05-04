import { PurchaseResponse } from "./";


export interface PurchasePage {
    content: PurchaseResponse[];
    pageable: {
        pageNumber: number;
        pageSize: number;
    };
    last: boolean;
    totalPages: number;
    totalElements: number;
    size: number;
    number: number;
    sort: {
        empty: boolean;
        sorted: boolean;
        unsorted: boolean;
    };
    first: boolean;
    numberOfElements: number;
    empty: boolean;
}