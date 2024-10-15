"use client";

import { useSearchQuery } from '@/src/state/api';
import React, { useEffect, useState } from 'react'
import { debounce } from 'lodash';
import Header from '@/src/components/Header';
import TaskCard from '@/src/components/TaskCard';
import ProjectCard from '@/src/components/ProjectCard';
import UserCard from '@/src/components/UserCard';

const Search = () => {

    const [searchTerm, setSearchTerm] = useState("");
    const {data: searchResults, isLoading, isError} = useSearchQuery({query: searchTerm}, {
        skip: searchTerm.length < 3,
    });

    const handleSearch = debounce(
        (event: React.ChangeEvent<HTMLInputElement>) => {
            setSearchTerm(event.target.value);
        },
        500
    )

    useEffect(() => {
        return handleSearch.cancel;
    }, [handleSearch.cancel])

  return (
    <div className="p-8">
        <Header name="Pesquisa"/>
        <div>
            <input type="text" placeholder="Pesquisar..." className="w-1/2 rounded border p-3 shadow" onChange={handleSearch}/>
        </div>
        <div className="p-5">
            {isLoading && <p>Carregando...</p>}
            {isError && <p>Ocorreu um erro...</p>}
            {!isError && !isLoading && searchResults && (
                <div>
                    { searchResults.tasks && searchResults.tasks?.length > 0 && (
                       <h1 className="text-3xl font-semibold mb-5">Tasks</h1>
                    ) }
                    { searchResults.tasks?.map((task) => (
                        <TaskCard key={task.id} task={task}/>
                    ))}
                    { searchResults.projects && searchResults.projects?.length > 0 && (
                       <h1 className="text-3xl font-semibold mb-5">Projetos</h1>
                    ) }
                    { searchResults.projects?.map((project) => (
                        <ProjectCard key={project.id} project={project}/>
                    ))}
                    { searchResults.users && searchResults.users?.length > 0 && (
                       <h1 className="text-3xl font-semibold mb-5">Usuários</h1>
                    ) }
                    { searchResults.users?.map((user) => (
                        <UserCard key={user.userId} user={user}/>
                    ))}
                </div>
            )}

        </div>
    </div>
  )
}

export default Search