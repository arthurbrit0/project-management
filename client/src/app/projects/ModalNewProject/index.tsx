import { useCreateProjectMutation } from '@/src/state/api';
import React, { useState } from 'react'
import Modal from '@/src/components/Modal';
import { formatISO } from 'date-fns';

type Props = {
    isOpen: boolean;
    onClose: () => void;
}

const ModalNewProject = ({isOpen, onClose}: Props) => {
    const [createProject, {isLoading}] = useCreateProjectMutation();
    const [projectName, setProjectName] = useState("")
    const [description, setDescription] = useState("")
    const [startDate, setStartDate] = useState("")
    const [endDate, setEndDate] = useState("")

    const handleSubmit = async () => {
        if(!projectName || !startDate || !endDate) return;

        const formattedStartDate = formatISO(new Date(startDate), { representation: 'complete' });
        const formattedEndDate = formatISO(new Date(endDate), { representation: 'complete' });

        await createProject({
            name: projectName,
            description,
            startDate: formattedStartDate,
            endDate: formattedEndDate
        })
    }

    const isFormValid = () => {
        return projectName && startDate && endDate;
    }

    const inputStyles = `w-full rounded border border-gray-300 p-2 shadow-sm dark:border-dark-tertiary dark:bg-dark-tertiary dark:text-white dark:focus:outline-none`;
  return (
    <Modal isOpen={isOpen} onClose={onClose} name="Criar novo projeto">
        <form className="mt-4 space-y-6" onSubmit={(e) => {
            e.preventDefault()
            handleSubmit();
        }}>
            <input 
                type="text" 
                className={inputStyles} 
                placeholder="Nome do projeto" 
                value={projectName} 
                onChange={(e) => setProjectName(e.target.value)}
            />
            <textarea
                className={inputStyles} 
                placeholder="Descrição do projeto" 
                value={description} 
                onChange={(e) => setDescription(e.target.value)}
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
                    value={endDate} 
                    onChange={(e) => setEndDate(e.target.value)}
                />
            </div>
            
            
            <button 
                type="submit" 
                className="w-full justify-center flex mt-4 px-4 py-2 text-base font-medium bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:opacity-50
                disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-600 focus-offset-2"
                disabled={!isFormValid() || isLoading}
            >
                {isLoading ? "Criando..." : "Criar novo projeto"}
            </button>
        </form>
    </Modal>
  )
}

export default ModalNewProject