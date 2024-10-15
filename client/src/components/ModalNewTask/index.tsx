import { Priority, Status, useCreateProjectMutation, useCreateTaskMutation } from '@/src/state/api';
import React, { useState } from 'react'
import Modal from '@/src/components/Modal';
import { formatISO } from 'date-fns';

type Props = {
    isOpen: boolean;
    onClose: () => void;
    projectId: string;
}

const ModalNewTask = ({isOpen, onClose, projectId}: Props) => {
    const [createTask, {isLoading}] = useCreateTaskMutation();
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [status, setStatus] = useState<Status>(Status.ToDo);
    const [priority, setPriority] = useState<Priority>(Priority.Backlog);
    const [tags, setTags] = useState("");
    const [startDate, setStartDate] = useState("");
    const [dueDate, setDueDate] = useState("");
    const [authorUserId, setAuthorUserId] = useState("");
    const [assignedUserId, setAssignedUserId] = useState("");
    

    const handleSubmit = async () => {
        if(!title || !authorUserId ) return;

        let formattedStartDate: string | undefined;
        let formattedDueDate: string | undefined;

        if (startDate) {
            formattedStartDate = formatISO(new Date(startDate), {
            representation: 'complete',
        });
        } else {
            formattedStartDate = formatISO(new Date(), { representation: 'complete' });
        }

        if (dueDate) {
            formattedDueDate = formatISO(new Date(dueDate), {
                representation: 'complete',
        });
        } else {
            const defaultDueDate = new Date();
            defaultDueDate.setDate(defaultDueDate.getDate() + 7);
            formattedDueDate = formatISO(defaultDueDate, { representation: 'complete' });
        }

        await createTask({
            title,
            description,
            status,
            priority,
            tags,
            startDate: formattedStartDate,
            dueDate: formattedDueDate,
            authorUserId: parseInt(authorUserId),
            assignedUserId: parseInt(assignedUserId),
            projectId: Number(projectId)
        })
    }

    const isFormValid = () => {
        return title && authorUserId;
    }

    const selectStyles = `mb-4 block w-full rounded border border-gray-300 px-3 py-2 dark:border-dark-tertiary dark:bg-dark-tertiary dark:text-white dark:focus:outline-none`;

    const inputStyles = `w-full rounded border border-gray-300 p-2 shadow-sm dark:border-dark-tertiary dark:bg-dark-tertiary dark:text-white dark:focus:outline-none`;
  return (
    <Modal isOpen={isOpen} onClose={onClose} name="Criar nova task">
        <form className="mt-4 space-y-6" onSubmit={(e) => {
            e.preventDefault()
            handleSubmit();
        }}>
            <input 
                type="text" 
                className={inputStyles} 
                placeholder="Título da task" 
                value={title} 
                onChange={(e) => setTitle(e.target.value)}
            />
            <textarea
                className={inputStyles} 
                placeholder="Descrição da task" 
                value={description} 
                onChange={(e) => setDescription(e.target.value)}
            />
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-2">
                <select className={selectStyles} value={status} onChange={(e)=> setStatus(Status[e.target.value as keyof typeof Status])}>
                    <option value="">Selecionar Status</option>
                    <option value="ToDo">A fazer</option>
                    <option value="WorkInProgress">Em andamento</option>
                    <option value="UnderReview">Sob revisão</option>
                    <option value="Completed">Completado</option>
                </select>
                <select className={selectStyles} value={status} onChange={(e)=> setPriority(Priority[e.target.value as keyof typeof Priority])}>
                    <option value="">Selecionar Prioridade</option>
                    <option value={Priority.Urgent}>Urgente</option>
                    <option value={Priority.High}>Alta</option>
                    <option value={Priority.Medium}>Média</option>
                    <option value={Priority.Low}>Baixa</option>
                    <option value={Priority.Backlog}>Backlog</option>
                </select>
            </div>
            <input 
                type="text" 
                className={inputStyles} 
                placeholder="Tags (separadas por vírgula)" 
                value={tags} 
                onChange={(e) => setTags(e.target.value)}
            />
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-2">
                <input 
                    type="date" 
                    className={inputStyles}  
                    value={startDate} 
                    onChange={(e) => setStartDate(e.target.value)}
                />
                <input 
                    type="date" 
                    className={inputStyles}  
                    value={dueDate} 
                    onChange={(e) => setDueDate(e.target.value)}
                />
            </div>
            <input 
                type="text" 
                className={inputStyles} 
                placeholder="ID do Autor" 
                value={authorUserId} 
                onChange={(e) => setAuthorUserId(e.target.value)}
            />
            <input 
                type="text" 
                className={inputStyles} 
                placeholder="Id do Responsável" 
                value={assignedUserId} 
                onChange={(e) => setAssignedUserId(e.target.value)}
            />
            <button 
                type="submit" 
                className="w-full justify-center flex mt-4 px-4 py-2 text-base font-medium bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:opacity-50
                disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-600 focus-offset-2"
                disabled={!isFormValid() || isLoading}
            >
                {isLoading ? "Criando..." : "Criar nova task"}
            </button>
        </form>
    </Modal>
  )
}

export default ModalNewTask;