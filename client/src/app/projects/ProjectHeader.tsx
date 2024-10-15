import Header from '@/src/components/Header';
import { Calendar, Clock, Filter, Grid, Grid3X3, Grid3x3, List, Share, Share2, Table } from 'lucide-react';
import React, { useState } from 'react'

type Props = {
    activeTab: string;
    setActiveTab: (tab: string) => void;
}

function ProjectHeader({ activeTab, setActiveTab }: Props) {
    const [isModalNewProjectOpen, setIsModalNewProjectOpen] = useState(false);
  return (
    <div className="px-4 xl:-px6">
        {/* MODAL DE NOVO PROJETO */}
        <div className="ml-6 pb-6 pt-6 lg:pb-4 lg:pt-8">
            <Header name="Desenvolvimento" />
        </div>
        {/* TABS */}

        <div className="justify-between flex flex-wrap-reverse gap-2 border-y border-gray-200 pb-[8px] pt-2 dark:border-stroke-dark md:items-center">
            <div className="flex flex-1 items-center gap-2 md:gap-4">
                <TabButton name="Quadro" icon={<Grid3x3 className="w-5 h-5"/>} setActiveTab={setActiveTab} activeTab={activeTab} />
                <TabButton name="Lista" icon={<List className="w-5 h-5"/>} setActiveTab={setActiveTab} activeTab={activeTab} />
                <TabButton name="Timeline" icon={<Clock className="w-5 h-5" />} setActiveTab={setActiveTab} activeTab={activeTab} />
                <TabButton name="Tabela" icon={<Table className="w-5 h-5" />} setActiveTab={setActiveTab} activeTab={activeTab} />
            </div>
            <div className="flex items-center gap-2">
                <button className="text-gray-500 hover:text-gray-600 dark:text-neutral-500 dark:hover:text-gray-300">
                    <Filter className="h-5 w-5" />
                </button>
                <button className="text-gray-500 hover:text-gray-600 dark:text-neutral-500 dark:hover:text-gray-300">
                    <Share2 className="h-5 w-5" />
                </button>
                <div className="relative">
                    <input type="text" placeholder="Pesquisar tarefa..." className="rounded-md border py-1 pl-10 pr-4 focus:outline-none dark:border-dark-secondary dark:bg-dark-secondary dark:text-white"/>
                    <Grid3X3 className="absolute left-3 top-2 h-4 w-4 text-gray-400 dark:text-neutral-500"/>
                </div>
            </div>
        </div>
    </div>
  )
}

export default ProjectHeader

type TabButtonProps = {
    name: string;
    icon: React.ReactNode;
    setActiveTab: (tab: string) => void;
    activeTab: string;
}

const TabButton = ({ name, icon, setActiveTab, activeTab}: TabButtonProps) => {
    const isActive = activeTab === name;

    return (
        <button className={`relative flex items-center gap-2 px-1 py-2 text-gray-500 after:absolute after:-bottom-[2px]
            after:left-0 after:h-[2px] after:w-full hover:text-blue-600 dark:text-neutral-500 dark:hover:text-white sm:px-2
            lg:px-4 ${isActive ? "text-blue-600 after:bg-blue-600 dark:text-white" : ""}`} onClick={() => setActiveTab(name)}>
                {icon}
                {name}
        </button>
    )
}