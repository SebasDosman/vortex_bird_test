import { PaymentMethod, CreatePurchaseDetailRequest } from "../";


export interface CreatePurchaseRequest {
    userId: number;
    paymentMethod: PaymentMethod;
    details: CreatePurchaseDetailRequest[];
}