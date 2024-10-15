import Header from '@/src/components/Header';
import { Tasks, useGetTasksQuery } from '@/src/state/api';
import React from 'react'
import TaskCard from '@/src/components/TaskCard';

type Props = {
    id: string;                                                              
    setIsModalNewTaskOpen: (isOpen: boolean) => void; 
}

const ListView = ({id, setIsModalNewTaskOpen}: Props) => {
    const { data: tasks, isLoading, error } = useGetTasksQuery({projectId: Number(id)});

    if (isLoading) return <div>Carregando...</div>                 
    if (error) return <div>Erro ao carregar as tasks</div>
  return (
    <div className="px-4 pb-8 xl:px-6">
        <div className="pt-5">
            <Header name="Lista" />
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 lg:gap-6">
            {tasks?.map((task: Tasks) => (
                <TaskCard key={task.id} task={task} />                   
            ))}
        </div>
    </div>
  )
}

export default ListView