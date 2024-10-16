"use client";

import { AlertCircle, AlertOctagon, AlertTriangle, Briefcase, ChevronDown, ChevronUp, Home, Layers3, LockIcon, LucideIcon, Search, Settings, ShieldAlert, User, Users } from 'lucide-react';
import Image from 'next/image';
import React, { useState } from 'react'
import { usePathname } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '../../app/redux';
import Link from 'next/link';
import { setIsSidebarCollapsed } from '@/src/state';
import { X } from 'lucide-react';
import { useGetProjectsQuery, useGetAuthUserQuery } from '@/src/state/api';
import { signOut } from 'aws-amplify/auth';

function Sidebar() {

    const [showProjects, setShowProjects] = useState(true);
    const [showPriority, setShowPriority] = useState(true);

    const { data: currentUser } = useGetAuthUserQuery({});

    const handleSignout = async () => {
      try {
        await signOut();
      } catch (error) {
        console.error("Erro ao fazer logout", error);
      }
    }

    const { data: projects } = useGetProjectsQuery(); // usando o useProjectQuery para pegar os dados dos projetos
    console.log(projects)

    
    const dispatch = useAppDispatch();    // importando o useAppDispatch, que é um useDispatch tipado, para despachar ações para o estado global, que ativará reducers para mudar o estado de alguma parte da aplicação
    const isSidebarCollapsed = useAppSelector((state) => state.global.isSidebarCollapsed);  // usando o useAppSelector, que é um useSelector tipado, para acessar o estado global e pegar o valor de isSidebarCollapsed
    
    if(!currentUser) return null;
    const currentUserDetails = currentUser?.userDetails
    const sidebarClassNames = `fixed flex flex-col h-full justify-between shadow-xl overflow-x-hidden
        transition-all duration-500 ease-in-out h-[100%] z-40 dark:bg-black overflow-y-auto bg-white
        ${isSidebarCollapsed ? "w-0 hidden" : "w-64"}
    `;

  return (
    <div className={sidebarClassNames}>
        <div className="flex h-[100%] w-full flex-col justify-start">
            {/* TOP SIDEBAR */}
            <div className="z-50 flex min-h-[56px] w-64 items-center justify-between bg-white px-6 pt-3 dark:bg-black">
                <div className="text-xl font-bold text-gray-800 dark:text-white">
                    Projeej
                </div>
                {isSidebarCollapsed ? null : (
                    <button className="py-3 hover:scale-110 transition-all duration-200" onClick={() => dispatch(setIsSidebarCollapsed(!isSidebarCollapsed))}>
                        <X className="h-6 w-6 cursor-pointer dark:text-white"/>
                    </button>
                )}
            </div>
            {/* TIME SIDEBAR */}
            <div className="flex items-center gap-5 border-y-[1.5px] border-gray-200 px-8 py-4 dark:border-gray-700">
                <Image src="https://projectmanagement-s3-bucket.s3.amazonaws.com/logo.png" alt="Logo" width={40} height={40} />
                <div>
                    <h3 className="text-md font-bold tracking-wide dark:text-gray-200">
                        Teste
                    </h3>
                    <div className="mt-1 flex items-start gap-2">
                        <LockIcon className="mt-[0.1rem] h-3 w-3 text-gray-500 dark:text-gray-400"/>
                        <p className="text-xs text-gray-500">Privado</p>
                    </div>
                </div>
            </div>
            {/* NAVBAR LINKS */}
                <nav className="z-10 w-full">
                    <SidebarLinks href={"/"} icon={Home} label="Home" />
                    <SidebarLinks href={"/timeline"} icon={Briefcase} label="Timeline" />
                    <SidebarLinks href={"/search"} icon={Search} label="Pesquisa" />
                    <SidebarLinks href={"/settings"} icon={Settings} label="Configurações" />
                    <SidebarLinks href={"/users"} icon={User} label="Usuários" />
                    <SidebarLinks href={"/teams"} icon={Users} label="Times" />
                </nav>
                <button onClick={() => setShowProjects((prev) => !prev)} className="flex w-full items-center justify-between px-8 py-3 text-gray-600">
                    <span className="">Projetos</span>
                    {showProjects ? (
                        <ChevronUp className="h-5 w-5" />
                    ): <ChevronDown className="h-5 w-5"/>}
                </button>
                { /* LISTA DE PROJETOS */ }
                {showProjects && projects?.map((project) => (
                    <SidebarLinks key={project.id} href={`/projects/${project.id}`} icon={Briefcase} label={project.name} />
                ))}
                <button onClick={() => setShowPriority((prev) => !prev)} className="flex w-full items-center justify-between px-8 py-3 text-gray-600">
                    <span className="">Prioridades</span>
                    {showPriority ? (
                        <ChevronUp className="h-5 w-5" />
                    ): <ChevronDown className="h-5 w-5"/>}
                </button>
                {/* LISTA DE PRIORIDADES */}
                {showPriority && (
                    <>
                      <SidebarLinks href={"/priority/urgent"} icon={AlertCircle} label="Urgente" />
                      <SidebarLinks href={"/priority/high"} icon={ShieldAlert} label="Alta" />
                      <SidebarLinks href={"/priority/medium"} icon={AlertTriangle} label="Média" />
                      <SidebarLinks href={"/priority/low"} icon={AlertOctagon} label="Baixa" />
                      <SidebarLinks href={"/priority/backlog"} icon={Layers3} label="Backlog" />  
                    </>
                )}
            </div>
            <div className="z-10 mt-32 flex w-full flex-col items-center gap-4 bg-white px-8 py-4 dark:bg-black md:hidden">
                <div className="flex w-full items-center">
                    <div className="align-center flex h-9 w-9 justify-center">
                    {!!currentUserDetails?.profilePictureUrl ? (
                        <Image 
                        src={`https://projectmanagement-s3-bucket.s3.amazonaws.com${currentUserDetails?.profilePictureUrl}`} 
                        alt={currentUserDetails?.username || "Foto de perfil do usuário"}  
                        className="rounded-full h-full object-cover" 
                        width={100} 
                        height={50} 
                        />
                    ) : <User className="h-6 w-6 cursor-pointer self-center rounded-full dark:text-white" />}
                    </div>
                    <span className="mx-3 text-gray-800 dark:text-white">
                    {currentUserDetails?.username}
                    </span>
                    <button className="self-start rounded bg-blue-400 px-4 py-2 text-xs font-bold text-white hover:bg-blue-500 md:block" onClick={handleSignout}>
                    Logout
                    </button>
                </div>
            </div>
        </div>
  )
}

interface SidebarLinkProps {
    href: string,                   // cada link tera seu href, seu icone, seu label e se a sidebar está colapsada ou não
    icon: LucideIcon,
    label: string;
    // isCollapsed: boolean;
}

const SidebarLinks = ({href, icon: Icon, label }: SidebarLinkProps) => {
    const pathName = usePathname();                                                         // usando o usePathname para pegar o pathname atual, para, posteriormente, dar highlight no link da sidebar que estamos
    const isActive = pathName === href || (pathName==="/" && href==="/dashboard")           // o isActive vai verificar se estamos na pagina de um link da sidebar (a excecao é a home, que é o dashboard)
    
    return (
        <Link href={href} className="w-full">
            <div className={
                `relative flex cursor-pointer items-center gap-3 transition-colors hover:bg-gray-100 dark:bg-black dark:hover:bg-gray-700 ${
                    isActive ? "bg-gray-100 text-white dark:bg-gray-600" : ""} justify-start px-8 py-4`
            }>
                {isActive && (
                    <div className="absolute left-0 top-0 h-[100%] w-[5px] bg-blue-300"/>
                )}

                <Icon className="h-6 w-6 text-gray-800 dark:text-gray-100"/>
                <span className={`font-medium text-gray-800 dark:text-gray-100`}>{label}</span>
            </div>
        </Link>
    )
}

export default Sidebar
