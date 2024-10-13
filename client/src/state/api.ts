import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// usando o createApi e o fetchBaseQuery do RTK Query para criar uma instância da API
// que pode ser usada para fazer solicitações de API

export const api = createApi({          // criamos uma interface para nos comunicar com a api
    baseQuery: fetchBaseQuery({ baseUrl: process.env.NEXT_PUBLIC_API_URL }),        // definimos uma url base para as requisicoes, que é uma variavel de ambiente
    reducerPath: "api",                 // definimos o nome do slice no estado global, e os acessamos com state.api
    tagTypes: [],                       // lista de tags que serão usadas nas requisicoes para invalidar/atualizar o cache de acordo com a tag usada na requisicao  
    endpoints: (build) => ({}),         // aqui serao definidos os endpoints da api, mas por enquanto nao temos nenhum
})

export const {} = api;                  // quando fazemos uma query, o RTK Query cria automaticamente um hook para acessar os dados da query