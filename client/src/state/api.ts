import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// usando o createApi e o fetchBaseQuery do RTK Query para criar uma instância da API
// que pode ser usada para fazer solicitações de API

/* enums */

export enum Priority {
    Low = "Low",
    Medium = "Medium",
    High = "High",
    Urgent = "Urgent",
    Backlog = "Backlog",
}

export enum Status {
    ToDo = "To Do",
    WorkInProgress = "Work In Progress",
    UnderReview = "Under Review",
    Completed = "Completed"
}

/* tipos */

export interface User {
    userId?: number;
    username: string;
    email: string;
    profilePictureUrl?: string;
    cognitoId?: string;
    teamId?: number;
}

export interface Team {
    teamId: number;
    teamName: string;
    productOwnerUserId?: number;
    productManagerUserId?: number;
}

export interface Attachment {
    id: number;
    fileURL: string;
    fileName: string;
    taskId: number;
    uploadedById: number; 
}

export interface Project {
    id: number;
    name: string;
    description?: string;
    startDate?: string;
    endDate?: string;
}

export interface Tasks {
    id: number;
    title: string;
    description?: string;
    status?: Status;
    priority?: Priority;
    tags?: string;
    startDate?: string;
    dueDate?: string;
    points?: number;
    projectId: number;
    authorUserId?: number;
    assignedUserId?: number;

    author?: User;
    assignee?: User;
    comments?: Comment[];
    attachments?: Attachment[];
}

export interface SearchResults {
    tasks?: Tasks[];
    projects?: Project[];
    users?: User[];
}

/* criacao de instancia da api */

export const api = createApi({
    baseQuery: fetchBaseQuery({ baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL }),   // definimos uma url base para as requisicoes, que é uma variavel de ambiente
    reducerPath: "api",                                                             // definimos o nome do slice no estado global, e os acessamos com state.api
    tagTypes: ["Projects", "Tasks", "Users","Teams"],                               // lista de tags que serão usadas nas requisicoes para invalidar/atualizar o cache de acordo com a tag usada na requisicao  
    endpoints: (build) => ({                                                        // criando nossos endpoints
        getProjects: build.query<Project[], void>({                                 // a função getProjects recebe como parametro void e retorna uma lista de Projetos                   
            query: () => "projects",                                                // a query é a url que será acessada para pegar os projetos. nesse caso, será /projects
            providesTags: ["Projects"],                                             // a tag da query será Projects, o que ajudará a invalida-la depois que criarmos novos projetos
        }),
        createProject: build.mutation<Project, Partial<Project>>({                  // a função createProject é uma mutação, ou seja, fará alterações no banco de dados. ela recebe um parcial de um projeto (não precisa ser todos os campos do projeto) e retorna o projeto criado
            query: (project) => ({
                url: "projects",                                                    // a rota da api que será acessadsa pela função createProject será /projects, com o parâmetro body, que será passado para a função quando quisermos fazer um post
                method: "POST",                                                     // faremos esse acesso com um metodo post
                body: project,                                                      // passaremos os dados do corpo da requisição na chamada a api
            }),
            invalidatesTags: ["Projects"],                                          // depois de criar o projeto no banco de dados, invalidamos a tag Projects, que é a tag da query de getProjects, para fazer com que a lista de projetos seja atualizada apos criar um novo
        }),
        getTasks: build.query<Tasks[], { projectId: number }>({                     // a função getTasks recebe um objeto com o projectId e retorna uma lista de tasks    
            query: ({ projectId }) => `tasks?projectId=${projectId}`,               // a rota que será acessada para pegar as tasks é /tasks?projectId=${projectId}. pegaremos as tasks de um projeto especifico usando o projectId da task
            providesTags: (result) =>                                               // pegamos o resultado da chamada a api e retornamos uma lista de tags que serão usadas para invalidar/atualizar o cache de acordo com o resultado                                            
                result                                                              // se a chamada a api der certo, retornamos uma tag para cada tarefa da lista de tarefas retornada pela api
                    ? result.map(({ id }) => ({ type: "Tasks" as const, id }))      // de cada task, desestruturamos o id dela e retornamos um objeto com o tipo Tasks e o id da task
                    : [{ type: "Tasks" as const }],                                 // se a api responder uma lista vazia, retornaremos apenas a tag Tasks.
        }),
        createTask: build.mutation<Tasks, Partial<Tasks>>({                         // a função createTask é uma mutação que recebe como parâmetro dados dos campos de uma task(não necessariamente todos) e retorna uma taskcriada
            query: (task) => ({                                                     // a função recebrá como parâmetro os dados de uma task, e fará uma chamada no endpoint /tasks com o metodo post para criar uma nova task, passando os dados do parametro da função
                url: "tasks",                                                       
                method: "POST",                                                     
                body: task,                                                               
            }),
            invalidatesTags: ["Tasks"],                                             // após criar uma nova task, invalidamos a query de tag Tasks, para fazer um refetch na função getTasks e atualizar a lista de todas as tasks assim que criarmos uma nova task                 
        }),
        updateTaskStatus: build.mutation<Tasks, {taskId: number, status: string}>({ // a função updateTaskStatus é uma mutação que recebe um objeto com o id da task que queremos atualizar e o novo status, retornando a task com o status atualizado           
            query: ({taskId, status}) => ({                                         // recebemos no parâmetro da função um objeto com o id da task e o novo status
                url: `tasks/${taskId}/status`,                                      // fazemos uma chamada a api com o metodo patch no endpoint /tasks/${taskId}/status, passando o status que passamos como parametro para a funcao no corpo da requisicao
                method: "PATCH",                                                     
                body: { status },                                                               
            }),
            invalidatesTags: (result, error, {taskId}) => [                         // apos atualizarmos o status de uma task, iremos invalidar a tag da task especifica que atualizados. essa tag foi criada especificamente com o id da task na funcao createTask.
                { type: "Tasks", id: taskId },
            ]
        }),
        search: build.query<SearchResults, { query: string }>({                     // a função search é uma query que recebe um objeto com a query de busca e retorna um objeto com os resultados da busca
            query: ({ query }) => `search?query=${query}`,                          // a rota que será acessada para fazer a busca é /search?query=${query}, passando a query que queremos buscar como
        }),
        getUsers: build.query<User[], void>({
            query: () => "users",
            providesTags: ["Users"],
        }),             
        getTeams: build.query<Team[], void>({
            query: () => "teams",
            providesTags: ["Teams"],
        })   
    }),
});


export const {
    useCreateProjectMutation, 
    useGetProjectsQuery, 
    useCreateTaskMutation, 
    useGetTasksQuery, 
    useUpdateTaskStatusMutation, 
    useSearchQuery,
    useGetUsersQuery,
    useGetTeamsQuery,
} = api;                                                          