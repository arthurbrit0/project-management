import { Tasks } from '@/src/state/api'
import React from 'react'
import Image from 'next/image'
import { format } from 'date-fns';

type Props = {
    task: Tasks;
}

const TaskCard = ({ task }: Props) => {
  return (
    <div className={`mb-3 pb-7 rounded p-4 shadow text-md ${ task.priority === "Urgent" ? "bg-rose-900 text-gray-100" :
    task.priority === "High" ? "bg-red-400 text-black" : task.priority === "Medium" ? "bg-yellow-500 text-gray-900" : 
    task.priority === "Low" ? "bg-green-400 text-gray-800" : "bg-blue-800 text-gray-100"}`}>
        <div className="px-4 text-lg bg-gray-100 items-center flex flex-wrap justify-between mb-5 rounded-2xl shadow-lg">
            <div className="font-bold p-3 text-gray-900 items-center">
                Id: {task.id}
            </div>
            <p className="mr-2 text-gray-900">
                <strong>Prioridade:</strong> {task.priority}
            </p>
        </div>
        {task.attachments && task.attachments.length > 0 && (
            <div>
                <strong>Attachments:</strong>
                <div className="justify-center flex flex-wrap my-5">
                    {task.attachments && task.attachments.length > 0 && (
                        <Image 
                            src={`/${task.attachments[0].fileURL}`} 
                            alt={task.attachments[0].fileName} 
                            width={400} 
                            height={200} 
                            className="rounded-md"
                        />
                    )}
                </div>
            </div>
        )}
        <p>
            <strong>Título:</strong> {task.title}
        </p>
        <p>
            <strong>Descrição:</strong>{" "} 
            {task.description || "No description provided"}
        </p>
        <p>
            <strong>Status:</strong> {task.status}
        </p>
        <p>
            <strong>Tags:</strong> {task.tags || "No tags"}
        </p>
        <p>
            <strong>Data de começo:</strong> {" "}
            {task.startDate ? format(new Date(task.startDate), "P") : "Not set" }
        </p>
        <p>
            <strong>Prazo final:</strong> {" "}
            {task.dueDate ? format(new Date(task.dueDate), "P") : "Not set" }
        </p>
        <p>
            <strong>Autor:</strong> {task.author ? task.author.username : "Unknown"}
        </p>
        <p>
            <strong>Atribuído a:</strong> {task.assignee ? task.assignee.username : "Unassigned"}
        </p>

    </div>
  )
}

export default TaskCard