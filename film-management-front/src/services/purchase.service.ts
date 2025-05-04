import { CreatePurchaseRequest, PurchasePage, PurchaseResponse } from "../types";
import { AuthService } from "./auth.service";


const authService = new AuthService();

export class PurchaseService {
    private readonly API_URL = import.meta.env.VITE_API_URL;

    public getAllPurchases = async (page = 0, size = 10): Promise<PurchasePage> => {
        const token = authService.getToken();
        const response = await fetch(`${  this.API_URL }/purchase?page=${ page }&size=${ size }`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${  token }`
            }
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.details ? errorData.details : errorData.message);
        }

        return await response.json();
    }

    public getPurchasesByUserId = async (userId: number, page = 0, size = 10): Promise<PurchasePage> => {
        const token = authService.getToken();
        const response = await fetch(`${ this.API_URL }/purchase/user/${ userId }?page=${ page }&size=${ size }`, {
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

    public getPurchaseById = async (id: number): Promise<PurchaseResponse> => {
        const token = authService.getToken();
        const response = await fetch(`${ this.API_URL }/purchase/${ id }`, {
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

    public createPurchase = async (purchaseData: CreatePurchaseRequest): Promise<PurchaseResponse> => {
        const token = authService.getToken();
        const response = await fetch(`${ this.API_URL }/purchase`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${ token }`
            },
            body: JSON.stringify(purchaseData)
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.details ? errorData.details : errorData.message);
        }

        return await response.json();
    }

    public deletePurchase = async (id: number): Promise<void> => {
        const token = authService.getToken();
        const response = await fetch(`${ this.API_URL }/purchase/${ id }`, {
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