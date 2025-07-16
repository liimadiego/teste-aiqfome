import { Request } from 'express';

export interface CreateUserDTO {
    name: string;
    email: string;
    password: string;
}

export interface UpdateUserDTO {
    name?: string;
    email?: string;
}

export interface LoginDTO {
    email: string;
    password: string;
}

export interface ProductResponse {
    id: number;
    title: string;
    price: number;
    description: string;
    category: string;
    image: string;
    rating?: {
        rate: number;
        count: number;
    };
}

export interface FavoriteResponse {
    id: string;
    product: {
        id: number;
        title: string;
        image: string;
        price: number;
        rating?: number;
    };
    created_at: Date;
}

export interface AuthRequest<P = {}, ResBody = any, ReqBody = any, ReqQuery = any> extends Request<P, ResBody, ReqBody, ReqQuery> {
    user?: {
        id: string;
        email: string;
    };
}