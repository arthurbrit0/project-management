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

export const postUser = async (req: Request, res: Response) => {
    try {
        const {
            username,
            cognitoId,
            profilePictureUrl ="i1.jpg",
            teamId = 1,
        } = req.body;
        const response = await prisma.user.create({
            data: {
                username,
                cognitoId,
                profilePictureUrl,
                teamId,
            }
        })
        res.json({
            message: "Usuário criado com sucesso!", response
        });
    } catch (error: any) {
        res.status(500).json({ error: `Erro ao buscar usuários.  Erro: ${error}` });
    }

}