import { PurchaseDetailResponse } from "../";


export interface PurchaseResponse {
    id: number;
    userId: number;
    purchaseDate: Date;
    details: PurchaseDetailResponse[];
    totalAmount: number;
    paymentStatus: string;
    paymentMethod: string;
}