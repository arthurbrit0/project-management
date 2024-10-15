import { useGetTasksQuery, useUpdateTaskStatusMutation } from '@/src/state/api';
import React from 'react'
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend'
import { Tasks as TaskType } from '@/src/state/api';
import { EllipsisVertical, MessageSquare, MessageSquareMore, Plus } from 'lucide-react';
import { format } from 'date-fns';
import Image from 'next/image';
import { Span } from 'next/dist/trace';

type BoardProps = {                                         // criando o tipo de props que o componente BoardView irá receber
    id: string;                                             // id do projeto que será passado para a query                   
    setIsModalNewTaskOpen: (isOpen: boolean) => void;       // função que será passada para o componente TaskColumn
}

const taskStatus = ["To Do", "Work In Progress", "Under Review", "Completed"];  // criando um array de status, que mapearemos para criar cada coluna

const BoardView = ({ id , setIsModalNewTaskOpen} : BoardProps) => {
  
  const {data: tasks = [], isLoading, error} = useGetTasksQuery({projectId: Number(id)});  // usamos o hook fornecido pelo RTK Query, na nossa api, para dar fetch em todas as tasks do projeto com id X

  const [updateTaskStatus] = useUpdateTaskStatusMutation();         // updateTaskStatus será um trigger para o hook que criamos, que serve para atualizar o status da task

  const moveTask = (taskId: number, toStatus: string) => {          // função que atualiza o status de uma task, com os parâmetros passados (id da task e novo status)
    updateTaskStatus({taskId, status: toStatus})                    // quando chamamos a função moveTask, atualizamos a task com id pasasdo para ter um novo status, que tambem foi passado como parametro
  }

    if (isLoading) return <div>Carregando...</div>                  // se o fetch para pegar as tasks do projeto estiver carregando, retornamos uma div com o texto "Carregando..."
    if (error) return <div>Erro ao carregar as tasks</div>          // se der algum erro no fetch, retornamos um erro visual

  return (                                                          // utilizaremos o DndProvider, para a funcionalidade de drag and drop
    <DndProvider backend={HTML5Backend}>                            
        <div className="grid grid-cols-1 gap-4 p-4 md:grid-cols-2 xl:grid-cols-4">
            {taskStatus.map((status) => ( // mapeamos o array de status para criar uma coluna para cada status 
                <TaskColumn               // cada status terá uma coluna com sua respectiva status, tasks da coluna, função para mover a task com drag and drop
                    key={status}
                    status={status}
                    tasks={tasks}
                    moveTask={moveTask}
                    setIsModalNewTaskOpen={setIsModalNewTaskOpen}
                />
            ))}
                
        </div>
    </DndProvider>
  )
}

export default BoardView

interface TaskColumnProps {                                 // tipando os props do componente TaskColumn
    status: string;                                         // passaremos o status, que definirá o nome da coluna
    tasks: TaskType[];                                      // passamos as tasks que obtivemos na query para essa coluna, que irá filtrar as tasks por status
    moveTask: (taskId: number, toStatus: string) => void;   // função que será passada para o componente Task, que atualiza o status da task
    setIsModalNewTaskOpen: (isOpen: boolean) => void;
}

const TaskColumn = ({ status, tasks, moveTask, setIsModalNewTaskOpen }: TaskColumnProps) => { // componente que servirá como uma coluna do quadro
    const [{ isOver }, drop] = useDrop(() => ({
        accept: "task",
        drop: (item: { id: number }) => moveTask(item.id, status),
        collect: (monitor: any) => ({
            isOver: !!monitor.isOver(),
        })
    }));

    const tasksCount = tasks.filter((task) => task.status === status).length; 
    const statusColor: any = {
        "To Do": "#2563EB",
        "Work In Progress": "#059669",
        "Under Review": "#D97706",
        "Completed": "#000000"
    }

    return (
        <div ref={(instance) => {
            drop(instance)
        }}
            className={`sl:py-4 rounded-lg py-2 xl:px-2 ${isOver ? "bg-blue-100 dark:bg-neutral-950" : ""}`}
        >
            <div className="mb-3 flex w-full">
                <div className={`w-2 !bg-[${statusColor[status]}] rounded-s-lg`} style={{ backgroundColor: statusColor[status]}}/>
                <div className="flex w-full items-center justify-between rounded-e-lg bg-white px-5 py-4 dark:bg-dark-secondary">
                    <h3 className="flex items-center text-lg font-semibold dark:text-white">
                        {status === "To Do" ? "A fazer" : status === "Work In Progress" ? "Em andamento" :
                        status === "Under Review" ? "Sob Revisão" : "Completado"} {" "}
                        <span className="ml-2 inline-block rounded-full bg-gray-200 p-1 text-center text-sm leading-none dark:bg-dark-tertiary" style={{width:"1.5rem", height:"1.5rem"}}>
                            {tasksCount}
                        </span>
                    </h3>
                    <div className="flex items-center gap-1">
                        <button className="flex h-6 w-5 items-center jusitfy-center dark:text-neutral-500">
                            <EllipsisVertical size={26}/>
                        </button>
                        <button className="flex h-6 w-6 items-center justify-center rounded bg-gray-200 dark:bg-dark-tertiary dark:text-white" onClick={() => setIsModalNewTaskOpen(true)}>
                            <Plus size={26}/>
                        </button>
                    </div>
                </div>
            </div>
            {tasks.filter((task) => task.status === status).map((task) => (
                <Task key={task.id} task={task} />
            ))}
        </div>
    )
}

type TaskProps = {
    task: TaskType;
}

const Task = ({ task }: TaskProps) => {
    const [{ isDragging }, drag] = useDrag(() => ({
        type: "task",
        item: { id: task.id },
        collect: (monitor: any) => ({
            isDragging: !!monitor.isDragging(),
        })
    }));

    const taskTagsSplit = task.tags ? task.tags.split(",") : [];

    const formattedStartDate = task.startDate ? format(new Date(task.startDate), "P") : "";
    const formattedDueDate = task.dueDate ? format(new Date(task.dueDate), "P") : "";

    const commentsNumber = (task.comments && task.comments.length) || 0;

    const PriorityTag = ({priority}: {priority: TaskType["priority"]}) => (
        <div className={`rounded-full px-2 py-1 text-xs font-semibold ${
            priority === "Urgent" ? "bg-red-200 text-red-700" : 
            priority === "High" ? "bg-yellow-200 text-yellow-700" : 
            priority === "Medium" ? "bg-green-200 text-green-700" : 
            priority === "Low" ? "bg-blue-200 text-blue-700" : 
            "bg-gray-200 text-gray-700"
        }`}>
            {priority === "Urgent" ? "Urgente" : 
            priority === "High" ? "Alta" : 
            priority === "Medium" ? "Média" : 
            priority === "Low" ? "Baixa" : 
            "Backlog"}
        </div>);

    return (
        <div ref={(instance) => {
            drag(instance)
        }}
            className={`mb-4 rounded-md bg-white shadow dark:bg-dark-secondary ${isDragging ? "opacity-50" : "opacity-100"}`}
        >
            {task.attachments && task.attachments.length > 0 && (
                <Image 
                    src={`/${task.attachments[0].fileURL}`} 
                    alt={task.attachments[0].fileName} 
                    width={400} 
                    height={200} 
                    className="h-auto w-full rounded-t-md"
                />
              )}
                <div className="p-4 md:p-6">
                    <div className="flex items-start justify-between">
                        <div className="flex flex-1 flex-wrap items-center gap-2">
                            {task.priority && <PriorityTag priority={task.priority} />}
                            <div className="flex gap-2">
                                {taskTagsSplit.map((tag) => (
                                    <div key={tag} className="bg-blue-100 text-gray-800 font-semibold rounded-full px-2 py-1 text-xs">
                                        {tag}
                                    </div>
                                ))}
                            </div>
                        </div>
                        <button className="flex h-6 w-4 flex-shrink-0 items-center justify-center dark:text-neutral-500">
                            <EllipsisVertical size={26}/>
                        </button>
                    </div>
                    <div className="my-3 flex justify-between">
                        <h4 className="text-md font-bold dark:text-white">
                            {task.title}
                        </h4>
                        {typeof task.points === "number" && (
                            <div className="text-xs font-semibold dark:text-white">
                                {task.points} pts
                            </div>
                        )}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-neutral-500">
                        {formattedStartDate && <span>{formattedStartDate} - </span>}
                        {formattedDueDate && <span>{formattedDueDate}</span>}
                    </div>
                    <p className="text-sm text-gray-600-dark:text-neutral-500">
                        {task.description}
                    </p>
                    <div className="mt-4 border-t border-gray-200 dark:border-stroke-dark"/>

                    {/* Usuarios */}
                    <div className="mt-3 flex items-center justify-between">
                        <div className="flex -space-x-[6px] overflow-hidden">
                            {task.assignee && (
                                <Image
                                    key={task.assignee.userId}
                                    src={`/${task.assignee.profilePictureUrl!}`}
                                    alt={task.assignee.username}
                                    width={30}
                                    height={30}
                                    className="h-8 w-8 rounded-full border-2 border-white object-cover dark:border-dark-secondary"
                                />
                            )}
                            {task.author && (
                                <Image
                                    key={task.author.userId}
                                    src={`/${task.author.profilePictureUrl!}`}
                                    alt={task.author.username}
                                    width={30}
                                    height={30}
                                    className="h-8 w-8 rounded-full border-2 border-white object-cover dark:border-dark-secondary"
                                />
                            )}
                        </div>
                        <div className="flex items-center text-gray-500 dark:text-neutral-500">
                            <MessageSquare size={20}/>
                            <span className="ml-1 text-sm dark:text-neutral-400">{commentsNumber}</span>
                        </div>
                    </div>
                </div>
        </div>
    )
}