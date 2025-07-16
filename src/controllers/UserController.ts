import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../database';
import { CreateUserDTO, UpdateUserDTO, LoginDTO, AuthRequest } from '../types';

class UserController {
    async register(req: Request, res: Response) {
        try {
            const { name, email, password }: CreateUserDTO = req.body;

            const userExists = await prisma.user.findUnique({
                where: { email }
            });

            if (userExists) {
                return res.status(409).json({ error: 'Email já está sendo utilizado' });
            }
            const hashedPassword = await bcrypt.hash(password, 10);

            const user = await prisma.user.create({
                data: {
                    name,
                    email,
                    password: hashedPassword,
                },
                select: {
                    id: true,
                    name: true,
                    email: true,
                    created_at: true,
                },
            });
            res.status(201).json({
                message: 'User criado com sucesso',
                user,
            });
        } catch (error) {
            res.status(500).json({ error: 'Houve um erro no servidor' });
        }
    }

    async login(req: Request, res: Response) {
        try {
            const { email, password }: LoginDTO = req.body;

            const user = await prisma.user.findUnique({
                where: { email }
            });

            if (!user) return res.status(401).json({ error: 'Erro no login, usuário e senha não coincidem' });

            const passwordMatch = await bcrypt.compare(password, user.password);
            if (!passwordMatch) {
                return res.status(401).json({ error: 'Erro no login, usuário e senha não coincidem' });
            }

            const secret = process.env.JWT_SECRET;
            if (!secret || secret.trim() === '') throw new Error('JWT_SECRET is not defined');
            const token = jwt.sign(
                { id: user.id, email: user.email },
                secret,
                { expiresIn: '7d' }
            );

            res.json({
                message: 'Sucesso ao logar',
                token,
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                },
            });
        } catch (error) {
            res.status(500).json({ error: 'Houve um erro no servidor' });
        }
    }

    async getProfile(req: AuthRequest, res: Response) {
        try {
            const user = await prisma.user.findUnique({
                where: { id: req.user!.id },
                select: {
                    id: true,
                    name: true,
                    email: true,
                    created_at: true,
                    updated_at: true,
                },
            });

            res.json(user);
        } catch (error) {
            res.status(500).json({ error: 'Houve um erro no servidor' });
        }
    }

    async updateProfile(req: AuthRequest, res: Response) {
        try {
            const body = req.body as UpdateUserDTO;
            const { name, email } = body;
            const userId = req.user!.id;
            if (email) {
                const userExists = await prisma.user.findFirst({
                    where: { email, id: { not: userId } }
                });

                if (userExists) {
                    return res.status(409).json({ error: 'O email já está em uso' });
                }
            }

            const updatedUser = await prisma.user.update({
                where: { id: userId }, data: { name, email },
                select: {
                    id: true,
                    name: true,
                    email: true,
                    updated_at: true,
                },
            });

            res.json({
                message: 'Perfil alterado com sucesso',
                user: updatedUser,
            });
        } catch (error) {
            res.status(500).json({ error: 'Houve um erro no server' });
        }
    }

    async deleteProfile(req: AuthRequest, res: Response) {
        try {
            await prisma.user.delete({
                where: { id: req.user!.id }
            });
            res.json({ message: 'Sucesso ao deletar o perfil' });
        } catch (error) {
            res.status(500).json({ error: 'Houve um erro no servidor' });
        }
    }
}

export default new UserController();