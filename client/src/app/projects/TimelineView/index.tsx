import React, { useMemo, useState } from 'react'
import { useAppSelector } from '../../redux';
import { useGetTasksQuery } from '@/src/state/api';
import { DisplayOption, Gantt, ViewMode } from "gantt-task-react";
import "gantt-task-react/dist/index.css";

type Props = {
    id: string;                                                              
    setIsModalNewTaskOpen: (isOpen: boolean) => void;
}

type TaskTypeItems = "task" | "milestone" | "project";

const TimelineView = ({id, setIsModalNewTaskOpen}: Props) => {
    const isDarkMode = useAppSelector((state) => state.global.isDarkMode);
    const { data: tasks, isLoading, error } = useGetTasksQuery({projectId: Number(id)});

    const [displayOptions, setDisplayOptions] = useState<DisplayOption>({
        viewMode: ViewMode.Month,
        locale: "pt-BR",
    })

    const ganttTasks = useMemo(() => {
        return (
            tasks?.map((task) => ({
                start: new Date(task.startDate as string),
                end: new Date(task.dueDate as string),
                name: task.title,
                id: `Task-${task.id}`,
                type: "task" as TaskTypeItems,
                progress: task.points ? (task.points / 10) * 100 : 0,
                isDisabled: false,
            })) || []
        )
    }, [tasks])

    const handleViewModeChange = (
        event: React.ChangeEvent<HTMLSelectElement>
    ) => {
        setDisplayOptions((prev) => ({
            ...prev,
            viewMode: event.target.value as ViewMode,
        }))
    }
    if (isLoading) return <div>Carregando...</div>                 
    if (error) return <div>Erro ao carregar as tasks</div>

  return (
    <div className="px-4 xl:px-6">
        <div className="flex flex-wrap items-center justify-between gap-2 py-5">
            <h1 className="me-2 text-lg font-bold dark:text-white">Timeline das Tasks do Projeto</h1>
            <div className="relative inline-block w-64">
                <select 
                    className="focus:shadow-outline block w-full appearance-noen rounded border border-gray-400 bg-white px-4 py-2 pr-8 leading-tight shadow hover:border-gray-500 
                    focus:outline-none dark:border-dark-secondary dark:bg-dark-secondary dark:text-white" 
                    value={displayOptions.viewMode}
                    onChange={handleViewModeChange}
                >
                    <option value={ViewMode.Day}>Dia</option>
                    <option value={ViewMode.Week}>Semana</option>
                    <option value={ViewMode.Month}>Mês</option>
                </select>
            </div>
        </div>

        <div className="overflow-hidden rounded-md bg-white shadow dark:bg-dark-secondary dark:text-white">
            <div className="timeline">
                <Gantt
                    tasks={ganttTasks}
                    {...displayOptions}
                    columnWidth={displayOptions.viewMode === ViewMode.Month ? 150 : 100}
                    listCellWidth="100px"
                    barBackgroundColor={isDarkMode ? "#101214" : "#aaeb8c2"}
                    barBackgroundSelectedColor={isDarkMode ? "#000" : "#9ba1a6"}
                />
            </div>
            <div className="px-4 pb-5 pt-1">
                <button 
                    className="flex items-center rounded bg-blue-600 px-3 py-2 text-white hover:bg-blue-700 hover:scale-105 transition-all"
                    onClick={() => setIsModalNewTaskOpen(true)}
                >
                    Adicionar Nova Task
                </button>
            </div>
        </div>
    </div>
  )
}

export default TimelineView