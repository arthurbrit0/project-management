import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient(); // instanciando o prisma para ter acesso ao bdd

/* ROTA DE GET PARA PROJETOS */

export const getProjects = async (
    req: Request, 
    res: Response
): Promise<void> => {
    try {
        const response = await prisma.project.findMany()
        res.json(response);
    } catch (error: any) {
        res.status(500).json({ error: `Erro ao buscar projetos.  Erro: ${error}` });
    }
}

/* ROTA DE POST PARA CRIAR PROJETOS */

export const createProject = async (
    req: Request,
    res: Response
): Promise<void> => {

    const { name, description, startDate, endDate } = req.body;

    try {
        const response = await prisma.project.create({
            data: {
                name,
                description,
                startDate,
                endDate
            }
        })
        res.json(response);
    } catch (error: any) {
        res.status(500).json({ error: `Erro ao criar projeto. Erro: ${error}` });
    }
}