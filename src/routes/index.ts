import { Router } from 'express';
import UserController from '../controllers/UserController';
import FavoriteController from '../controllers/FavoriteController';
import ProductController from '../controllers/ProductController';
import { authenticateToken } from '../middleware/auth';
import { validateBody } from '../middleware/validation';
import {
    createUserSchema,
    updateUserSchema,
    loginSchema,
    addFavoriteSchema,
} from '../validations';

const router = Router();

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         name:
 *           type: string
 *         email:
 *           type: string
 *         created_at:
 *           type: string
 *           format: date-time
 *         updated_at:
 *           type: string
 *           format: date-time
 *     Product:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         title:
 *           type: string
 *         image:
 *           type: string
 *         price:
 *           type: number
 *         rating:
 *           type: number
 *           nullable: true
 *         rating_count:
 *           type: integer
 *           nullable: true
 *         category:
 *           type: string
 *         description:
 *           type: string
 *         created_at:
 *           type: string
 *           format: date-time
 *         updated_at:
 *           type: string
 *           format: date-time
 *     Favorite:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         user_id:
 *           type: string
 *         product_id:
 *           type: integer
 *         created_at:
 *           type: string
 *           format: date-time
 *         product:
 *           $ref: '#/components/schemas/Product'
 */


/**
 * @swagger
 * /register:
 *   post:
 *     summary: Registrar novo usuário
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - name
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 minLength: 6
 *               name:
 *                 type: string
 *     responses:
 *       201:
 *         description: Usuário criado com sucesso
 *       400:
 *         description: Dados inválidos
 *       409:
 *         description: Email já existe
 */
router.post('/register', validateBody(createUserSchema), UserController.register);

/**
 * @swagger
 * /login:
 *   post:
 *     summary: Fazer login
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login realizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       401:
 *         description: Credenciais inválidas
 */
router.post('/login', validateBody(loginSchema), UserController.login);

/**
 * @swagger
 * /profile:
 *   get:
 *     summary: Obter perfil do usuário
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Perfil do usuário
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         description: Token inválido ou ausente
 */
router.get('/profile', authenticateToken, UserController.getProfile);

/**
 * @swagger
 * /profile:
 *   put:
 *     summary: Atualizar perfil do usuário
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *     responses:
 *       200:
 *         description: Perfil atualizado com sucesso
 *       401:
 *         description: Token inválido ou ausente
 */
router.put('/profile', authenticateToken, validateBody(updateUserSchema), UserController.updateProfile);

/**
 * @swagger
 * /profile:
 *   delete:
 *     summary: Deletar perfil do usuário
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Perfil deletado com sucesso
 *       401:
 *         description: Token inválido ou ausente
 */
router.delete('/profile', authenticateToken, UserController.deleteProfile);

/**
 * @swagger
 * /products:
 *   get:
 *     summary: Obter todos os produtos
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de produtos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 *       401:
 *         description: Token inválido ou ausente
 */
router.get('/products', authenticateToken, ProductController.getAllProducts);

/**
 * @swagger
 * /products/{id}:
 *   get:
 *     summary: Obter produto por ID
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do produto
 *     responses:
 *       200:
 *         description: Produto encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       404:
 *         description: Produto não encontrado
 *       401:
 *         description: Token inválido ou ausente
 */
router.get('/products/:id', authenticateToken, ProductController.getProductById);

/**
 * @swagger
 * /favorites:
 *   post:
 *     summary: Adicionar produto aos favoritos
 *     tags: [Favorites]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - productId
 *             properties:
 *               productId:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Produto adicionado aos favoritos
 *       400:
 *         description: Produto já está nos favoritos
 *       401:
 *         description: Token inválido ou ausente
 */
router.post('/favorites', authenticateToken, validateBody(addFavoriteSchema), FavoriteController.addFavorite);

/**
 * @swagger
 * /favorites:
 *   get:
 *     summary: Obter produtos favoritos do usuário
 *     tags: [Favorites]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de produtos favoritos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Favorite'
 *       401:
 *         description: Token inválido ou ausente
 */
router.get('/favorites', authenticateToken, FavoriteController.getFavorites);

/**
 * @swagger
 * /favorites/{productId}:
 *   delete:
 *     summary: Remover produto dos favoritos
 *     tags: [Favorites]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do produto a ser removido dos favoritos
 *     responses:
 *       200:
 *         description: Produto removido dos favoritos
 *       404:
 *         description: Produto não encontrado nos favoritos
 *       401:
 *         description: Token inválido ou ausente
 */
router.delete('/favorites/:productId', authenticateToken, FavoriteController.removeFavorite);

export default router;