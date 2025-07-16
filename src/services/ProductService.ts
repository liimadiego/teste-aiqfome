import axios from 'axios';
import { ProductResponse } from '../types';

class ProductService {
    private baseURL = process.env.FAKESTORE_API_URL || 'https://fakestoreapi.com';

    async getAllProducts(): Promise<ProductResponse[]> {
        try {
            const response = await axios.get(`${this.baseURL}/products`);
            return response.data;

        } catch (error) {
            throw new Error('Falha ao buscar os produtos da api');
        }
    }

    async getProductById(id: number): Promise<ProductResponse | null> {
        try {
            const response = await axios.get(`${this.baseURL}/products/${id}`);
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error) && error.response?.status === 404) {
                return null;
            }
            throw new Error('Falha ao buscar os produtos da api');
        }
    }

    async validateProduct(id: number): Promise<boolean> {
        const product = await this.getProductById(id);

        return product !== null;
    }
}

export default new ProductService();