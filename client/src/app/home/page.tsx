"use client";

import { Priority, Project, Tasks, useGetProjectsQuery, useGetTasksQuery } from '@/src/state/api';
import React, { useState } from 'react'
import { useAppSelector } from '../redux';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import Header from '@/src/components/Header';
import { Bar, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis, BarChart, PieChart, Pie, Cell } from 'recharts';
import { dataGridClassNames, dataGridSxStyles } from '@/src/libs/utils';

const COLORS = ["#0088FE","#00C49F","#FFBB28","#FF8042"];


const HomePage = () => {

    const [selectedProject, setSelectedProject] = useState(1);

    const {data: tasks, isLoading: isTasksLoading, isError: tasksError} = useGetTasksQuery({ projectId: Number(selectedProject) });
    const {data: projects, isLoading: isProjectsLoading, isError: projectsError} = useGetProjectsQuery();

    const isDarkMode = useAppSelector((state) => state.global.isDarkMode);

    if(isTasksLoading || isProjectsLoading) {
        return <div>Carregando...</div>
    }
    if(tasksError || projectsError || !tasks || !projects) return <div>Erro ao carregar os dados.</div>

    const priorityCount = tasks.reduce(
        (acc: Record<string,number>, task: Tasks) => {
            const {priority} = task;
            acc[priority as Priority] = (acc[priority as Priority] || 0) + 1;
            return acc;
        },
        {} as Record<string, number>
    )

    const priorityTranslations: Record<string, string> = {
        "High": "Alta",
        "Medium": "Média",
        "Low": "Baixa",
        "Backlog": "BL",
        "Urgent": "Urgente",
    };

    const taskDistribution = Object.keys(priorityCount).map((key) => ({
        name: priorityTranslations[key] || key,
        count: priorityCount[key]
    }))

    const statusCount = projects.reduce(
        (acc: Record<string,number>, project: Project) => {
            const status = project.endDate ? "Completada" : "Ativa";
            acc[status] = (acc[status] || 0) + 1;
            return acc;
        },
        {} as Record<string, number>
    )

    const projectStatus = Object.keys(statusCount).map((key) => ({
        name: key,
        count: statusCount[key]
    }))

    const taskColumns: GridColDef[] = [
        { field: "title", headerName: "Título", width: 200 },
        { field: "status", headerName: "Status", width: 150 },
        { 
            field: "priority", 
            headerName: "Prioridade", 
            width: 150,
            renderCell: (params) => priorityTranslations[params.value as string] || params.value // Traduz a prioridade
        },
        { field: "dueDate", headerName: "Prazo final", width: 150 },
    ];

    const localeText = {
        noRowsLabel: 'Nenhuma tarefa encontrada',
        footerRowSelected: (count: number) =>
            count !== 1 ? `${count.toLocaleString()} linhas selecionadas` : `${count.toLocaleString()} linha selecionada`,
        footerPaginationRowsPerPage: 'Linhas por página:',
        footerPaginationOf: (count: number) => `de ${count.toLocaleString()}`,
        MuiTablePagination: {
            labelRowsPerPage: 'Linhas por página:',
            labelDisplayedRows: ({ from, to, count }: {from: number, to: number, count: number}) => `${from}–${to} de ${count !== -1 ? count : `mais de ${to}`}`,
        }
    };

    const chartColors = isDarkMode ? {
        bar: "#8884d8",
        barGrid: "#303030",
        pieFill: "#4A90E2",
        text: "#FFFFFF"
    } : {
        bar: "#8884d8",
        barGrid: "#E0E0E0",
        pieFill: "#82ca9d",
        text: "#000000"
    }


  return (
    <div className="container h-full w-[100%] bg-gray-100 bg-transparent p-8">
        <Header name="Dashboard de Gerenciamento de Projetos" />
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                <div className="rounded-lg bg-white p-4 shadow dark:bg-dark-secondary">
                    <h3 className="mb-4 text-lg font-semibold dark:text-white">
                        Distribuição de Tarefas por Prioridade
                    </h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={taskDistribution}>
                            <CartesianGrid strokeDasharray={"3 3"} stroke={chartColors.barGrid} />
                            <XAxis dataKey="name" stroke={chartColors.text} />
                            <YAxis stroke={chartColors.text} />
                            <Tooltip contentStyle={{width: "min-content", height: "min-content"}} />
                            <Legend />
                            <Bar dataKey="count" fill={chartColors.bar} /> 
                        </BarChart>
                    </ResponsiveContainer>
                    <div className="flex flex-wrap justify-center items-center gap-2 mt-4 mb-1">
                        <div className="flex text-md gap-3 justify-center">
                            <label htmlFor="project">Id do Projeto</label>
                            <input className="w-1/2 border border-gray-300 rounded-md" name="project" type="number" min="1" value={selectedProject} onChange={(e) => setSelectedProject(Number(e.target.value))} />
                        </div>
                    </div>
                </div>
                <div className="rounded-lg bg-white p-4 shadow dark:bg-dark-secondary">
                    <h3 className="mb-4 text-lg font-semibold dark:text-white">
                        Distribuição de Projetos por Status
                    </h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie dataKey="count" data={projectStatus} fill="82ca9d" label>
                                {projectStatus.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
                <div className="rounded-lg bg-white p-4 shadow dark:bg-dark-secondary md:col-span-2">
                    <h3 className="mb-4 text-lg font-semibold dark:text-white">
                        Suas tarefas
                    </h3>
                    <div style={{height:400,width:"100%"}}>
                        <DataGrid 
                            rows={tasks}
                            pagination
                            localeText={localeText}
                            columns={taskColumns}
                            checkboxSelection
                            loading={isTasksLoading}
                            getRowClassName={() => "data-grid-row"}
                            getCellClassName={() => "data-grid-cell"}
                            className={dataGridClassNames}
                            sx={dataGridSxStyles(isDarkMode)}
                        />
                    </div>
                </div>
            </div>
    </div>
  )
}

export default HomePage