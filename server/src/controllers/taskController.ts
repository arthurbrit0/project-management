import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient(); // instanciando o prisma para ter acesso ao bdd

/* ROTA DE GET PARA TASKS DE UM PROJETO ESPECIFICO */

export const getTasks = async (
    req: Request, 
    res: Response
): Promise<void> => {
    const { projectId } = req.query;
    try {
        const response = await prisma.task.findMany({
            where: {
                projectId: Number(projectId),
            },  
            include: {
                author: true,       // populando as informacoes do autor da task, o responsavel da task, os comentarios da task e dos anexos da task
                assignee: true,
                comments: true,
                attachments: true,
            }
        })
        res.json(response);
    } catch (error: any) {
        res.status(500).json({ error: `Erro ao buscar tasks associadas ao projeto.  Erro: ${error}` });
    }
}

/* ROTA DE POST PARA CRIAR PROJETOS */

export const createTask = async (
    req: Request,
    res: Response
): Promise<void> => {

    const { title, description, status, priority, tags, startDate, dueDate, points, projectId, authorUserId, assignedUserId } = req.body;

    try {
        const data: any = {
            title,
            projectId: Number(projectId),
            authorUserId: Number(authorUserId),
        };

        if (description) data.description = description;
        if (status) data.status = status;
        if (priority) data.priority = priority;
        if (tags) data.tags = tags;
        if (startDate) data.startDate = new Date(startDate);
        if (dueDate) data.dueDate = new Date(dueDate);
        if (points !== undefined) data.points = Number(points);
        if (assignedUserId) data.assignedUserId = Number(assignedUserId);

        const response = await prisma.task.create({
            data,
        });
        res.json(response);
    } catch (error: any) {
        res.status(500).json({ error: `Erro ao criar a task. Erro: ${error}` });
    }
}

/* ROTA PARA ATUALIZAR STATUS DA TASK NO DRAG&DROP DA HOME */

export const updateTaskStatus = async (
    req: Request, 
    res: Response
): Promise<void> => {
    const { taskId } = req.params;
    const { status } = req.body;
    try {
        const response = await prisma.task.update({
            where: {
                id: Number(taskId),
            },
            data: {
                status: status,
            }
        })
        res.json(response);
    } catch (error: any) {
        res.status(500).json({ error: `Erro ao buscar tasks associadas ao projeto.  Erro: ${error}` });
    }
}