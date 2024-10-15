"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserTasks = exports.updateTaskStatus = exports.createTask = exports.getTasks = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient(); // instanciando o prisma para ter acesso ao bdd
/* ROTA DE GET PARA TASKS DE UM PROJETO ESPECIFICO */
const getTasks = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { projectId } = req.query;
    try {
        const response = yield prisma.task.findMany({
            where: {
                projectId: Number(projectId),
            },
            include: {
                author: true, // populando as informacoes do autor da task, o responsavel da task, os comentarios da task e dos anexos da task
                assignee: true,
                comments: true,
                attachments: true,
            }
        });
        res.json(response);
    }
    catch (error) {
        res.status(500).json({ error: `Erro ao buscar tasks associadas ao projeto.  Erro: ${error}` });
    }
});
exports.getTasks = getTasks;
/* ROTA DE POST PARA CRIAR PROJETOS */
const createTask = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, description, status, priority, tags, startDate, dueDate, points, projectId, authorUserId, assignedUserId } = req.body;
    try {
        const data = {
            title,
            projectId: Number(projectId),
            authorUserId: Number(authorUserId),
        };
        if (description)
            data.description = description;
        if (status)
            data.status = status;
        if (priority)
            data.priority = priority;
        if (tags)
            data.tags = tags;
        if (startDate)
            data.startDate = new Date(startDate);
        if (dueDate)
            data.dueDate = new Date(dueDate);
        if (points !== undefined)
            data.points = Number(points);
        if (assignedUserId)
            data.assignedUserId = Number(assignedUserId);
        const response = yield prisma.task.create({
            data,
        });
        res.json(response);
    }
    catch (error) {
        res.status(500).json({ error: `Erro ao criar a task. Erro: ${error}` });
    }
});
exports.createTask = createTask;
/* ROTA PARA ATUALIZAR STATUS DA TASK NO DRAG&DROP DA HOME */
const updateTaskStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { taskId } = req.params;
    const { status } = req.body;
    try {
        const response = yield prisma.task.update({
            where: {
                id: Number(taskId),
            },
            data: {
                status: status,
            }
        });
        res.json(response);
    }
    catch (error) {
        res.status(500).json({ error: `Erro ao buscar tasks associadas ao projeto.  Erro: ${error}` });
    }
});
exports.updateTaskStatus = updateTaskStatus;
const getUserTasks = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.params;
    try {
        const response = yield prisma.task.findMany({
            where: {
                OR: [
                    { authorUserId: Number(userId) },
                    { assignedUserId: Number(userId) }
                ],
            },
            include: {
                author: true,
                assignee: true,
            }
        });
        res.json(response);
    }
    catch (error) {
        res.status(500).json({ error: `Erro ao buscar tasks associadas ao usuario.  Erro: ${error}` });
    }
});
exports.getUserTasks = getUserTasks;
