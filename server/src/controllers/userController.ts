import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getUsers = async (
    req: Request, 
    res: Response
): Promise<void> => {
    try {
        const response = await prisma.user.findMany({})
        res.json(response);
    } catch (error: any) {
        res.status(500).json({ error: `Erro ao buscar usuários.  Erro: ${error}` });
    }
}