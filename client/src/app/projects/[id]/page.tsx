"use client";

import React, { useState } from 'react'
import ProjectHeader from "../ProjectHeader";
import BoardView from '../BoardView';
import ListView from '../ListView';
import TimelineView from '../TimelineView';
import TableView from '../TableView';

type Props = {
    params: {id: string}
}

function Project({ params }: Props) {
    const { id } = params;                                      // next js automaticamente coloca os parâmetros da url no campo params do tipo Props
    const [ activeTab, setActiveTab ] = useState("Quadro");
    const [ isModalNewTaskOpen, setIsModalNewTaskOpen ] = useState(false);
  return (
    <div>   
        {/* MODAL DE NOVAS TASKS */}
        <ProjectHeader activeTab={activeTab} setActiveTab={setActiveTab} />
        { activeTab === "Quadro" && (
          <BoardView id={id} setIsModalNewTaskOpen={setIsModalNewTaskOpen} />
        )}
        { activeTab === "Lista" && (
          <ListView id={id} setIsModalNewTaskOpen={setIsModalNewTaskOpen} />
        )}
        { activeTab === "Timeline" && (
          <TimelineView id={id} setIsModalNewTaskOpen={setIsModalNewTaskOpen} />
        )}
        { activeTab === "Tabela" && (
          <TableView id={id} setIsModalNewTaskOpen={setIsModalNewTaskOpen} />
        )}
        
    </div>
  )
}

export default Project