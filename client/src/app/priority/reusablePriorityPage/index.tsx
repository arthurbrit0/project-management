"use client"

import { Priority, Tasks, useGetAuthUserQuery, useGetTasksUserQuery } from '@/src/state/api'
import React, { useState } from 'react'
import { useAppSelector } from '../../redux'
import ModalNewTask from '@/src/components/ModalNewTask'
import Header from '@/src/components/Header'
import TaskCard from '@/src/components/TaskCard'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import { dataGridClassNames, dataGridSxStyles } from '@/src/libs/utils'

type Props = {
    priority: Priority
};

const columns: GridColDef[] = [
    {
        field: "title",
        headerName: "Título",
        width: 100,
      },
      {
        field: "description",
        headerName: "Descrição",
        width: 200,
      },
      {
        field: "status",
        headerName: "Status",
        width: 130,
        renderCell: (params) => (
          <span className="inline-flex rounded-full bg-green-100 px-2 text-xs font-semibold leading-5 text-green-800">
            {params.value}
          </span>
        ),
      },
      {
        field: "priority",
        headerName: "Prioridade",
        width: 75,
      },
      {
        field: "tags",
        headerName: "Tags",
        width: 130,
      },
      {
        field: "startDate",
        headerName: "Data de Começo",
        width: 130,
      },
      {
        field: "dueDate",
        headerName: "Prazo final",
        width: 130,
      },
      {
        field: "author",
        headerName: "Autor",
        width: 150,
        renderCell: (params) => params.value?.author || "Unknown",
      },
      {
        field: "assignee",
        headerName: "Atribuído a",
        width: 150,
        renderCell: (params) => params.value?.assignee || "Unassigned",
      },
];

const localeText = {
    noRowsLabel: 'Nenhuma tarefa encontrada',
    footerRowSelected: (count: number) =>
        count !== 1 ? `${count.toLocaleString()} linhas selecionadas` : `${count.toLocaleString()} linha selecionada`,
    footerPaginationRowsPerPage: 'Linhas por página:',
    footerPaginationOf: (count: number) => `de ${count.toLocaleString()}`,
    MuiTablePagination: {
        labelRowsPerPage: 'Linhas por página:',
        labelDisplayedRows: ({ from, to, count }: {from: number, to: number, count:number}) => `${from}–${to} de ${count !== -1 ? count : `mais de ${to}`}`,
    }
};

const ReusablePriorityPage = ({priority}: Props) => {

  const { data: currentUser } = useGetAuthUserQuery({});
  console.log(currentUser)
  const userId = currentUser?.userDetails?.userId ?? null;
  console.log(userId)

    const [view, setView] = useState('list')
    const [isModalNewTaskOpen, setIsModalNewTaskOpen] = useState(false)
    const { data: tasks, isLoading, isError: isTasksError } = useGetTasksUserQuery(userId || 0, {
        skip: userId === null
    })

    const isDarkMode = useAppSelector((state) => state.global.isDarkMode);

    const filteredTasks = tasks?.filter((task: Tasks) => task.priority === priority)

    if (isTasksError || !tasks) return <div>Erro ao retornar as tasks</div>

  return (
    <div className="m-5 p-4">
        <ModalNewTask isOpen={isModalNewTaskOpen} onClose={() => setIsModalNewTaskOpen(false)} />
        <Header name="Prioridades" buttonComponent={
            <button className="mr-3 rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700" onClick={()=> setIsModalNewTaskOpen(true)}>
                Adicionar nova task
            </button>
        }/>
        <div className="mb-4 flex justify-start">
            <button className={`px-4 py-2 ${view === 'list' ? 'bg-gray-300' : 'bg-white'} rounded-l`} onClick={() => setView('list')}>
                Lista
            </button>
            <button className={`px-4 py-2 ${view === 'table' ? 'bg-gray-300' : 'bg-white'} rounded-l`} onClick={() => setView('table')}>
                Tabela
            </button>
        </div>
        {isLoading ? (<div>Carregando...</div>) : view === 'list' ? 
            <div className="grid grid-cols-1 gap-4 w-3/4 mx-auto">
                {filteredTasks?.map((task: Tasks) => (
                    <TaskCard task={task} key={task.id}/>
                ))}
            </div> : (
                view === 'table' && filteredTasks && (
                    <div className="w-full">
                        <DataGrid 
                            rows={filteredTasks}
                            columns={columns}
                            checkboxSelection
                            getRowId={(row) => row.id}
                            className={dataGridClassNames}
                            sx={dataGridSxStyles(isDarkMode)}
                            localeText={localeText}  
                        />
                    </div>
                )
            )
        }
    </div>
  )
}

export default ReusablePriorityPage