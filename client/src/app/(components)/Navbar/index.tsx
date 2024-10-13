import React from 'react'
import { Menu, Moon, Search, Settings, Sun } from 'lucide-react';
import Link from 'next/link';
import { useAppDispatch, useAppSelector } from '../../redux';
import { setIsDarkMode, setIsSidebarCollapsed } from '@/src/state';

  const Navbar = () => {

    const dispatch = useAppDispatch();    // importando o useAppDispatch, que é um useDispatch tipado, para despachar ações para o estado global, que ativará reducers para mudar o estado de alguma parte da aplicação
    const isSidebarCollapsed = useAppSelector((state) => state.global.isSidebarCollapsed);  // usando o useAppSelector, que é um useSelector tipado, para acessar o estado global e pegar o valor de isSidebarCollapsed
    const isDarkMode = useAppSelector((state) => state.global.isDarkMode);                  // mesma coisa para o isDarkMode

    return (
      <div className="flex items-center justify-between bg-white px-4 py-3 dark:bg-black">
        {/* Barra de Pesquisa */}
        <div className="flex items-center gap-8">

          {!isSidebarCollapsed ? null : (     // botão na navbar para abrir ou fechar a sidebar
            <button onClick={()=> dispatch(setIsSidebarCollapsed(!isSidebarCollapsed))}>
              <Menu className="h-8 w-8 cursor-pointer dark:text-white"/>
            </button>
          )}

          <div className="relative flex h-min w-[200px]">
            <Search className="absolute left-[4px] top-1/2 mr-2 h-5 w-5 -translate-y-1/2 transform cursor-pointer dark:text-white"/>
            <input className="w-full rounded border-none bg-gray-100 p-2 pl-10 placeholder-gray-500 focus:border-transparent focus:outline-none dark:bg-gray-700 dark:text-white dark:placeholder-white" 
              type="search"
              placeholder="Pesquisar..."
            />
          </div>
        </div>

        {/* Icones */}
        <div className="flex items-center">
          <button onClick={() =>dispatch(setIsDarkMode(!isDarkMode))}
            className={isDarkMode ? `rounded p-2 dark:hover:bg-gray-700` : `rounded p-2 hover:bg-gray-100`}>
              {isDarkMode ? (
                <Sun className="h-6 w-6 cursor-pointer dark:text-white"/>
              ) : (
                <Moon className= "h-6 w-6 cursor-pointer dark:text-white" />
              )}
          </button>
          <Link href="/settings" className={isDarkMode ? `h-min w-min rounded p-2 dark:hover:bg-gray-700` : `h-min w-min rounded p-2 hover:bg-gray-100`}>
            <Settings className="h-6 w-6 cursor-pointer dark:text-white" />
          </Link>
          <div className="ml-2 mr-5 hidden min-h-[2em] w-[0.1rem] bg-gray-200 md:inline-block">

          </div>
        </div>


      </div>
    )
  }

  export default Navbar