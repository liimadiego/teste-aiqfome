import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AuthRequest } from '../types';

export const authenticateToken = (req: AuthRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Token de acesso obrigat´orio' });
    }

    jwt.verify(token, process.env.JWT_SECRET!, (err, user) => {
        if (err) {
            return res.status(403).json({ error: 'Token expirado ou inválido' });
        }
        req.user = user as { id: string; email: string };
        next();
    });
};