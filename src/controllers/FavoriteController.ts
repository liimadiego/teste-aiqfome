import { Request, Response } from 'express';
import prisma from '../database';
import ProductService from '../services/ProductService';
import { AuthRequest } from '../types';

class FavoriteController {
    async addFavorite(req: AuthRequest, res: Response) {
        try {
            const { productId } = req.body;
            const userId = req.user!.id;

            const prdouctValid = await ProductService.validateProduct(productId);
            if (!prdouctValid) {
                return res.status(404).json({ error: 'Produto não encontrado' });
            }

            const alreadExists = await prisma.favorite.findUnique({
                where: {
                    user_id_product_id: {
                        user_id: userId,
                        product_id: productId,
                    },
                },
            });

            if (alreadExists) {
                return res.status(409).json({ error: 'Produto já se encontra nos favoritos' });
            }
            const prodData = await ProductService.getProductById(productId);
            if (!prodData) {
                return res.status(404).json({ error: 'Produto não encontrado' });
            }

            await prisma.product.upsert({
                where: { id: productId },
                update: {
                    title: prodData.title,
                    image: prodData.image,
                    price: prodData.price,
                    rating: prodData.rating?.rate,
                    rating_count: prodData.rating?.count,
                    category: prodData.category,
                    description: prodData.description,
                },
                create: {
                    id: productId,
                    title: prodData.title,
                    image: prodData.image,
                    price: prodData.price,
                    rating: prodData.rating?.rate,
                    rating_count: prodData.rating?.count,
                    category: prodData.category,
                    description: prodData.description,
                },
            });
            const favorite = await prisma.favorite.create({
                data: {
                    user_id: userId,
                    product_id: productId,
                },
                include: {
                    product: {
                        select: {
                            id: true,
                            title: true,
                            image: true,
                            price: true,
                            rating: true,
                            rating_count: true,
                        },
                    },
                },
            });

            res.status(201).json({
                message: 'Sucesso, produto adicionado aos favoritos',
                favorite
            });
        } catch (error) {
            res.status(500).json({ error: 'Houve um erro no servidor' });
        }
    }

    async getFavorites(req: AuthRequest, res: Response) {
        try {
            const userId: string = req.user!.id;
            const page: number = parseInt(req.query.page) || 1;
            const limit: number = parseInt(req.query.limit) || 10;
            const skip: number = (page - 1) * limit;

            const [favorites, total] = await Promise.all([
                prisma.favorite.findMany({
                    where: { user_id: userId },
                    include: {
                        product: {
                            select: {
                                id: true,
                                title: true,
                                image: true,
                                price: true,
                                rating: true,
                                rating_count: true,
                            },
                        },
                    },
                    orderBy: { created_at: 'desc' },
                    skip,
                    take: limit,
                }),
                prisma.favorite.count({
                    where: { user_id: userId },
                }),
            ]);

            res.json({
                favorites,
                pagination: {
                    page,
                    limit,
                    total,
                    pages: Math.ceil(total / limit),
                },
            });
        } catch (error) {
            res.status(500).json({ error: 'Ocorreu um erro no servidor!' });
        }
    }

    async removeFavorite(req: AuthRequest<{ productId: string }>, res: Response) {
        try {
            const { productId } = req.params;
            const userId = req.user!.id;
            const favorite = await prisma.favorite.findUnique({
                where: {
                    user_id_product_id: {
                        user_id: userId,
                        product_id: parseInt(productId),
                    },
                },
            });

            if (!favorite) {
                return res.status(404).json({ error: 'Produto favoritado não encontrado' });
            }

            await prisma.favorite.delete({
                where: {
                    user_id_product_id: {
                        user_id: userId,
                        product_id: parseInt(productId)
                    },
                },
            });

            res.json({ message: 'Produto removido dos favoritos' });

        } catch (error) {

            res.status(500).json({ error: 'Houve um erro no servidor' });
        }
    }
}

export default new FavoriteController();