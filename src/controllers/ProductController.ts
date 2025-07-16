import { Request, Response } from 'express';
import ProductService from '../services/ProductService';

class ProductController {
    async getAllProducts(req: Request, res: Response) {
        try {
            const products = await ProductService.getAllProducts();

            res.json(products);

        } catch (error) {
            res.status(500).json({ error: 'Falha ao buscar os produtos' });
        }
    }

    async getProductById(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const product = await ProductService.getProductById(parseInt(id));

            if (!product) {
                return res.status(404).json({ error: 'Produto não encontrado' });
            }

            res.json(product);
        } catch (error) {
            res.status(500).json({ error: 'Falha ao buscar o produto' });
        }
    }
}

export default new ProductController();